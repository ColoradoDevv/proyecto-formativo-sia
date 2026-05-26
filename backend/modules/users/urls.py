# Rutas del CRUD de usuarios.

from django.urls import path

from . import views

urlpatterns = [
    path("", views.UserListCreateView.as_view(), name="users-list"),
    path("<int:pk>/", views.UserDetailView.as_view(), name="users-detail"),
    path("roles/", views.UserRolesListView.as_view(), name="users-roles-list"),
    path("document-types/", views.UserDocumentTypesListView.as_view(), name="users-document-types-list"),
]
