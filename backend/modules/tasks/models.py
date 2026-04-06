# Modelo del modulo tasks (Tareas).

from django.db import models
from modules.users.models import User


class Task(models.Model):
    # Tarea asignada a un usuario dentro del sistema.

    # Estados permitidos segun diccionario (Activa / Inactiva)
    STATE_CHOICES = [
        ('Activa', 'Activa'),
        ('Inactiva', 'Inactiva'),
    ]

    # PK, AI, unico — generado automaticamente por Django
    id = models.AutoField(primary_key=True)

    # FK al usuario al que le pertenece la tarea — obligatorio segun diccionario
    user = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,  # No se puede borrar usuario si tiene tareas
        null=False
    )

    # Nombre de la tarea — obligatorio segun diccionario
    name = models.CharField(max_length=100)

    # Descripcion de la tarea — obligatorio segun diccionario
    description = models.CharField(max_length=255)

    # Estado actual de la tarea — obligatorio segun diccionario
    state = models.CharField(max_length=20, choices=STATE_CHOICES)

    class Meta:
        db_table = 'Tareas'

    def __str__(self):
        return self.name