# Vistas del CRUD de usuarios.
import jwt
import datetime
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics

from .models import User
from .models import Role
from .models import DocumentType
from .serializers import UserSerializer
from .serializers import RoleSerializer
from .serializers import DocumentTypeSerializer

class LoginView(APIView):
    # El login debe ser PUBLICO: nadie tiene token todavia al iniciar sesion.
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        # 1. Validar que llegaron los dos datos
        if not email or not password:
            return Response(
                {"error": "Email y contraseña son obligatorios"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2. Buscar el usuario por email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "Credenciales inválidas"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # 3. Verificar la contraseña contra el hash guardado
        if not check_password(password, user.password):
            return Response(
                {"error": "Credenciales inválidas"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # 4. Verificar que la cuenta este activa
        if not user.is_active:
            return Response(
                {"error": "La cuenta está desactivada"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 5. Construir el contenido del token (payload)
        payload = {
            "user_id": user.id,
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=8),
            "iat": datetime.datetime.utcnow(),
        }

        # 6. Firmar el token con la clave secreta
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        # 7. Devolver el token y algunos datos utiles para el frontend
        # Obtener el primer grupo del usuario (si tiene)
        user_groups = user.user_groups.all()
        primary_group = user_groups.first().group.name if user_groups.exists() else None

        # Si es superusuario, asignarlo al grupo SADMIN
        if user.is_superuser and not primary_group:
            primary_group = "SADMIN"

        return Response({
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": primary_group,  # Devuelve el nombre del grupo principal
                "groups": [g.group.name for g in user_groups],  # Lista todos los grupos
            },
        })

class ForgetPasswordView(APIView):
    # Solicitar recuperacion de contrasena: tambien debe ser PUBLICO.
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")

        # 1. Validar que llego el email
        if not email:
            return Response(
                {"error": "El email es obligatorio"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2. Respuesta generica: NO revelamos si el email existe o no.
        # Asi evitamos que alguien use este endpoint para descubrir cuentas.
        generic_response = Response(
            {"message": "Si el correo está registrado, enviaremos un enlace para restablecer la contraseña."},
            status=status.HTTP_200_OK,
        )

        # 3. Buscar el usuario. Si no existe (o esta inactivo), respondemos igual.
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return generic_response

        if not user.is_active:
            return generic_response

        # 4. Construir un token de reset de vida corta.
        # El "scope" lo distingue del token de login para que no se pueda
        # reutilizar uno por el otro.
        payload = {
            "user_id": user.id,
            "scope": "password_reset",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            "iat": datetime.datetime.utcnow(),
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

        # 5. Armar el enlace que apunta al frontend.
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

        # 6. Enviar el correo. fail_silently=False para que un fallo real
        # se vea en los logs durante el desarrollo.
        send_mail(
            subject="Restablece tu contraseña - SIA",
            message=(
                f"Hola {user.first_name},\n\n"
                "Recibimos una solicitud para restablecer tu contraseña.\n"
                f"Haz clic en el siguiente enlace para crear una nueva (válido por 1 hora):\n\n"
                f"{reset_link}\n\n"
                "Si no solicitaste este cambio, puedes ignorar este correo."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return generic_response


class UserListCreateView(generics.ListCreateAPIView):
    # Lista y crea usuarios.
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    # Detalle: obtiene, actualiza y elimina un usuario.
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserRolesListView(generics.ListAPIView):
    # Lista de roles para dropdowns, etc.
    queryset = Role.objects.all().order_by("name")
    serializer_class = RoleSerializer  
    
class UserDocumentTypesListView(generics.ListAPIView):
    # Lista de tipos de documento para dropdowns, etc.
    queryset = DocumentType.objects.all().order_by("name")
    serializer_class = DocumentTypeSerializer  
    