# Rutas del CRUD de usuarios.

from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.LoginView.as_view(), name="login"),
    path("forgot-password/", views.ForgetPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", views.ResetPasswordView.as_view(), name="reset-password"),

    path("", views.UserListCreateView.as_view(), name="users-list"),
    path("trash/", views.UserTrashListView.as_view(), name="users-trash"),
    path("<int:pk>/", views.UserDetailView.as_view(), name="users-detail"),
    path("<int:pk>/restore/", views.UserRestoreView.as_view(), name="users-restore"),

    path("roles/", views.UserRolesListView.as_view(), name="users-roles-list"),
    path("document-types/", views.UserDocumentTypesListView.as_view(), name="users-document-types-list"),
]