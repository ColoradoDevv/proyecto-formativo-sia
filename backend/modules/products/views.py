# Vistas del modulo productos.
# Aqui viven los endpoints CRUD.

from rest_framework import viewsets

from .models import Brand, Category, Consumable_material, Returnable_material
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

    queryset = Consumable_material.objects.all().order_by("id")
    serializer_class = ConsumableMaterialSerializer


class ReturnableMaterialViewSet(viewsets.ModelViewSet):
    # CRUD de materiales retornables.

    queryset = Returnable_material.objects.all().order_by("id_material_id")
    serializer_class = ReturnableMaterialSerializer
