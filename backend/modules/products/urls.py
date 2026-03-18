# Rutas del modulo productos (CRUD).

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    BrandViewSet,
    CategoryViewSet,
    ConsumableMaterialViewSet,
    ReturnableMaterialViewSet,
)

router = DefaultRouter()
router.register(r"brands", BrandViewSet, basename="brands")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"consumables", ConsumableMaterialViewSet, basename="consumables")
router.register(r"returnables", ReturnableMaterialViewSet, basename="returnables")

urlpatterns = [
    path("", include(router.urls)),
]
