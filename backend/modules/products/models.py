# Modelos de inventario (productos).

from django.db import models
from modules.users.models import User


class Brand(models.Model):
    # Marca simple para agrupar materiales.
    name = models.CharField(max_length=100, unique=True)  # UNICO segun diccionario

    def __str__(self):
        return self.name


class Category(models.Model):
    # Categoria para ordenar el inventario.
    name = models.CharField(max_length=100, unique=True)  # UNICO segun diccionario

    def __str__(self):
        return self.name


class ConsumableMaterial(models.Model):
    # Material consumible con estado y cantidad.
    # Tambien sirve como tabla base para materiales devolutivos.

    STATE_CHOICES = [
        ('Disponible', 'Disponible'),
        ('No Disponible', 'No Disponible'),
        ('Mantenimiento', 'Mantenimiento'),
        ('En prestamo', 'En prestamo'),
        ('Baja', 'Baja'),
    ]

    # FK al usuario responsable - obligatorio segun diccionario
    user = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        null=False
    )

    # FK a la marca - obligatorio segun diccionario
    brand = models.ForeignKey(
        Brand,
        on_delete=models.RESTRICT,
        null=False
    )

    # Placa SENA: unica, pero opcional (solo obligatoria si no es consumible puro)
    sena_plate = models.CharField(max_length=20, unique=True, null=True)

    # Nombre obligatorio segun diccionario
    name = models.CharField(max_length=100)

    # Imagen obligatoria segun diccionario
    image = models.ImageField(upload_to='materials/')

    # Cantidad: obligatoria solo si el material no tiene placa
    quantity = models.IntegerField(null=True)

    # Precios obligatorios segun diccionario
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)

    # Estado obligatorio segun diccionario
    state = models.CharField(max_length=20, choices=STATE_CHOICES)

    # Descripcion obligatoria segun diccionario
    description = models.CharField(max_length=255)

    # Fecha de compra obligatoria segun diccionario
    purchase_date = models.DateField()

    # Ubicacion obligatoria segun diccionario
    location = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class ReturnableMaterial(models.Model):
    # Material devolutivo con datos tecnicos adicionales.
    # Hereda datos base de ConsumableMaterial via OneToOneField como PK.

    # PK y FK a la vez - segun diccionario id_material es PK+FK
    consumable = models.OneToOneField(
        ConsumableMaterial,
        on_delete=models.RESTRICT,
        primary_key=True
    )

    # FK a categoria - obligatorio segun diccionario
    category = models.ForeignKey(
        Category,
        on_delete=models.RESTRICT,
        null=False
    )

    # Obligatorio segun diccionario
    model = models.CharField(max_length=100)

    # Unico y obligatorio segun diccionario
    serial = models.CharField(max_length=20, unique=True)

    # Ficha tecnica obligatoria segun diccionario
    technical_sheet = models.FileField(upload_to='specs/')

    # Dimensiones: opcional segun diccionario (obligatorio: No)
    dimensions = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.consumable.name