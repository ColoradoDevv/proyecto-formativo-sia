# Vistas del modulo tasks.
# Aqui viven los endpoints CRUD.

from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    # CRUD de tareas.
    queryset = Task.objects.all().order_by('id')
    serializer_class = TaskSerializer

    def get_queryset(self):
        # Permite filtrar las tareas de un usuario con ?user=<id>.
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset