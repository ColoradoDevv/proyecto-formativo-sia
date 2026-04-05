# Vistas del modulo productos.
# Aqui viven los endpoints CRUD.

from rest_framework import viewsets

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
    # CRUD de materiales retornables.
    queryset = ReturnableMaterial.objects.all().order_by("consumable_id")  # 'id_material_id' → 'consumable_id' por el nuevo nombre del campo
    serializer_class = ReturnableMaterialSerializer