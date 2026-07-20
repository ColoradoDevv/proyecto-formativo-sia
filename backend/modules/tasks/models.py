# Modelo del modulo tasks (Tareas).

from django.db import models
from django.conf import settings


class Task(models.Model):
    # Tarea asignada a un usuario dentro del sistema (RFADMIN46-49).

    # Estados permitidos segun requerimiento.
    STATE_CHOICES = [
        ('Pendiente', 'Pendiente'),
        ('En progreso', 'En progreso'),
        ('Completada', 'Completada'),
        ('Cancelada', 'Cancelada'),
    ]

    # PK, AI, unico — generado automaticamente por Django
    id = models.AutoField(primary_key=True)

    # FK al usuario asignado — obligatorio. Una tarea se asigna a un solo
    # usuario y no puede reasignarse una vez creada.
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,  # No se puede borrar usuario si tiene tareas
        null=False
    )

    # Titulo de la tarea — obligatorio.
    name = models.CharField(max_length=100)

    # Descripcion de la tarea — obligatorio.
    description = models.CharField(max_length=255)

    # Fechas de la tarea. La fecha de fin no puede ser anterior a la de inicio.
    start_date = models.DateField()
    end_date = models.DateField()

    # Estado actual de la tarea — por defecto "Pendiente".
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='Pendiente')

    class Meta:
        db_table = 'Tareas'

    def __str__(self):
        return self.name