# Serializers del modulo loans.
# Convierte modelos a JSON y valida lo que llega.

from rest_framework import serializers
from .models import Loans


class LoanSerializer(serializers.ModelSerializer):
    # Serializer para préstamos.

    class Meta:
        model = Loans
        fields = '__all__'
        extra_kwargs = {
            # return_date no tiene auto_now_add, el frontend debe enviarlo
            'return_date': {'required': True},
        }