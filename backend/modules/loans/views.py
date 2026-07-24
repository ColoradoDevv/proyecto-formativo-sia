# Vistas del modulo loans.
# Aqui viven los endpoints CRUD.

import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from .models import Loans
from .serializers import LoanSerializer
from modules.permissions.permissions_drf import HasPermission, IsSuperUser


class LoanFilter(django_filters.FilterSet):
    """
    FilterSet para préstamos con soporte de rango de fechas.
    ?loan_date_after=2026-01-01&loan_date_before=2026-06-30
    """
    loan_date_after  = django_filters.DateFilter(field_name='loan_date', lookup_expr='gte')
    loan_date_before = django_filters.DateFilter(field_name='loan_date', lookup_expr='lte')

    class Meta:
        model  = Loans
        fields = {
            'state':               ['exact'],
            'apprentice_group':    ['exact', 'icontains'],
            'id_responsable_user': ['exact'],
            'id_receptor_user':    ['exact'],
        }


class LoanViewSet(viewsets.ModelViewSet):
    # CRUD de préstamos.
    queryset = Loans.objects.select_related('id_responsable_user','id_receptor_user', 'id_material').all().order_by('id_loan')
    serializer_class = LoanSerializer
    filter_backends  = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class  = LoanFilter
    # ?search= busca en grupo de aprendices y nombre del material
    search_fields    = ['apprentice_group', 'id_material__name', 'justification_use']
    ordering_fields  = ['loan_date', 'return_date', 'state', 'id_loan']

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [HasPermission("view_loan")]
        if self.action == "create":
            return [HasPermission("create_loan")]
        if self.action in ("update", "partial_update"):
            return [HasPermission("edit_loan")]
        return [IsSuperUser()]

    def _check_loan_is_active(self, instance):
        """
        Devuelve un Response de error 400 si el préstamo no está en estado
        'Activo', o None si la actualización puede continuar.
        Solo los préstamos activos pueden modificarse; los finalizados o
        incompletos ya cerraron su ciclo de vida.
        """
        if instance.state != 'Activo':
            return Response(
                {
                    'error': (
                        f"Solo se pueden modificar préstamos en estado 'Activo'. "
                        f"Este préstamo está en estado '{instance.state}'."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return None

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        error = self._check_loan_is_active(instance)
        if error:
            return error
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        error = self._check_loan_is_active(instance)
        if error:
            return error
        return super().partial_update(request, *args, **kwargs)