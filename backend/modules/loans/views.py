# Vistas del modulo loans.
# Aqui viven los endpoints CRUD.

from rest_framework import viewsets
from .models import Loans
from .serializers import LoanSerializer


class LoanViewSet(viewsets.ModelViewSet):
    # CRUD de préstamos.
    queryset = Loans.objects.select_related('id_user', 'id_material').all().order_by('id_loan')
    serializer_class = LoanSerializer