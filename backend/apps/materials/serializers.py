from rest_framework import serializers
from .models import Material

class MaterialSerializer(serializers.Serializer):
    id         = serializers.CharField(read_only=True)
    username   = serializers.CharField(max_length=150)
    email      = serializers.EmailField()
    first_name = serializers.CharField(max_length=100, required=False, default='')
    last_name  = serializers.CharField(max_length=100, required=False, default='')
    password   = serializers.CharField(write_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Material(**validated_data).save()

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance