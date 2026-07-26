# Vistas del modulo loans.
# Aqui viven los endpoints CRUD.

import django_filters
from django.db import transaction
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
    serializer_class = LoanSerializer
    filter_backends  = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class  = LoanFilter
    # ?search= busca en grupo de aprendices y nombre del material
    search_fields    = ['apprentice_group', 'id_material__name', 'justification_use']
    ordering_fields  = ['loan_date', 'return_date', 'state', 'id_loan']

    def _user_is_admin(self):
        """
        Devuelve True si el usuario autenticado es superusuario o pertenece
        al grupo 'Admin' (comparacion sin distincion de mayusculas), lo que
        le da visibilidad sobre todos los prestamos.
        """
        user = self.request.user
        if user.is_superuser:
            return True
        from modules.permissions.models import UserGroup
        return UserGroup.objects.filter(
            user=user,
            group__name__iexact='admin',
        ).exists()

    def get_queryset(self):
        """
        ADMINs y superusuarios ven todos los prestamos.
        El resto ve unicamente aquellos en los que participan como
        responsable (id_responsable_user) o receptor (id_receptor_user).
        """
        from django.db.models import Q
        base_qs = Loans.objects.select_related(
            'id_responsable_user', 'id_receptor_user', 'id_material'
        ).order_by('id_loan')

        if self._user_is_admin():
            return base_qs

        user = self.request.user
        return base_qs.filter(
            Q(id_responsable_user=user) | Q(id_receptor_user=user)
        )

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [HasPermission("view_loan")]
        if self.action == "create":
            return [HasPermission("create_loan")]
        if self.action in ("update", "partial_update"):
            return [HasPermission("edit_loan")]
        return [IsSuperUser()]

    def create(self, request, *args, **kwargs):
        material_ids = request.data.get("id_material")
        if not isinstance(material_ids, list):
            return super().create(request, *args, **kwargs)

        if not material_ids:
            return Response(
                {"id_material": ["Debe seleccionar al menos un material."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        loan_amounts = request.data.get("amount_lent")
        if not isinstance(loan_amounts, dict) or any(
            str(material_id) not in loan_amounts for material_id in material_ids
        ):
            return Response(
                {"amount_lent": ["Debe indicar una cantidad para cada material."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializers = []
        with transaction.atomic():
            for material_id in material_ids:
                loan_data = request.data.copy()
                loan_data["id_material"] = material_id
                loan_data["amount_lent"] = loan_amounts.get(str(material_id))
                serializer = self.get_serializer(data=loan_data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                serializers.append(serializer)

        return Response(
            self.get_serializer([serializer.instance for serializer in serializers], many=True).data,
            status=status.HTTP_201_CREATED,
        )

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
