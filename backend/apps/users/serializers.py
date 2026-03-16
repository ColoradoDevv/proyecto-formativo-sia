from rest_framework_mongoengine import serializers
from .models import User

class UserSerializer(serializers.DocumentSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}