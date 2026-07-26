# Vistas del modulo loans.
# Aqui viven los endpoints CRUD y el flujo de firma electronica.

import datetime
import hashlib

import django_filters
import jwt
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Loans
from .serializers import LoanSerializer
from modules.permissions.permissions_drf import HasPermission, IsSuperUser
from modules.users.models import BlacklistedToken

# ─────────────────────────────────────────────────────────────────────────────
# Constantes de firma
# ─────────────────────────────────────────────────────────────────────────────
_SIGN_TOKEN_TTL_MINUTES = 60 * 24  # 24 horas para firmar


def _build_sign_token(loan_id: int, role: str) -> str:
    """
    Genera un JWT de corta duración para que una parte firme el préstamo.
    role: 'responsable' | 'receptor'
    """
    payload = {
        "loan_id": loan_id,
        "role":    role,
        "scope":   "loan_sign",
        "exp":     datetime.datetime.utcnow() + datetime.timedelta(minutes=_SIGN_TOKEN_TTL_MINUTES),
        "iat":     datetime.datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def _send_sign_email(user, loan, role: str, token: str) -> None:
    """Envía el correo con el enlace de firma al usuario indicado."""
    sign_link = f"{settings.FRONTEND_URL}/prestamos/firmar?token={token}"
    role_label = "responsable del préstamo" if role == "responsable" else "receptor del material"
    send_mail(
        subject="Firma requerida — Préstamo de material SGI",
        message=(
            f"Hola {user.first_name},\n\n"
            f"Se ha registrado un préstamo de material en el que figuras como {role_label}.\n"
            f"Para confirmar la entrega del material, por favor firma haciendo clic en el "
            f"siguiente enlace (válido por 24 horas):\n\n"
            f"{sign_link}\n\n"
            f"Detalles del préstamo:\n"
            f"  • Material:  {loan.id_material.name}\n"
            f"  • Cantidad:  {loan.amount_lent}\n"
            f"  • Grupo:     {loan.apprentice_group}\n"
            f"  • Fecha:     {loan.loan_date}\n\n"
            "Si no reconoces este préstamo, ignora este correo y avisa al administrador."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


# ─────────────────────────────────────────────────────────────────────────────
# FilterSet
# ─────────────────────────────────────────────────────────────────────────────

class LoanFilter(django_filters.FilterSet):
    """
    FilterSet para préstamos con soporte de rango de fechas.
    ?loan_date_after=2026-01-01&loan_date_before=2026-06-30
    """
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
    # CRUD de préstamos.
    serializer_class = LoanSerializer
    filter_backends  = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class  = LoanFilter
    search_fields    = ['apprentice_group', 'id_material__name', 'justification_use']
    ordering_fields  = ['loan_date', 'return_date', 'state', 'id_loan']

    # ── helpers ──────────────────────────────────────────────────────────

    def _user_is_admin(self):
        user = self.request.user
        if user.is_superuser:
            return True
        from modules.permissions.models import UserGroup
        return UserGroup.objects.filter(
            user=user,
            group__name__iexact='admin',
        ).exists()

    def get_queryset(self):
        from django.db.models import Q
        base_qs = Loans.objects.select_related(
            'id_responsable_user', 'id_receptor_user', 'id_material',
            'signed_by_responsable', 'signed_by_receptor',
        ).order_by('id_loan')

        if self._user_is_admin():
            return base_qs

        user = self.request.user
        return base_qs.filter(
            Q(id_responsable_user=user) | Q(id_receptor_user=user)
        )

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [HasPermission("view_loan")]
        if self.action == "create":
            return [HasPermission("create_loan")]
        if self.action in ("update", "partial_update"):
            return [HasPermission("edit_loan")]
        return [IsSuperUser()]

    # ── create: estado Pendiente + envío de correos ───────────────────────

    def _create_single(self, loan_data):
        """Crea un préstamo individual y devuelve la instancia."""
        serializer = self.get_serializer(data=loan_data)
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    def _dispatch_sign_emails(self, loan):
        """Genera tokens y envía los correos de firma para un préstamo."""
        token_responsable = _build_sign_token(loan.id_loan, "responsable")
        token_receptor    = _build_sign_token(loan.id_loan, "receptor")
        try:
            _send_sign_email(loan.id_responsable_user, loan, "responsable", token_responsable)
        except Exception:
            pass  # fallo de correo no debe abortar la creación
        try:
            _send_sign_email(loan.id_receptor_user, loan, "receptor", token_receptor)
        except Exception:
            pass

    def create(self, request, *args, **kwargs):
        material_ids = request.data.get("id_material")

        # ── creación simple (un solo material) ────────────────────────────
        if not isinstance(material_ids, list):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            with transaction.atomic():
                loan = serializer.save()
            self._dispatch_sign_emails(loan)
            return Response(
                self.get_serializer(loan).data,
                status=status.HTTP_201_CREATED,
            )

        # ── creación múltiple (varios materiales) ─────────────────────────
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
                loan_data = request.data.copy()
                loan_data["id_material"]  = material_id
                loan_data["amount_lent"]  = loan_amounts.get(str(material_id))
                loans.append(self._create_single(loan_data))

        for loan in loans:
            self._dispatch_sign_emails(loan)

        return Response(
            self.get_serializer(loans, many=True).data,
            status=status.HTTP_201_CREATED,
        )

    # ── update/partial_update: solo préstamos Activos ────────────────────

    def _check_loan_is_active(self, instance):
        if instance.state not in ('Activo',):
            return Response(
                {
                    'error': (
                        f"Solo se pueden modificar préstamos en estado 'Activo'. "
                        f"Este préstamo está en estado '{instance.state}'."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return None

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        error = self._check_loan_is_active(instance)
        if error:
            return error
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        error = self._check_loan_is_active(instance)
        if error:
            return error
        return super().partial_update(request, *args, **kwargs)


# ─────────────────────────────────────────────────────────────────────────────
# Endpoint público de firma
# ─────────────────────────────────────────────────────────────────────────────

class LoanSignView(APIView):
    """
    POST /api/loans/sign/
    Body: { "token": "<jwt>" }

    Verifica el token de firma, registra quién firmó y cuándo,
    y activa el préstamo automáticamente cuando ambas partes han firmado.

    Es PÚBLICO: el enlace llega por correo y el usuario puede no tener
    sesión activa en el navegador.
    """
    authentication_classes = []
    permission_classes     = []

    def post(self, request):
        raw_token = request.data.get("token")
        if not raw_token:
            return Response(
                {"error": "El token es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 1. Decodificar y validar el token
        try:
            payload = jwt.decode(raw_token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "El enlace de firma ha expirado. Solicita uno nuevo al administrador."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except jwt.InvalidTokenError:
            return Response(
                {"error": "El enlace de firma no es válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if payload.get("scope") != "loan_sign":
            return Response(
                {"error": "El enlace no es válido para esta operación."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2. Verificar uso único (reutilizamos la blacklist de tokens)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        if BlacklistedToken.objects.filter(token_hash=token_hash).exists():
            return Response(
                {"error": "Este enlace ya fue utilizado. El préstamo ya fue firmado por esta parte."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        loan_id = payload.get("loan_id")
        role    = payload.get("role")  # 'responsable' | 'receptor'

        if role not in ("responsable", "receptor"):
            return Response(
                {"error": "El enlace no es válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 3. Obtener el préstamo
        try:
            loan = Loans.objects.select_related(
                'id_responsable_user', 'id_receptor_user', 'id_material'
            ).get(pk=loan_id)
        except Loans.DoesNotExist:
            return Response(
                {"error": "El préstamo asociado no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # 4. Solo se puede firmar un préstamo que sigue Pendiente
        if loan.state != 'Pendiente':
            return Response(
                {"error": f"Este préstamo ya no está pendiente de firma (estado: {loan.state})."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        now = timezone.now()

        # 5. Registrar la firma según el rol
        with transaction.atomic():
            if role == "responsable":
                if loan.signed_by_responsable_id is not None:
                    return Response(
                        {"error": "El responsable ya firmó este préstamo."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                # El token lleva el id del usuario asignado al rol; lo usamos
                # directamente para garantizar que sea la persona correcta.
                loan.signed_by_responsable    = loan.id_responsable_user
                loan.signed_at_responsable    = now
            else:  # receptor
                if loan.signed_by_receptor_id is not None:
                    return Response(
                        {"error": "El receptor ya firmó este préstamo."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                loan.signed_by_receptor  = loan.id_receptor_user
                loan.signed_at_receptor  = now

            # 6. Si ambas partes ya firmaron → activar el préstamo
            if loan.both_signed:
                loan.state = 'Activo'

            loan.save()

            # 7. Invalidar el token para que no pueda reutilizarse
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
