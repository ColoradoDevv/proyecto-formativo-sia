# Serializers del modulo tasks.
# Convierte modelos a JSON y valida lo que llega.

from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    # Serializer para tareas.

    # Nombre del usuario asignado (solo lectura, para mostrar en tablas/detalle).
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id',
            'user',
            'user_name',
            'name',
            'description',
            'start_date',
            'end_date',
            'state',
        ]

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def validate(self, data):
        # La fecha de fin no puede ser anterior a la de inicio.
        start = data.get('start_date', getattr(self.instance, 'start_date', None))
        end = data.get('end_date', getattr(self.instance, 'end_date', None))
        if start and end and end < start:
            raise serializers.ValidationError(
                {"end_date": "La fecha de fin no puede ser anterior a la de inicio."}
            )
        return data

    def update(self, instance, validated_data):
        # Una tarea no puede reasignarse a otro usuario una vez creada.
        validated_data.pop('user', None)
        return super().update(instance, validated_data)
