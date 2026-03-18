from django.db import models

class Type_document(models.Model):
    # agrega los campos que necesites
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Role(models.Model):
    # agrega los campos que necesites
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class User(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    type_document = models.ForeignKey(Type_document, on_delete=models.RESTRICT)
    number_document = models.IntegerField(unique=True)
    role = models.ForeignKey(Role, on_delete=models.RESTRICT)
    date_start = models.DateField()
    date_end = models.DateField()
    email = models.EmailField(unique=True, max_length=254)
    phone_number = models.IntegerField(unique=True)
    direction = models.CharField(max_length=100)
    status = models.BooleanField(default=True)
    second_phonenumber = models.IntegerField(null=True)
    institutional_email = models.EmailField(null=True, unique=True, max_length=254)
    profile_picture = models.ImageField(null=True)

    def __str__(self):
        return self.first_name