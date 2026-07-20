# Vistas del modulo productos.
# Aqui viven los endpoints CRUD.

from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.response import Response

from .models import Brand, Category, ConsumableMaterial, ReturnableMaterial
from .serializers import (
    BrandSerializer,
    CategorySerializer,
    ConsumableMaterialSerializer,
    ReturnableMaterialSerializer,
)


class BrandViewSet(viewsets.ModelViewSet):
    # CRUD de marcas.
    queryset = Brand.objects.all().order_by("id")
    serializer_class = BrandSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    # CRUD de categorias.
    queryset = Category.objects.all().order_by("id")
    serializer_class = CategorySerializer


class ConsumableMaterialViewSet(viewsets.ModelViewSet):
    # CRUD de materiales consumibles.
    queryset = ConsumableMaterial.objects.all().order_by("id")  # 'id' corregido, ya no es Consumable_material
    serializer_class = ConsumableMaterialSerializer


class ReturnableMaterialViewSet(viewsets.ModelViewSet):
    queryset = ReturnableMaterial.objects.select_related(
        'consumable', 'consumable__brand', 'consumable__user', 'category'
    ).all().order_by("consumable_id")
    serializer_class = ReturnableMaterialSerializer

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