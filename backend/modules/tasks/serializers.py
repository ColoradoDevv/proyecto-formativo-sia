# Serializers del modulo tasks.
# Convierte modelos a JSON y valida lo que llega.

from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    # Serializer para tareas.

    class Meta:
        model = Task
        fields = '__all__'