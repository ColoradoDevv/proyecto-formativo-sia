# Vistas del CRUD de usuarios.

from rest_framework import generics

from .models import User
from .serializers import UserSerializer


class UserListCreateView(generics.ListCreateAPIView):
    # Lista y crea usuarios.
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    # Detalle: obtiene, actualiza y elimina un usuario.
    queryset = User.objects.all()
    serializer_class = UserSerializer
