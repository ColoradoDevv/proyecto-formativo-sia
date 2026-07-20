# Serializers del modulo loans.
# Convierte modelos a JSON y valida lo que llega.

from rest_framework import serializers
from .models import Loans


class LoanSerializer(serializers.ModelSerializer):
    # Serializer para préstamos.

    usuario = serializers.SerializerMethodField()
    material = serializers.SerializerMethodField()
    material_type = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Loans
        fields = [
            'id_loan',
            'id_user',
            'id_material',
            'amount_lent',
            'apprentice_group',
            'justification_use',
            'return_date',
            'loan_date',
            'state',
            'usuario',
            'material',
            'material_type',
            'is_active',
        ]
        extra_kwargs = {
            # return_date no tiene auto_now_add, el frontend debe enviarlo
            'return_date': {'required': True},
            # state no se envia al crear; se gestiona por el flujo de devolucion
            'state': {'read_only': True},
        }

    def get_usuario(self, obj):
        return f"{obj.id_user.first_name} {obj.id_user.last_name}"

    def get_material(self, obj):
        return obj.id_material.name

    def get_material_type(self, obj):
        # "devolutivo" si el material tiene su registro ReturnableMaterial; si no, "consumo".
        return "devolutivo" if hasattr(obj.id_material, "returnablematerial") else "consumo"

    def get_is_active(self, obj):
        # Un prestamo esta activo solo mientras siga en estado "Activo"
        # (Finalizado o Incompleto significan que ya fue devuelto).
        return obj.state == 'Activo'
