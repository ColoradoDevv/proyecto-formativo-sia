# Vistas del modulo productos.
# Aqui viven los endpoints CRUD.

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