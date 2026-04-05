# Vistas del modulo tasks.
# Aqui viven los endpoints CRUD.

from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    # CRUD de tareas.
    queryset = Task.objects.all().order_by('id')
    serializer_class = TaskSerializer