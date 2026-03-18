from django.db import models

class Role(models.Model):
    # agrega los campos que necesites
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=225, null=True)

    def __str__(self):
        return self.name

class DocumentType(models.TextChoices):
    CC = "CC", "CC"
    TI = "TI", "TI"
    CE = "CE", "CE"
    PPT = "PPT", "PPT"
    PPE = "PPE", "PPE"

class User(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    type_document = models.CharField(max_length=3, choices=DocumentType.choices)
    number_document = models.BigIntegerField(unique=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    date_start = models.DateField()
    date_end = models.DateField()
    email = models.EmailField(unique=True, max_length=254)
    phone_number = models.BigIntegerField(unique=True)
    direction = models.CharField(max_length=100)
    status = models.BooleanField(default=True)
    second_phonenumber = models.BigIntegerField(null=True)
    institutional_email = models.EmailField(null=True, unique=True, max_length=254)
    profile_picture = models.ImageField(null=True)

    def __str__(self):
        return self.first_name
