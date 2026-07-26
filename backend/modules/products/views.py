# Vistas del modulo productos.
# Aqui viven los endpoints CRUD.

from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.functions import Lower

from .models import Brand, Category, ConsumableMaterial, ReturnableMaterial
from .serializers import (
    BrandSerializer,
    CategorySerializer,
    ConsumableMaterialSerializer,
    ReturnableMaterialSerializer,
)
from modules.permissions.permissions_drf import HasPermission


class BrandViewSet(viewsets.ModelViewSet):
    # CRUD de marcas.
    queryset = Brand.objects.all().order_by(Lower("name"))
    serializer_class = BrandSerializer
    filter_backends  = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_active']
    search_fields    = ['name']
    ordering_fields  = ['name', 'id']

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [HasPermission("view_brand")]
        if self.action == "create":
            return [HasPermission("create_brand")]
        if self.action in ("update", "partial_update"):
            return [HasPermission("edit_brand")]
        # destroy y cualquier acción desconocida — solo superusuarios
        from modules.permissions.permissions_drf import IsSuperUser
        return [IsSuperUser()]


class CategoryViewSet(viewsets.ModelViewSet):
    # CRUD de categorias.
    queryset = Category.objects.all().order_by("id")
    serializer_class = CategorySerializer


class ConsumableMaterialViewSet(viewsets.ModelViewSet):
    # CRUD de materiales consumibles.
    queryset = ConsumableMaterial.objects.all().order_by(Lower("name"))
    serializer_class = ConsumableMaterialSerializer
    filter_backends  = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'name':      ['icontains', 'exact'],
        'state':     ['exact'],
        'is_active': ['exact'],
        'brand':     ['exact'],       # ?brand=<id>
        'user':      ['exact'],       # ?user=<id>  (cuentadante)
    }
    search_fields   = ['name', 'description', 'sena_plate', 'location']
    ordering_fields = ['name', 'state', 'is_active', 'purchase_date', 'id']

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [HasPermission("view_consumable")]
        if self.action == "create":
            return [HasPermission("create_consumable")]
        if self.action in ("update", "partial_update", "toggle_active"):
            return [HasPermission("edit_consumable")]
        from modules.permissions.permissions_drf import IsSuperUser
        return [IsSuperUser()]

    @action(detail=True, methods=["patch"])
    def toggle_active(self, request, pk=None):
        """
        Activa o desactiva un material consumible.
        PATCH /consumables/{id}/toggle_active/
        Body: {"is_active": true | false}
        """
        material = self.get_object()

        is_active = request.data.get("is_active")
        if is_active is None:
            return Response(
                {"error": "El campo 'is_active' es requerido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        material.is_active = bool(is_active)
        material.save(update_fields=["is_active"])

        return Response(
            {
                "message": f"Material '{material.name}' {'activado' if material.is_active else 'desactivado'} correctamente.",
                "is_active": material.is_active,
            },
            status=status.HTTP_200_OK,
        )


class ReturnableMaterialViewSet(viewsets.ModelViewSet):
    queryset = ReturnableMaterial.objects.select_related(
        'consumable', 'consumable__brand', 'consumable__user', 'category'
    ).all().order_by(Lower("consumable__name"))
    serializer_class = ReturnableMaterialSerializer
    filter_backends  = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = {
        'consumable__name':      ['icontains', 'exact'],
        'consumable__state':     ['exact'],
        'consumable__is_active': ['exact'],
        'consumable__user':      ['exact'],   # ?consumable__user=<id>  (cuentadante)
        'category':              ['exact'],   # ?category=<id>
        'serial':                ['icontains', 'exact'],
    }
    search_fields   = ['consumable__name', 'consumable__description',
                       'consumable__sena_plate', 'serial', 'model']
    ordering_fields = ['consumable__name', 'consumable__state', 'consumable_id']

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [HasPermission("view_returnable")]
        if self.action == "create":
            return [HasPermission("create_returnable")]
        if self.action in ("update", "partial_update", "toggle_active"):
            return [HasPermission("edit_returnable")]
        from modules.permissions.permissions_drf import IsSuperUser
        return [IsSuperUser()]

    @action(detail=True, methods=["patch"])
    def toggle_active(self, request, pk=None):
        """
        Activa o desactiva el ConsumableMaterial subyacente de un devolutivo.
        PATCH /returnables/{id}/toggle_active/
        Body: {"is_active": true | false}

        Los devolutivos no tienen is_active propio: el estado vive en el
        ConsumableMaterial al que están vinculados mediante la relación
        OneToOne consumable → ConsumableMaterial.
        """
        rm = self.get_object()
        consumable = rm.consumable

        is_active = request.data.get("is_active")
        if is_active is None:
            return Response(
                {"error": "El campo 'is_active' es requerido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        consumable.is_active = bool(is_active)
        consumable.save(update_fields=["is_active"])

        return Response(
            {
                "message": f"Material '{consumable.name}' {'activado' if consumable.is_active else 'desactivado'} correctamente.",
                "is_active": consumable.is_active,
            },
            status=status.HTTP_200_OK,
        )

    def create(self, request, *args, **kwargs):
        data = request.data
        files = request.FILES

        with transaction.atomic():
            consumable = ConsumableMaterial.objects.create(
                name=data.get('name', ''),
                sena_plate=data.get('sena_plate') or None,
                state=data.get('state', 'Disponible'),
                brand_id=data.get('brand_id') or None,
                quantity=data.get('quantity') or None,
                unit_price=data.get('unit_price', 0),
                total_price=data.get('total_price', 0),
                description=data.get('description', data.get('name', '')),
                purchase_date=data.get('purchase_date') or None,
                location=data.get('location') or None,
                is_active=True,
                user=request.user,
                image=files.get('image', ''),
            )

            rm = ReturnableMaterial.objects.create(
                consumable=consumable,
                category_id=data.get('category_id'),
                model=data.get('model', data.get('name', '')),
                serial=data.get('serial', ''),
                dimensions=data.get('dimensions') or None,
                technical_sheet=files.get('technical_sheet', ''),
            )

        serializer = self.get_serializer(rm)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        # Actualiza ambas tablas (ConsumableMaterial + ReturnableMaterial).
        # Solo toca los campos presentes en el request para soportar PATCH parcial.
        partial = kwargs.pop('partial', False)
        rm = self.get_object()
        consumable = rm.consumable
        data = request.data
        files = request.FILES

        # Mapa campo-del-request -> atributo del ConsumableMaterial.
        # Los valores se asignan tal cual; los vacios se normalizan a None.
        consumable_fields = {
            'name': 'name',
            'sena_plate': 'sena_plate',
            'state': 'state',
            'brand_id': 'brand_id',
            'quantity': 'quantity',
            'unit_price': 'unit_price',
            'total_price': 'total_price',
            'description': 'description',
            'purchase_date': 'purchase_date',
            'location': 'location',
        }
        nullable = {'sena_plate', 'brand_id', 'quantity', 'purchase_date', 'location'}

        with transaction.atomic():
            for key, attr in consumable_fields.items():
                if key in data:
                    value = data.get(key)
                    if key in nullable:
                        value = value or None
                    setattr(consumable, attr, value)

            if 'image' in files:
                consumable.image = files.get('image')

            consumable.save()

            if 'category_id' in data:
                rm.category_id = data.get('category_id')
            if 'model' in data:
                rm.model = data.get('model')
            if 'serial' in data:
                rm.serial = data.get('serial')
            if 'dimensions' in data:
                rm.dimensions = data.get('dimensions') or None
            if 'technical_sheet' in files:
                rm.technical_sheet = files.get('technical_sheet')

            rm.save()

        serializer = self.get_serializer(rm)
        return Response(serializer.data, status=status.HTTP_200_OK)
