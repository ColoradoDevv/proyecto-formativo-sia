from django.db import models
from modules.users.models import User

class Brand(models.Model):
    name = models.CharField(max_length=100)

class Category(models.Model):
    name =  models.CharField(max_length=100)

class Consumable_material(models.Model):
    STATE_CHOICES = [
        ('Disponible', 'Disponible'),
        ('No Disponible', 'No Disponible'),
        ('Mantenimiento', 'Mantenimiento'),
        ('En préstamo', 'En préstamo'),
        ('Baja', 'Baja'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.RESTRICT, null=True)
    id_brand = models.ForeignKey(Brand, on_delete=models.RESTRICT, null=True)
    plate_sena = models.CharField(max_length=20, unique=True, null=True)
    material_name = models.CharField(max_length=100)
    image = models.ImageField(null=True)
    quantity = models.IntegerField(null=True)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    total_price = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    state = models.CharField(max_length=20, choices=STATE_CHOICES, null=True)
    description = models.CharField(max_length=255, null=True)
    date_of_purchase = models.DateField(null=True)
    ubication = models.CharField(max_length=100, null=True)
    
    def __str__(self):
        return self.material_name

class Returnable_material(models.Model):
    id_material = models.OneToOneField(
        Consumable_material,
        on_delete=models.RESTRICT,
        primary_key=True
    )
    id_category = models.ForeignKey(Category, on_delete=models.RESTRICT, null=True)
    model = models.CharField(max_length=100, null=True)
    serial = models.CharField(max_length=20, unique=True, null=True)
    technical_specifications = models.FileField(null=True)
    dimensions = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.id_material.material_name