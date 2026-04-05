# 
# Modelos del modulo users.
# Aqui vive la data principal de personas y roles.
# 

from django.db import models


class Role(models.Model):
    # Rol para clasificar y controlar permisos de usuarios.
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=225, null=True)  # Opcional segun diccionario

    def __str__(self):
        return self.name


class DocumentType(models.Model):
    # Tabla de tipos de documento (CC, TI, CE, etc).
    # Se maneja como tabla real en BD segun diccionario, no como TextChoices.
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=255, null=True)  # Opcional segun diccionario

    def __str__(self):
        return self.name


class User(models.Model):
    # Registro principal de usuario con datos personales, contacto y acceso.

    # --- Datos personales ---
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    # FK a Tipos_documento 
    document_type = models.ForeignKey(
        DocumentType,
        on_delete=models.RESTRICT,  # No se puede borrar un tipo si hay usuarios que lo usan
        null=True
    )

    # CharField porque el diccionario lo define como Alfanumérico
    document_number = models.CharField(max_length=20, unique=True)

    # FK a Roles - SET_NULL para no borrar usuario si se elimina el rol
    role = models.ForeignKey(
        Role,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # --- Fechas de vinculacion ---
    start_date = models.DateField()
    end_date = models.DateField()

    # --- Contacto ---
    email = models.EmailField(unique=True, max_length=254)

    # CharField porque el diccionario define telefono como Alfanumérico (puede tener +57, etc)
    phone_number = models.CharField(max_length=15, unique=True)
    second_phone_number = models.CharField(max_length=15, null=True)  # Opcional segun diccionario

    address = models.CharField(max_length=100)

    # --- Estado y multimedia ---
    status = models.BooleanField(default=True)  # Default 1 segun diccionario
    profile_picture = models.ImageField(upload_to='profiles/', null=True)  # Opcional

    # --- Acceso al sistema ---
    password = models.CharField(max_length=255)

    # Cuentadante: persona responsable de responder por los materiales
    accountable = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'