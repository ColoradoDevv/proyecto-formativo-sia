# Modelos del modulo loans (Prestamos).

from django.db import models
from django.conf import settings # para referenciar el modelo de usuario personalizado definido en settings.py
from modules.products.models import ConsumableMaterial  # FK a materiales de consumo Y devolutivos


class Loans(models.Model):

    # Estados del prestamo. "Pendiente" queda para cuando exista la firma
    # electronica. El flujo de devolucion pasa de Activo a Finalizado, o a
    # Incompleto si un devolutivo se devuelve en menor cantidad a la prestada.
    STATE_CHOICES = [
        # ('Pendiente', 'Pendiente'),  # FUTURO: activar cuando se implemente firma electrónica.
        #   El préstamo nacería en Pendiente y pasaría a Activo solo tras la firma del receptor.
        ('Activo', 'Activo'),
        ('Finalizado', 'Finalizado'),
        ('Incompleto', 'Incompleto'),
    ]

    # id_loan: PK, AI, Único, obligatorio — Django lo genera automático con AutoField
    id_loan = models.AutoField(primary_key=True)

    # id_usuario: FK a tabla Usuario, obligatorio, sin valor por defecto
    id_responsable_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        db_column='id_responsable_user',
        related_name='prestamos_responsable',
        null=False
    )

    id_receptor_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.RESTRICT,
        db_column='id_receptor_user',
        related_name='prestamos_recibidos',
        null=False
    )

    # id_material: FK a Materiales (consumo Y devolutivos), obligatorio
    # Apunta a ConsumableMaterial porque Returnable_material hereda de ella
    id_material = models.ForeignKey(
        ConsumableMaterial,
        on_delete=models.RESTRICT,
        db_column='id_material',
        null=False
    )

    # amount_lent: entero 0-999999, obligatorio, sin PK ni FK
    amount_lent = models.IntegerField(
        null=False,
        default=None  # obligatorio, sin valor por defecto real
    )

    # apprentice_group: alfanumérico solo números, max 10, obligatorio
    apprentice_group = models.CharField(
        max_length=10,
        null=False
    )

    # justification_use: texto alfanumérico, max 255, obligatorio
    justification_use = models.CharField(   # respetando el typo del diccionario
        max_length=255,
        null=False
    )

    # return_date: fecha programada de devolución, default hoy, obligatorio
    return_date = models.DateField(
        null=False,
        default=models.fields.datetime.date.today  # CURRENT_TIMESTAMP equivalente en fecha
    )

    # loan_date: fecha de inicio del préstamo, default hoy, obligatorio
    loan_date = models.DateField(
        null=False,
        auto_now_add=True   # se llena automático al crear, equivale a CURRENT_TIMESTAMP
    )

    # state: estado del prestamo. Se marca "Finalizado" al registrar la devolucion.
    state = models.CharField(
        max_length=20,
        choices=STATE_CHOICES,
        default='Activo',
    )

    class Meta:
        db_table = 'Prestamos'

    def __str__(self):
        return f'Prestamo {self.id_loan} - Responsable {self.id_responsable_user_id} - Receptor {self.id_receptor_user_id} - Material {self.id_material_id}'