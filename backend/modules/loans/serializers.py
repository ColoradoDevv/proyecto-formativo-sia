# Serializers del modulo loans.
# Convierte modelos a JSON y valida lo que llega.

from rest_framework import serializers
from .models import Loans
from django.db.models import Sum



class LoanSerializer(serializers.ModelSerializer):
    # Serializer para préstamos.

    usuario_responsable = serializers.SerializerMethodField()
    usuario_receptor = serializers.SerializerMethodField()
    material = serializers.SerializerMethodField()
    material_type = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Loans
        fields = [
            'id_loan',
            'id_responsable_user',
            'id_receptor_user',
            'id_material',
            'amount_lent',
            'apprentice_group',
            'justification_use',
            'return_date',
            'loan_date',
            'state',
            'usuario_responsable',
            'usuario_receptor',
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

    def get_usuario_responsable(self, obj):
        return f"{obj.id_responsable_user.first_name} {obj.id_responsable_user.last_name}"

    def get_usuario_receptor(self, obj):
        return f"{obj.id_receptor_user.first_name} {obj.id_receptor_user.last_name}"

    def get_material(self, obj):
        return obj.id_material.name

    def get_material_type(self, obj):
        # "devolutivo" si el material tiene su registro ReturnableMaterial; si no, "consumo".
        return "devolutivo" if hasattr(obj.id_material, "returnablematerial") else "consumo"

    def get_is_active(self, obj):
        # Un prestamo esta activo solo mientras siga en estado "Activo"
        # (Finalizado o Incompleto significan que ya fue devuelto).
        return obj.state == 'Activo'
    
    def validate(self, attrs):
        material = attrs.get('id_material') or getattr(self.instance, 'id_material', None)
        amount_lent = attrs.get('amount_lent', getattr(self.instance, 'amount_lent', None))

        if material is not None and amount_lent is not None:
            if material.quantity is not None:
                active_loans = Loans.objects.filter(
                    id_material=material,
                    state='Activo',
                )

                # Al editar, no contar el propio préstamo contra sí mismo
                if self.instance is not None:
                    active_loans = active_loans.exclude(pk=self.instance.pk)

                already_lent = active_loans.aggregate(total=Sum('amount_lent'))['total'] or 0
                available = material.quantity - already_lent

                if amount_lent > available:
                    raise serializers.ValidationError({
                        'amount_lent': (
                            f'Solo quedan {available} unidades disponibles de "{material.name}" '
                            f'(stock total: {material.quantity}, ya prestadas: {already_lent}).'
                        )
                    })

        return attrs