from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "role": {"required": False, "allow_null": True},
            "second_phonenumber": {"required": False, "allow_null": True},
            "institutional_email": {"required": False, "allow_null": True},
            "profile_picture": {"required": False, "allow_null": True},
        }
