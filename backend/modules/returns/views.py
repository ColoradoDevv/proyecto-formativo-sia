# Vistas del modulo returns.
# Registra la devolucion de un prestamo y aplica las reglas de negocio:
# finaliza el prestamo, actualiza el estado/stock del material y deja
# trazabilidad en la tabla de retornos.

from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import LoanReturn
from .serializers import LoanReturnSerializer
from modules.permissions.permissions_drf import HasPermission, IsSuperUser


class LoanReturnViewSet(viewsets.ModelViewSet):
    # CRUD de retornos de prestamos.
    queryset = LoanReturn.objects.select_related('loan', 'material').all().order_by('id')
    serializer_class = LoanReturnSerializer

    def get_permissions(self):
        if self.action == "create":
            return [HasPermission("create_return")]
        # list/retrieve/update/destroy — solo superusuarios por defecto
        return [IsSuperUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        loan = serializer.validated_data['loan']
        material = loan.id_material  # el material se deriva del prestamo
        leftover = serializer.validated_data.get('leftover_quantity')
        returned = serializer.validated_data.get('returned_quantity')

        # Es devolutivo si el material tiene su registro ReturnableMaterial.
        is_returnable = hasattr(material, 'returnablematerial')

        with transaction.atomic():
            # 1. Registrar la devolucion (trazabilidad).
            loan_return = LoanReturn.objects.create(
                loan=loan,
                material=material,
                leftover_quantity=leftover,
                returned_quantity=returned,
                observations=serializer.validated_data.get('observations', ''),
            )

            # 2. Actualizar el material y decidir el estado final del prestamo.
            if is_returnable:
                # Devolutivo: vuelve al inventario. Si se devolvio menos de lo
                # prestado, la devolucion queda "Incompleta".
                material.state = 'Disponible'
                if returned is not None and returned < loan.amount_lent:
                    new_state = 'Incompleto'
                else:
                    new_state = 'Finalizado'
            else:
                # Consumo: si se reporto sobrante, se reintegra al stock.
                if leftover:
                    material.quantity = (material.quantity or 0) + leftover
                material.state = 'Disponible'
                new_state = 'Finalizado'
            material.save()

            # 3. Cerrar el prestamo con el estado calculado.
            loan.state = new_state
            loan.save(update_fields=['state'])

        out = self.get_serializer(loan_return)
        return Response(out.data, status=status.HTTP_201_CREATED)
