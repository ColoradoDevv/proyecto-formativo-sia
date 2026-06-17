# 
# Serializers del modulo users.
# Sirven para convertir User a JSON y validar lo que llega.
# 

from rest_framework import serializers

from .models import User
from .models import Role
from .models import DocumentType
from modules.permissions.models import Group

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

class UserGroupSerializer(serializers.Serializer):
    """Serializer para mostrar los grupos de un usuario"""
    id = serializers.IntegerField(source='group.id')
    name = serializers.CharField(source='group.name')


class UserSerializer(serializers.ModelSerializer):
    # Para leer - devuelve el objeto completo en GET
    role = RoleSerializer(read_only=True)
    document_type = DocumentTypeSerializer(read_only=True)
    groups = UserGroupSerializer(source='user_groups', many=True, read_only=True)

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

    # La contraseña SOLO entra (write_only): se puede enviar, pero nunca se devuelve
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        # Ocultamos los campos internos de Django que no deben salir
        exclude = ["is_superuser", "groups", "user_permissions", "last_login"]
        extra_kwargs = {
            "is_active": {"required": False, "default": True},
            "second_phone_number": {"required": False, "allow_null": True},
            "institutional_email": {"required": False, "allow_null": True},
            "profile_picture": {"required": False, "allow_null": True},
        }

    def create(self, validated_data):
        # Al crear: sacamos la contraseña y la guardamos HASHEADA
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)   # hashea
        user.save()
        return user

    def update(self, instance, validated_data):
        # Al actualizar: si viene contraseña, también se hashea
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance