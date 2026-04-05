# Serializers del modulo returns.
# Convierte modelos a JSON y valida lo que llega.

from rest_framework import serializers
from .models import LoanReturn


class LoanReturnSerializer(serializers.ModelSerializer):
    # Serializer para retornos de prestamos.

    class Meta:
        model = LoanReturn
        fields = '__all__'
        extra_kwargs = {
            # Cantidad sobrante es opcional - solo aplica para materiales de consumo
            'leftover_quantity': {'required': False, 'allow_null': True},
        }