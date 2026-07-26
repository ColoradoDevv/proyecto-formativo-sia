# URLs del modulo loans.

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LoanViewSet, LoanSignView

router = DefaultRouter()
router.register(r'', LoanViewSet, basename='loans')

urlpatterns = [
    # Endpoint público de firma electrónica (sin autenticación de sesión)
    path('sign/', LoanSignView.as_view(), name='loan-sign'),
] + router.urls
