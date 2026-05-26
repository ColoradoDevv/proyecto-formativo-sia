# Vistas del CRUD de usuarios.

from rest_framework import generics

from .models import User
from .models import Role
from .models import DocumentType
from .serializers import UserSerializer
from .serializers import RoleSerializer
from .serializers import DocumentTypeSerializer


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
    