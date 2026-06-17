#
# Permission Classes para Django REST Framework.
# Se usan en lugar de decoradores para mayor integración con DRF.
#

from rest_framework.permissions import BasePermission
from .services import PermissionService


class HasPermission(BasePermission):
    """
    Permission class base para verificar un permiso específico.

    Uso en ViewSet:
        class MiViewSet(viewsets.ModelViewSet):
            permission_classes = [HasPermission]
            required_permission = 'list_users'

    Uso en APIView:
        class MiAPIView(APIView):
            permission_classes = [HasPermission]
            required_permission = 'list_users'
    """

    message = "No tienes permiso para realizar esta acción"

    def has_permission(self, request, view):
        """
        Verifica si el usuario tiene el permiso requerido.

        El permiso requerido se define en:
        1. request.required_permission (si se asigna dinámicamente), O
        2. view.required_permission (atributo de la vista)
        """
        # Obtener permiso requerido de la solicitud o la vista
        required_permission = getattr(request, "required_permission", None)
        if required_permission is None:
            required_permission = getattr(view, "required_permission", None)

        # Si no hay permiso definido, permitir acceso
        if required_permission is None:
            return True

        # Verificar permiso
        if PermissionService.has_permission(request.user, required_permission):
            return True

        self.message = f"Permiso requerido: {required_permission}"
        return False


class HasAnyPermission(BasePermission):
    """
    Permission class que requiere AL MENOS UNO de los permisos especificados.

    Uso:
        class MiViewSet(viewsets.ModelViewSet):
            permission_classes = [HasAnyPermission]
            required_permissions = ['approve_loan', 'is_manager']
    """

    message = "No tienes ninguno de los permisos requeridos"

    def has_permission(self, request, view):
        """
        Verifica si el usuario tiene al menos uno de los permisos.
        """
        required_permissions = getattr(view, "required_permissions", [])

        if not required_permissions:
            return True

        has_any = any(
            PermissionService.has_permission(request.user, perm)
            for perm in required_permissions
        )

        if has_any:
            return True

        self.message = f"Se requiere uno de estos permisos: {', '.join(required_permissions)}"
        return False


class HasAllPermissions(BasePermission):
    """
    Permission class que requiere TODOS los permisos especificados.

    Uso:
        class MiViewSet(viewsets.ModelViewSet):
            permission_classes = [HasAllPermissions]
            required_permissions = ['edit_loan', 'approve_loan']
    """

    message = "No tienes todos los permisos requeridos"

    def has_permission(self, request, view):
        """
        Verifica si el usuario tiene todos los permisos.
        """
        required_permissions = getattr(view, "required_permissions", [])

        if not required_permissions:
            return True

        has_all = all(
            PermissionService.has_permission(request.user, perm)
            for perm in required_permissions
        )

        if has_all:
            return True

        self.message = f"Se requieren todos estos permisos: {', '.join(required_permissions)}"
        return False


class IsSuperUser(BasePermission):
    """
    Permission class que solo permite superusuarios.
    """

    message = "Solo superusuarios pueden acceder a esta acción"

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class IsAuthenticated(BasePermission):
    """
    Permission class que solo permite usuarios autenticados.
    """

    message = "Autenticación requerida"

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
