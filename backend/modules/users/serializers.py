# 
# Serializers del modulo users.
# Sirven para convertir User a JSON y validar lo que llega.
# 

from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    # Define como se expone el usuario en la API.
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "role": {"required": False, "allow_null": True},
            "second_phonenumber": {"required": False, "allow_null": True},
            "institutional_email": {"required": False, "allow_null": True},
            "profile_picture": {"required": False, "allow_null": True},
        }
