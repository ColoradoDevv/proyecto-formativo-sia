from django.urls import path
from .views import UserListCreateView, UserDetailView

urlpatterns = [
    path('', UserListCreateView.as_view()), # GET lista / POST crear
    path('<str:pk>/', UserDetailView.as_view()), # GET uno / PUT / DELETE
]
