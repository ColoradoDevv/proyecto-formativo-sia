# 
# Serializers del modulo users.
# Sirven para convertir User a JSON y validar lo que llega.
# 

from rest_framework import serializers

from .models import User
from .models import Role
from .models import DocumentType

class RoleSerializer(serializers.ModelSerializer):
    # Serializer para el modelo Role.
    class Meta:
        model = Role
        fields = "__all__"

class DocumentTypeSerializer(serializers.ModelSerializer):
    # Serializer para el modelo DocumentType.
    class Meta:
        model = DocumentType
        fields = "__all__"
        extra_kwargs = {
            "description": {"required": False, "allow_null": True},
        }        

class UserSerializer(serializers.ModelSerializer):
    # Para leer - devuelve el objeto completo en GET
    role = RoleSerializer(read_only=True)
    document_type = DocumentTypeSerializer(read_only=True)

    # Para escribir - acepta solo el ID en POST
    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        source='role',
        write_only=True,
        required=False,
        allow_null=True
    )
    document_type_id = serializers.PrimaryKeyRelatedField(
        queryset=DocumentType.objects.all(),
        source='document_type',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "is_active": {"required": False, "default": True},
            "second_phone_number": {"required": False, "allow_null": True},
            "institutional_email": {"required": False, "allow_null": True},
            "profile_picture": {"required": False, "allow_null": True},
        }