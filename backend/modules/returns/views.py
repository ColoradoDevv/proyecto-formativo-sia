# Vistas del modulo returns.
# Aqui viven los endpoints CRUD.

from rest_framework import viewsets
from .models import LoanReturn
from .serializers import LoanReturnSerializer


class LoanReturnViewSet(viewsets.ModelViewSet):
    # CRUD de retornos de prestamos.
    queryset = LoanReturn.objects.all().order_by('id')
    serializer_class = LoanReturnSerializer