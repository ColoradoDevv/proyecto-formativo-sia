# Modelos del modulo loans (Prestamos).

from django.db import models
from modules.users.models import User
from modules.products.models import Consumable_material  # FK a materiales de consumo Y devolutivos


class Loans(models.Model):

    # id_loan: PK, AI, Único, obligatorio — Django lo genera automático con AutoField
    id_loan = models.AutoField(primary_key=True)

    # id_usuario: FK a tabla Usuario, obligatorio, sin valor por defecto
    id_user = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        db_column='id_usuario',
        null=False
    )

    # id_material: FK a Materiales (consumo Y devolutivos), obligatorio
    # Apunta a Consumable_material porque Returnable_material hereda de ella
    id_material = models.ForeignKey(
        Consumable_material,
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

    class Meta:
        db_table = 'Prestamos'

    def __str__(self):
        return f'Prestamo {self.id_loan} - Usuario {self.id_user_id} - Material {self.id_material_id}'