# Vistas del CRUD de usuarios.
import jwt
import datetime
from django.conf import settings
from django.contrib.auth.hashers import check_password
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
    