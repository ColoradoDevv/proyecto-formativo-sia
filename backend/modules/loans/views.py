# Vistas del modulo loans.
# Aqui viven los endpoints CRUD y el flujo de firma electronica.

import datetime
import hashlib
import random
import string

import django_filters
import jwt
from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail
from django.db import transaction
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
_SIGN_TOKEN_TTL_MINUTES = 60 * 4   # Op.6: reducido a 4 h (era 24 h)

# Rate limiting para solicitud de OTP (Op.3)
_OTP_RL_MAX    = 5          # máximo 5 solicitudes de OTP por ventana
_OTP_RL_WINDOW = 60 * 15   # ventana de 15 minutos
_OTP_RL_MSG    = "Demasiadas solicitudes de código. Intenta nuevamente en 15 minutos."

# Rate limiting para intentos de firma (Op.3)
_SIGN_RL_MAX    = 10
_SIGN_RL_WINDOW = 60 * 15
_SIGN_RL_MSG    = "Demasiados intentos de firma. Intenta nuevamente en 15 minutos."


# ─────────────────────────────────────────────────────────────────────────────
# Helpers de rate limiting (reutiliza el patrón de users/views.py)
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


# ─────────────────────────────────────────────────────────────────────────────
# Helpers de token de firma
# ─────────────────────────────────────────────────────────────────────────────

def _build_sign_token(loan_id: int, role: str, user_id: int) -> str:
    """
    Genera un JWT de corta duración para que una parte firme el préstamo.
    Op.2: incluye user_id en el payload para validación triple.
    role: 'responsable' | 'receptor'
    """
    payload = {
        "loan_id": loan_id,
        "role":    role,
        "user_id": user_id,        # Op.2: identidad esperada embebida en el token
        "scope":   "loan_sign",
        "exp":     datetime.datetime.utcnow() + datetime.timedelta(minutes=_SIGN_TOKEN_TTL_MINUTES),
        "iat":     datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def _send_sign_email(user, loan, role: str, token: str) -> None:
    """Envía el correo con el enlace de firma."""
    sign_link  = f"{settings.FRONTEND_URL}/prestamos/firmar?token={token}"
    role_label = "responsable del préstamo" if role == "responsable" else "receptor del material"
    send_mail(
        subject="Firma requerida — Préstamo de material SGI",
        message=(
            f"Hola {user.first_name},\n\n"
            f"Se ha registrado un préstamo en el que figuras como {role_label}.\n"
            f"Para confirmar la entrega, firma haciendo clic en el siguiente enlace "
            f"(válido por {_SIGN_TOKEN_TTL_MINUTES // 60} horas):\n\n"
            f"{sign_link}\n\n"
            f"Detalles del préstamo:\n"
            f"  • Material:  {loan.id_material.name}\n"
            f"  • Cantidad:  {loan.amount_lent}\n"
            f"  • Grupo:     {loan.apprentice_group}\n"
            f"  • Fecha:     {loan.loan_date}\n\n"
            "Si no reconoces este préstamo, ignora este correo y avisa al administrador.\n\n"
            "Al abrir el enlace se te pedirá un código de verificación que recibirás "
            "en un correo separado en el momento en que intentes firmar."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def _send_otp_email(user, code: str, loan) -> None:
    """Envía el correo con el código OTP de 6 dígitos."""
    send_mail(
        subject="Tu código de verificación de firma — SGI",
        message=(
            f"Hola {user.first_name},\n\n"
            f"Tu código de verificación para firmar el préstamo del material "
            f"'{loan.id_material.name}' es:\n\n"
            f"    {code}\n\n"
            f"Este código es válido por {SignOTP.OTP_TTL_MINUTES} minutos y solo puede "
            f"usarse una vez.\n\n"
            "Si no solicitaste este código, alguien puede estar intentando firmar en tu "
            "nombre. Contacta al administrador de inmediato."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Helper: obtener IP real del cliente
# ─────────────────────────────────────────────────────────────────────────────

def _get_client_ip(request) -> str:
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "")


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
        from django.db.models import Q
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

    # ── create ───────────────────────────────────────────────────────────

    def _create_single(self, loan_data):
        serializer = self.get_serializer(data=loan_data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    def _dispatch_sign_emails(self, loan):
        """Genera tokens con user_id (Op.2) y envía correos de firma."""
        token_responsable = _build_sign_token(
            loan.id_loan, "responsable", loan.id_responsable_user_id
        )
        token_receptor = _build_sign_token(
            loan.id_loan, "receptor", loan.id_receptor_user_id
        )
        for user, role, token in [
            (loan.id_responsable_user, "responsable", token_responsable),
            (loan.id_receptor_user,    "receptor",    token_receptor),
        ]:
            try:
                _send_sign_email(user, loan, role, token)
            except Exception:
                pass

    def create(self, request, *args, **kwargs):
        material_ids = request.data.get("id_material")

        if not isinstance(material_ids, list):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                loan = serializer.save()
            self._dispatch_sign_emails(loan)
            return Response(self.get_serializer(loan).data, status=status.HTTP_201_CREATED)

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
                loans.append(self._create_single(ld))

        for loan in loans:
            self._dispatch_sign_emails(loan)

        return Response(self.get_serializer(loans, many=True).data, status=status.HTTP_201_CREATED)

    # ── update / partial_update ───────────────────────────────────────────

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
        Op.5: al editar o cancelar un préstamo Pendiente, limpiar firmas parciales,
        eliminar OTPs activos y forzar nuevos enlaces de firma.
        """
        SignOTP.objects.filter(loan=loan, used=False).delete()
        loan.signed_by_responsable = None
        loan.signed_at_responsable = None
        loan.signed_ip_responsable = None
        loan.signed_ua_responsable = None
        loan.signed_by_receptor = None
        loan.signed_at_receptor = None
        loan.signed_ip_receptor = None
        loan.signed_ua_receptor = None
        loan.save(update_fields=[
            'signed_by_responsable', 'signed_at_responsable',
            'signed_ip_responsable', 'signed_ua_responsable',
            'signed_by_receptor', 'signed_at_receptor',
            'signed_ip_receptor', 'signed_ua_receptor',
        ])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.state == 'Pendiente':
            self._invalidate_pending_sign_tokens(instance)
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # Op.5: si estaba Pendiente, limpiar OTPs y re-enviar correos tras guardar
        was_pending = instance.state == 'Pendiente'
        error = self._check_loan_is_active(instance)
        if error and not was_pending:
            return error
        if was_pending:
            self._invalidate_pending_sign_tokens(instance)
        response = super().update(request, *args, **kwargs)
        if was_pending:
            instance.refresh_from_db()
            self._dispatch_sign_emails(instance)
        return response

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        was_pending = instance.state == 'Pendiente'
        error = self._check_loan_is_active(instance)
        if error and not was_pending:
            return error
        if was_pending:
            self._invalidate_pending_sign_tokens(instance)
        response = super().partial_update(request, *args, **kwargs)
        if was_pending:
            instance.refresh_from_db()
            self._dispatch_sign_emails(instance)
        return response


# ─────────────────────────────────────────────────────────────────────────────
# Endpoint: solicitar OTP  (Op.1 + Op.3)
# ─────────────────────────────────────────────────────────────────────────────

class LoanSignRequestOTPView(APIView):
    """
    POST /api/loans/sign/request-otp/
    Body: { "token": "<jwt de firma del correo>" }

    Requiere sesión activa. Valida el token de firma, verifica identidad,
    genera un OTP de 6 dígitos y lo envía al correo del usuario.
    Rate-limited: máx 5 solicitudes por IP en 15 min.
    """

    def post(self, request):
        # Op.3 — rate limiting
        blocked = _check_rl(request, "otp_request", _OTP_RL_MAX, _OTP_RL_MSG)
        if blocked:
            return blocked

        raw_token = request.data.get("token")
        if not raw_token:
            return Response({"error": "El token es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        # Decodificar token de firma
        try:
            payload = jwt.decode(raw_token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            _record_rl(request, "otp_request", _OTP_RL_WINDOW)
            return Response(
                {"error": "El enlace de firma ha expirado. Solicita uno nuevo al administrador."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except jwt.InvalidTokenError:
            _record_rl(request, "otp_request", _OTP_RL_WINDOW)
            return Response({"error": "El enlace de firma no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        if payload.get("scope") != "loan_sign":
            return Response({"error": "El enlace no es válido para esta operación."}, status=status.HTTP_400_BAD_REQUEST)

        # Op.2 — verificar user_id embebido en el token
        token_user_id = payload.get("user_id")
        if token_user_id is None or request.user.id != token_user_id:
            return Response(
                {"error": "El enlace de firma corresponde a otro usuario."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Token ya usado (en blacklist)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        if BlacklistedToken.objects.filter(token_hash=token_hash).exists():
            return Response(
                {"error": "Este enlace ya fue utilizado. El préstamo ya fue firmado por esta parte."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        role    = payload.get("role")
        loan_id = payload.get("loan_id")

        if role not in ("responsable", "receptor"):
            return Response({"error": "El enlace no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            loan = Loans.objects.select_related('id_responsable_user', 'id_receptor_user', 'id_material').get(pk=loan_id)
        except Loans.DoesNotExist:
            return Response({"error": "El préstamo asociado no existe."}, status=status.HTTP_404_NOT_FOUND)

        if loan.state != 'Pendiente':
            return Response(
                {"error": f"Este préstamo ya no está pendiente de firma (estado: {loan.state})."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Op.3 — verificar identidad: sesión coincide con el rol esperado
        expected_user = loan.id_responsable_user if role == "responsable" else loan.id_receptor_user
        if request.user.id != expected_user.id:
            return Response(
                {"error": "No tienes permiso para firmar este préstamo."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Invalidar OTPs previos no usados para este préstamo/rol/usuario
        SignOTP.objects.filter(loan=loan, user=request.user, role=role, used=False).delete()

        # Generar código OTP de 6 dígitos
        code = "".join(random.choices(string.digits, k=6))
        code_hash  = hashlib.sha256(code.encode()).hexdigest()
        expires_at = timezone.now() + datetime.timedelta(minutes=SignOTP.OTP_TTL_MINUTES)

        SignOTP.objects.create(
            loan=loan,
            user=request.user,
            role=role,
            code_hash=code_hash,
            expires_at=expires_at,
        )

        # Enviar OTP por correo (Gmail en producción)
        try:
            _send_otp_email(request.user, code, loan)
        except Exception:
            return Response(
                {"error": "No se pudo enviar el código de verificación. Intenta nuevamente."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        _reset_rl(request, "otp_request")   # éxito → reset contador

        return Response(
            {
                "message": (
                    f"Código enviado al correo {request.user.email}. "
                    f"Válido por {SignOTP.OTP_TTL_MINUTES} minutos."
                ),
                "expires_in_minutes": SignOTP.OTP_TTL_MINUTES,
            },
            status=status.HTTP_200_OK,
        )


# ─────────────────────────────────────────────────────────────────────────────
# Endpoint: confirmar firma con OTP  (Op.1 + Op.2 + Op.3 + Op.4)
# ─────────────────────────────────────────────────────────────────────────────

class LoanSignView(APIView):
    """
    POST /api/loans/sign/
    Body: { "token": "<jwt de firma>", "otp_code": "123456" }

    Requiere sesión activa. Valida triple coincidencia:
      1. Sesión JWT de la plataforma (autenticación estándar)
      2. user_id embebido en el token de firma == request.user.id  (Op.2)
      3. OTP correcto, no usado y no expirado  (Op.1)
    Rate-limited (Op.3). Registra IP y User-Agent (Op.4).
    """

    def post(self, request):
        # Op.3 — rate limiting en intentos de firma
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

        # 1. Decodificar token de firma
        try:
            payload = jwt.decode(raw_token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            return Response(
                {"error": "El enlace de firma ha expirado. Solicita uno nuevo al administrador."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except jwt.InvalidTokenError:
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            return Response({"error": "El enlace de firma no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        if payload.get("scope") != "loan_sign":
            return Response({"error": "El enlace no es válido para esta operación."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Op.2 — user_id en token debe coincidir con la sesión
        token_user_id = payload.get("user_id")
        if token_user_id is None or request.user.id != token_user_id:
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            return Response(
                {"error": "El enlace de firma corresponde a otro usuario."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 3. Verificar uso único del token
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        if BlacklistedToken.objects.filter(token_hash=token_hash).exists():
            return Response(
                {"error": "Este enlace ya fue utilizado. El préstamo ya fue firmado por esta parte."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        role    = payload.get("role")
        loan_id = payload.get("loan_id")

        if role not in ("responsable", "receptor"):
            return Response({"error": "El enlace no es válido."}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Obtener el préstamo
        try:
            loan = Loans.objects.select_related(
                'id_responsable_user', 'id_receptor_user', 'id_material'
            ).get(pk=loan_id)
        except Loans.DoesNotExist:
            return Response({"error": "El préstamo asociado no existe."}, status=status.HTTP_404_NOT_FOUND)

        if loan.state != 'Pendiente':
            return Response(
                {"error": f"Este préstamo ya no está pendiente de firma (estado: {loan.state})."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 5. Op.3 — verificar identidad: sesión == rol esperado
        expected_user = loan.id_responsable_user if role == "responsable" else loan.id_receptor_user
        if request.user.id != expected_user.id:
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            return Response(
                {"error": "No tienes permiso para firmar este préstamo."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 6. Op.1 — validar OTP
        otp_record = (
            SignOTP.objects
            .filter(loan=loan, user=request.user, role=role, used=False)
            .order_by('-created_at')
            .first()
        )

        if otp_record is None or not otp_record.is_valid:
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            return Response(
                {"error": "El código de verificación no existe, expiró o fue invalidado. Solicita uno nuevo."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        submitted_hash = hashlib.sha256(otp_code.encode()).hexdigest()
        if submitted_hash != otp_record.code_hash:
            # Incrementar intentos fallidos en el OTP
            otp_record.attempts += 1
            otp_record.save(update_fields=["attempts"])
            _record_rl(request, "sign_attempt", _SIGN_RL_WINDOW)
            remaining = SignOTP.OTP_MAX_ATTEMPTS - otp_record.attempts
            if remaining > 0:
                return Response(
                    {"error": f"Código incorrecto. Te quedan {remaining} intento(s)."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {"error": "Código incorrecto. Has superado el límite de intentos. Solicita un nuevo código."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Todo correcto: registrar la firma ────────────────────────────
        now = timezone.now()
        # Op.4 — capturar IP y User-Agent
        client_ip = _get_client_ip(request)
        user_agent = request.META.get("HTTP_USER_AGENT", "")[:500]

        with transaction.atomic():
            if role == "responsable":
                if loan.signed_by_responsable_id is not None:
                    return Response(
                        {"error": "El responsable ya firmó este préstamo."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                loan.signed_by_responsable = request.user
                loan.signed_at_responsable = now
                # Op.4
                loan.signed_ip_responsable = client_ip
                loan.signed_ua_responsable = user_agent
            else:
                if loan.signed_by_receptor_id is not None:
                    return Response(
                        {"error": "El receptor ya firmó este préstamo."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                loan.signed_by_receptor = request.user
                loan.signed_at_receptor = now
                # Op.4
                loan.signed_ip_receptor = client_ip
                loan.signed_ua_receptor = user_agent

            if loan.both_signed:
                loan.state = 'Activo'

            loan.save()

            # Marcar OTP como usado
            otp_record.used = True
            otp_record.save(update_fields=["used"])

            # Invalidar el token de firma (uso único)
            exp_ts = payload.get("exp")
            expires_at = (
                datetime.datetime.fromtimestamp(exp_ts, tz=datetime.timezone.utc)
                if exp_ts
                else timezone.now() + datetime.timedelta(minutes=_SIGN_TOKEN_TTL_MINUTES)
            )
            BlacklistedToken.objects.get_or_create(
                token_hash=token_hash,
                defaults={"expires_at": expires_at},
            )

        _reset_rl(request, "sign_attempt")   # éxito → reset contador

        role_label = "Responsable" if role == "responsable" else "Receptor"
        activated  = loan.state == 'Activo'
        return Response(
            {
                "message": (
                    f"Firma registrada correctamente como {role_label}. "
                    + ("El préstamo está ahora Activo." if activated else "En espera de la otra parte.")
                ),
                "state":   loan.state,
                "loan_id": loan.id_loan,
            },
            status=status.HTTP_200_OK,
        )
