# Vistas del modulo tasks.
# Aqui viven los endpoints CRUD.

from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from modules.permissions.permissions_drf import HasPermission, IsSuperUser


class TaskViewSet(viewsets.ModelViewSet):
    # CRUD de tareas.
    queryset = Task.objects.all().order_by('id')
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [HasPermission("view_task")]
        if self.action == "create":
            return [HasPermission("create_task")]
        if self.action in ("update", "partial_update"):
            return [HasPermission("edit_task")]
        if self.action == "destroy":
            return [HasPermission("delete_task")]
        return [IsSuperUser()]

    def get_queryset(self):
        # Permite filtrar las tareas de un usuario con ?user=<id>.
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset