# Vistas del modulo loans.
# Aqui viven los endpoints CRUD y el flujo de firma electronica.

import datetime
import hashlib
import random
import string
import uuid

import django_filters
import jwt
from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Loans, SignOTP
from .serializers import LoanSerializer
from modules.permissions.permissions_drf import HasPermission, IsSuperUser
from modules.users.models import BlacklistedToken

# ─────────────────────────────────────────────────────────────────────────────
# Constantes
# ─────────────────────────────────────────────────────────────────────────────
_SIGN_TOKEN_TTL_MINUTES = 60 * 4   # 4 h por enlace de firma
_OTP_RL_MAX    = 5
_OTP_RL_WINDOW = 60 * 15
_OTP_RL_MSG    = "Demasiadas solicitudes de código. Intenta nuevamente en 15 minutos."
_SIGN_RL_MAX    = 10
_SIGN_RL_WINDOW = 60 * 15
_SIGN_RL_MSG    = "Demasiados intentos de firma. Intenta nuevamente en 15 minutos."

# ─────────────────────────────────────────────────────────────────────────────
# Helpers de rate limiting
# ─────────────────────────────────────────────────────────────────────────────

def _rl_key(request, prefix: str) -> str:
    ip = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", "unknown"))
    return f"{prefix}_{ip.split(',')[0].strip()}"

def _check_rl(request, prefix, max_attempts, msg):
    if cache.get(_rl_key(request, prefix), 0) >= max_attempts:
        return Response({"error": msg}, status=status.HTTP_429_TOO_MANY_REQUESTS)
    return None

def _record_rl(request, prefix, window):
    key = _rl_key(request, prefix)
    cache.add(key, 0, timeout=window)
    cache.incr(key)

def _reset_rl(request, prefix):
    cache.delete(_rl_key(request, prefix))

def _get_client_ip(request) -> str:
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    return xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR", "")


# ─────────────────────────────────────────────────────────────────────────────
# Helpers de token y correo
# ─────────────────────────────────────────────────────────────────────────────

def _build_sign_token(batch_id: str, role: str, user_id: int) -> str:
    """
    JWT de firma con batch_id (no loan_id individual).
    Un solo token cubre todos los préstamos del lote.
    Op.2: user_id embebido para validación triple.
    """
    payload = {
        "batch_id": str(batch_id),
        "role":     role,
        "user_id":  user_id,
        "scope":    "loan_sign",
        "exp":      datetime.datetime.utcnow() + datetime.timedelta(minutes=_SIGN_TOKEN_TTL_MINUTES),
        "iat":      datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def _send_sign_email(user, loans_in_batch: list, role: str, token: str) -> None:
    """
    Envía UN SOLO correo de firma por persona, listando todos los materiales
    del lote. Sin importar cuántos préstamos tenga el lote.
    """
    sign_link  = f"{settings.FRONTEND_URL}/prestamos/firmar?token={token}"
    role_label = "responsable del préstamo" if role == "responsable" else "receptor del material"
    first_loan = loans_in_batch[0]

    materials_lines = "\n".join(
        f"  • {l.id_material.name} — cantidad: {l.amount_lent}"
        for l in loans_in_batch
    )

    send_mail(
        subject="Firma requerida — Préstamo de material SGI",
        message=(
            f"Hola {user.first_name},\n\n"
            f"Se ha registrado un préstamo en el que figuras como {role_label}.\n"
            f"Para confirmar la entrega, firma haciendo clic en el siguiente enlace "
            f"(válido por {_SIGN_TOKEN_TTL_MINUTES // 60} horas):\n\n"
            f"{sign_link}\n\n"
            f"Materiales del préstamo:\n{materials_lines}\n"
            f"  • Grupo:  {first_loan.apprentice_group}\n"
            f"  • Fecha:  {first_loan.loan_date}\n\n"
            "Al abrir el enlace se te pedirá un código de verificación que recibirás "
            "en un correo separado en ese momento.\n\n"
            "Si no reconoces este préstamo, avisa al administrador."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def _send_otp_email(user, code: str, loans_in_batch: list) -> None:
    """Envía UN SOLO correo OTP que cubre todo el lote."""
    materials_lines = "\n".join(
        f"  • {l.id_material.name} — cantidad: {l.amount_lent}"
        for l in loans_in_batch
    )
    send_mail(
        subject="Tu código de verificación de firma — SGI",
        message=(
            f"Hola {user.first_name},\n\n"
            f"Tu código de verificación para firmar el siguiente préstamo es:\n\n"
            f"    {code}\n\n"
            f"Materiales:\n{materials_lines}\n\n"
            f"Este código es válido por {SignOTP.OTP_TTL_MINUTES} minutos y solo puede "
            f"usarse una vez.\n\n"
            "Si no solicitaste este código, contacta al administrador de inmediato."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


# ─────────────────────────────────────────────────────────────────────────────
# FilterSet
# ─────────────────────────────────────────────────────────────────────────────

class LoanFilter(django_filters.FilterSet):
    loan_date_after  = django_filters.DateFilter(field_name='loan_date', lookup_expr='gte')
    loan_date_before = django_filters.DateFilter(field_name='loan_date', lookup_expr='lte')

    class Meta:
        model  = Loans
        fields = {
            'state':               ['exact'],
            'apprentice_group':    ['exact', 'icontains'],
            'id_responsable_user': ['exact'],
            'id_receptor_user':    ['exact'],
        }


# ─────────────────────────────────────────────────────────────────────────────
# ViewSet principal
# ─────────────────────────────────────────────────────────────────────────────

class LoanViewSet(viewsets.ModelViewSet):
    serializer_class = LoanSerializer
    filter_backends  = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class  = LoanFilter
    search_fields    = ['apprentice_group', 'id_material__name', 'justification_use']
    ordering_fields  = ['loan_date', 'return_date', 'state', 'id_loan']

    def _user_is_admin(self):
        user = self.request.user
        if user.is_superuser:
            return True
        from modules.permissions.models import UserGroup
        return UserGroup.objects.filter(user=user, group__name__iexact='admin').exists()

    def get_queryset(self):
        base_qs = Loans.objects.select_related(
            'id_responsable_user', 'id_receptor_user', 'id_material',
            'signed_by_responsable', 'signed_by_receptor',
        ).order_by('id_loan')
        if self._user_is_admin():
            return base_qs
        user = self.request.user
        return base_qs.filter(Q(id_responsable_user=user) | Q(id_receptor_user=user))

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [HasPermission("view_loan")]
        if self.action == "create":
            return [HasPermission("create_loan")]
        if self.action in ("update", "partial_update"):
            return [HasPermission("edit_loan")]
        return [IsSuperUser()]

    # ── create ────────────────────────────────────────────────────────────

    def _create_single(self, loan_data):
        serializer = self.get_serializer(data=loan_data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    def _dispatch_batch_sign_emails(self, loans: list) -> None:
        """
        Genera UN token y envía UN correo de firma por rol (responsable/receptor),
        independientemente de cuántos préstamos tenga el lote.
        El token lleva batch_id, role y user_id (Op.2).
        """
        first = loans[0]
        batch_id = first.batch_id

        for role, user in [
            ("responsable", first.id_responsable_user),
            ("receptor",    first.id_receptor_user),
        ]:
            token = _build_sign_token(batch_id, role, user.id)
            try:
                _send_sign_email(user, loans, role, token)
            except Exception:
                pass   # fallo de correo no aborta la creación

    def create(self, request, *args, **kwargs):
        material_ids = request.data.get("id_material")
        batch = uuid.uuid4()   # UUID único para todo este lote

        # ── creación simple (un solo material) ────────────────────────────
        if not isinstance(material_ids, list):
            data = request.data.copy()
            data["batch_id"] = str(batch)
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                loan = serializer.save(batch_id=batch)
            self._dispatch_batch_sign_emails([loan])
            return Response(self.get_serializer(loan).data, status=status.HTTP_201_CREATED)

        # ── creación múltiple ─────────────────────────────────────────────
        if not material_ids:
            return Response(
                {"id_material": ["Debe seleccionar al menos un material."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        loan_amounts = request.data.get("amount_lent")
        if not isinstance(loan_amounts, dict) or any(
            str(mid) not in loan_amounts for mid in material_ids
        ):
            return Response(
                {"amount_lent": ["Debe indicar una cantidad para cada material."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        loans = []
        with transaction.atomic():
            for material_id in material_ids:
                ld = request.data.copy()
                ld["id_material"] = material_id
                ld["amount_lent"] = loan_amounts.get(str(material_id))
                loan = self._create_single(ld)
                loan.batch_id = batch
                loan.save(update_fields=["batch_id"])
                loans.append(loan)

        # Un solo correo por rol para todo el lote
        self._dispatch_batch_sign_emails(loans)
        return Response(self.get_serializer(loans, many=True).data, status=status.HTTP_201_CREATED)

    # ── update / partial_update / destroy ────────────────────────────────

    def _check_loan_is_active(self, instance):
        if instance.state != 'Activo':
            return Response(
                {"error": (
                    f"Solo se pueden modificar préstamos en estado 'Activo'. "
                    f"Este préstamo está en estado '{instance.state}'."
                )},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return None

    def _invalidate_pending_sign_tokens(self, loan):
        """
        Op.5: limpia OTPs activos y firmas parciales de todos los préstamos
        del mismo lote, luego reagenda los correos.
        """
        if loan.batch_id:
            batch_loans = Loans.objects.filter(batch_id=loan.batch_id)
            SignOTP.objects.filter(batch_id=loan.batch_id, used=False).delete()
            batch_loans.update(
                signed_by_responsable=None, signed_at_responsable=None,
                signed_ip_responsable=None, signed_ua_responsable=None,
                signed_by_receptor=None,    signed_at_receptor=None,
                signed_ip_receptor=None,    signed_ua_receptor=None,
            )
        else:
            SignOTP.objects.filter(loan=loan, used=False).delete()
            loan.signed_by_responsable = None
            loan.signed_at_responsable = None
            loan.signed_ip_responsable = None
            loan.signed_ua_responsable = None
            loan.signed_by_receptor    = None
            loan.signed_at_receptor    = None
            loan.signed_ip_receptor    = None
            loan.signed_ua_receptor    = None
            loan.save(update_fields=[
                'signed_by_responsable', 'signed_at_responsable',
                'signed_ip_responsable', 'signed_ua_responsable',
                'signed_by_receptor',    'signed_at_receptor',
                'signed_ip_receptor',    'signed_ua_receptor',
            ])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.state == 'Pendiente':
            self._invalidate_pending_sign_tokens(instance)
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        was_pending = instance.state == 'Pendiente'
        if not was_pending:
            error = self._check_loan_is_active(instance)
            if error:
                return error
        if was_pending:
            self._invalidate_pending_sign_tokens(instance)
        response = super().update(request, *args, **kwargs)
        if was_pending:
            instance.refresh_from_db()
            self._dispatch_batch_sign_emails([instance])
        return response

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        was_pending = instance.state == 'Pendiente'
        if not was_pending:
            error = self._check_loan_is_active(instance)
            if error:
                return error
        if was_pending:
            self._invalidate_pending_sign_tokens(instance)
        response = super().partial_update(request, *args, **kwargs)
        if was_pending:
            instance.refresh_from_db()
            self._dispatch_batch_sign_emails([instance])
        return response


# ─────────────────────────────────────────────────────────────────────────────
# Helpers internos de firma (compartidos por los dos endpoints)
# ─────────────────────────────────────────────────────────────────────────────

def _decode_sign_token(raw_token):
    """
    Decodifica y valida básicamente el token de firma.
    Devuelve (payload, error_response).
    """
    try:
        payload = jwt.decode(raw_token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None, Response(
            {"error": "El enlace de firma ha expirado. Solicita uno nuevo al administrador."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except jwt.InvalidTokenError:
        return None, Response(
            {"error": "El enlace de firma no es válido."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if payload.get("scope") != "loan_sign":
        return None, Response(
            {"error": "El enlace no es válido para esta operación."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return payload, None


def _get_batch_loans(batch_id_str):
    """
    Devuelve (loans_qs, error_response) para un batch_id dado.
    """
    try:
        bid = uuid.UUID(batch_id_str)
    except (ValueError, AttributeError):
        return None, Response(
            {"error": "El enlace no es válido."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    loans = list(
        Loans.objects.select_related(
            'id_responsable_user', 'id_receptor_user', 'id_material'
        ).filter(batch_id=bid)
    )
    if not loans:
        return None, Response(
            {"error": "No se encontraron préstamos asociados al enlace."},
            status=status.HTTP_404_NOT_FOUND,
        )
    return loans, None


def _verify_all_pending(loans):
    """Devuelve error_response si algún préstamo del lote ya no está Pendiente."""
    non_pending = [l for l in loans if l.state != 'Pendiente']
    if non_pending:
        return Response(
            {"error": "Uno o más préstamos del lote ya no están pendientes de firma."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return None


def _verify_identity(request, loans, role):
    """Devuelve error_response si el usuario autenticado no es quien debe firmar."""
    expected_user = loans[0].id_responsable_user if role == "responsable" else loans[0].id_receptor_user
    if request.user.id != expected_user.id:
        return Response(
            {"error": "No tienes permiso para firmar este préstamo."},
            status=status.HTTP_403_FORBIDDEN,
        )
    return None


# ─────────────────────────────────────────────────────────────────────────────
# Endpoint: solicitar OTP por lote
# ─────────────────────────────────────────────────────────────────────────────

class LoanSignRequestOTPView(APIView):
    """
    POST /api/loans/sign/request-otp/
    Body: { "token": "<jwt de firma>" }

    Genera y envía UN SOLO código OTP que cubre todo el lote.
    Rate-limited: máx 5 solicitudes por IP en 15 min.
    """

    def post(self, request):
        blocked = _check_rl(request, "otp_request", _OTP_RL_MAX, _OTP_RL_MSG)
        if blocked:
            return blocked

        raw_token = request.data.get("token")
        if not raw_token:
            return Response({"error": "El token es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        payload, err = _decode_sign_token(raw_token)
        if err:
            _record_rl(request, "otp_request", _OTP_RL_WINDOW)
            return err

        # Op.2 — user_id en token debe coincidir con la sesión
        if payload.get("user_id") != request.user.id:
            return Response(
                {"error": "El enlace de firma corresponde a otro usuario."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Token ya usado
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        if BlacklistedToken.objects.filter(token_hash=token_hash).exists():
            return Response(
                {"error": "Este enlace ya fue utilizado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        role     = payload.get("role")
        batch_id = payload.get("batch_id")

        if role not in ("responsable", "receptor"):
            return Response({"error": "El enlace no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        loans, err = _get_batch_loans(batch_id)
        if err:
            return err

        err = _verify_all_pending(loans)
        if err:
            return err

        err = _verify_identity(request, loans, role)
        if err:
            return err

        # Invalidar OTPs previos no usados del mismo lote/rol
        SignOTP.objects.filter(batch_id=uuid.UUID(batch_id), user=request.user, role=role, used=False).delete()

        # Generar OTP de 6 dígitos
        code       = "".join(random.choices(string.digits, k=6))
        code_hash  = hashlib.sha256(code.encode()).hexdigest()
        expires_at = timezone.now() + datetime.timedelta(minutes=SignOTP.OTP_TTL_MINUTES)

        # Un solo registro OTP referencia el primer préstamo + batch_id
        SignOTP.objects.create(
            loan=loans[0],
            batch_id=uuid.UUID(batch_id),
            user=request.user,
            role=role,
            code_hash=code_hash,
            expires_at=expires_at,
        )

        try:
            _send_otp_email(request.user, code, loans)
        except Exception:
            return Response(
                {"error": "No se pudo enviar el código de verificación. Intenta nuevamente."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        _reset_rl(request, "otp_request")

        return Response(
            {
                "message": (
                    f"Código enviado a {request.user.email}. "
                    f"Válido por {SignOTP.OTP_TTL_MINUTES} minutos."
                ),
                "expires_in_minutes": SignOTP.OTP_TTL_MINUTES,
            },
            status=status.HTTP_200_OK,
        )


# ─────────────────────────────────────────────────────────────────────────────
# Endpoint: confirmar firma con OTP (activa todo el lote)
# ─────────────────────────────────────────────────────────────────────────────

class LoanSignView(APIView):
    """
    POST /api/loans/sign/
    Body: { "token": "<jwt de firma>", "otp_code": "123456" }

    Valida triple coincidencia (sesión + user_id en token + OTP correcto),
    registra la firma en TODOS los préstamos del lote y los activa cuando
    ambas partes han firmado. Rate-limited. Registra IP y User-Agent.
    """

    def post(self, request):
        blocked = _check_rl(request, "sign_attempt", _SIGN_RL_MAX, _SIGN_RL_MSG)
        if blocked:
            return blocked

        raw_token = request.data.get("token")
        otp_code  = str(request.data.get("otp_code", "")).strip()

        if not raw_token or not otp_code:
            return Response(
                {"error": "El token y el código de verificación son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payload, err = _decode_sign_token(raw_token)
        if err:
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            return err

        # Op.2 — user_id en token debe coincidir con la sesión
        if payload.get("user_id") != request.user.id:
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            return Response(
                {"error": "El enlace de firma corresponde a otro usuario."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Token ya usado
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        if BlacklistedToken.objects.filter(token_hash=token_hash).exists():
            return Response(
                {"error": "Este enlace ya fue utilizado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        role     = payload.get("role")
        batch_id = payload.get("batch_id")

        if role not in ("responsable", "receptor"):
            return Response({"error": "El enlace no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        loans, err = _get_batch_loans(batch_id)
        if err:
            return err

        err = _verify_all_pending(loans)
        if err:
            return err

        err = _verify_identity(request, loans, role)
        if err:
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            return err

        # Validar OTP
        otp_record = (
            SignOTP.objects
            .filter(batch_id=uuid.UUID(batch_id), user=request.user, role=role, used=False)
            .order_by('-created_at')
            .first()
        )

        if otp_record is None or not otp_record.is_valid:
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            return Response(
                {"error": "El código no existe, expiró o fue invalidado. Solicita uno nuevo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hashlib.sha256(otp_code.encode()).hexdigest() != otp_record.code_hash:
            otp_record.attempts += 1
            otp_record.save(update_fields=["attempts"])
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            remaining = SignOTP.OTP_MAX_ATTEMPTS - otp_record.attempts
            msg = (
                f"Código incorrecto. Te quedan {remaining} intento(s)."
                if remaining > 0
                else "Código incorrecto. Límite de intentos superado. Solicita uno nuevo."
            )
            return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)

        # ── Todo correcto: firmar todos los préstamos del lote ────────────
        now        = timezone.now()
        client_ip  = _get_client_ip(request)
        user_agent = request.META.get("HTTP_USER_AGENT", "")[:500]

        with transaction.atomic():
            update_fields = {}
            if role == "responsable":
                update_fields = dict(
                    signed_by_responsable=request.user,
                    signed_at_responsable=now,
                    signed_ip_responsable=client_ip,
                    signed_ua_responsable=user_agent,
                )
            else:
                update_fields = dict(
                    signed_by_receptor=request.user,
                    signed_at_receptor=now,
                    signed_ip_receptor=client_ip,
                    signed_ua_receptor=user_agent,
                )

            for loan in loans:
                for field, value in update_fields.items():
                    setattr(loan, field, value)
                # Recargar valores actuales del otro rol para evaluar both_signed
                loan.refresh_from_db(fields=[
                    'signed_by_responsable', 'signed_by_receptor',
                    'signed_at_responsable', 'signed_at_receptor',
                    'signed_ip_responsable', 'signed_ip_receptor',
                    'signed_ua_responsable', 'signed_ua_receptor',
                ])
                for field, value in update_fields.items():
                    setattr(loan, field, value)
                if loan.both_signed:
                    loan.state = 'Activo'
                loan.save()

            # Marcar OTP como usado
            otp_record.used = True
            otp_record.save(update_fields=["used"])

            # Invalidar el token de firma (uso único, blacklist)
            exp_ts     = payload.get("exp")
            expires_at = (
                datetime.datetime.fromtimestamp(exp_ts, tz=datetime.timezone.utc)
                if exp_ts
                else timezone.now() + datetime.timedelta(minutes=_SIGN_TOKEN_TTL_MINUTES)
            )
            BlacklistedToken.objects.get_or_create(
                token_hash=token_hash,
                defaults={"expires_at": expires_at},
            )

        _reset_rl(request, "sign_attempt")

        activated  = all(l.state == 'Activo' for l in loans)
        role_label = "Responsable" if role == "responsable" else "Receptor"
        n          = len(loans)
        return Response(
            {
                "message": (
                    f"Firma registrada correctamente como {role_label} "
                    f"para {n} préstamo(s). "
                    + ("Todos los préstamos del lote están ahora Activos."
                       if activated
                       else "En espera de la firma de la otra parte.")
                ),
                "state":    "Activo" if activated else "Pendiente",
                "batch_id": batch_id,
                "loans":    [l.id_loan for l in loans],
            },
            status=status.HTTP_200_OK,
        )
