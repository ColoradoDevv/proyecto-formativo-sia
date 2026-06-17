#
# Autenticacion por JWT para el modulo users.
# Se ejecuta en cada peticion: lee el token y carga el usuario.
#

import jwt 
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import User

class JWTAuthentication(BaseAuthentication):
    # DRF llama a este metodo automaticamente en cada peticion.
    def authenticate(self, request):
        # 1. Buscar el header "Authorization: Bearer <token>"
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None   # sin token -> peticion anonima (no error)

        # 2. Separar el token del prefijo "Bearer "
        token = auth_header.split(" ")[1]

        # 3. Verificar y decodificar el token
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("El token ha expirado")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Token invalido")

        # 4. Buscar al usuario que dice el token
        try:
            user = User.objects.select_related("role").get(id=payload["user_id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("Usuario no encontrado")

        # 5. Devolver el usuario -> DRF lo pone en request.user
        return (user, None)