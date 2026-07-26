# URLs del modulo loans.

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import LoanViewSet, LoanSignView, LoanSignRequestOTPView

router = DefaultRouter()
router.register(r'', LoanViewSet, basename='loans')

urlpatterns = [
    path('sign/request-otp/', LoanSignRequestOTPView.as_view(), name='loan-sign-request-otp'),
    path('sign/', LoanSignView.as_view(), name='loan-sign'),
] + router.urls
