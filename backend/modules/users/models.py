#
# Modelos del modulo users.
# Aqui vive la data principal de personas y roles.
#

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,      # esqueleto de usuario: trae password y last_login
    PermissionsMixin,      # agrega is_superuser, groups y user_permissions
    BaseUserManager,       # clase base para crear nuestro "manager"
)


class Role(models.Model):
    # Rol para clasificar y controlar permisos de usuarios.
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=225, null=True, blank=True)  # Opcional segun diccionario

    def __str__(self):
        return self.name


class DocumentType(models.Model):
    # Tabla de tipos de documento (CC, TI, CE, etc).
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=255, null=True, blank=True)  # Opcional segun diccionario

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    # Django EXIGE un manager con estos metodos cuando el User es custom.
    # Es el encargado de "fabricar" usuarios correctamente.

    def create_user(self, email, password=None, **extra_fields):
        # Crea un usuario normal.
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)        # pasa el dominio a minusculas
        user = self.model(email=email, **extra_fields)
        user.set_password(password)                # hashea la contrasena automaticamente
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # Crea un superusuario (acceso total al admin).
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    # Registro principal de usuario con datos personales, contacto y acceso.
    # password y last_login los hereda de AbstractBaseUser.

    # --- Datos personales ---
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    document_type = models.ForeignKey(
        DocumentType,
        on_delete=models.RESTRICT,   # no se puede borrar un tipo si hay usuarios que lo usan
        null=True
    )
    document_number = models.CharField(max_length=20, unique=True, null=True, blank=True)

    # --- Fechas de vinculacion ---
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    # --- Contacto ---
    email = models.EmailField(unique=True, max_length=254)
    institutional_email = models.EmailField(unique=True, max_length=254, null=True, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    second_phone_number = models.CharField(max_length=15, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)

    # --- Multimedia ---
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    # Cuentadante: persona responsable de responder por los materiales
    accountable = models.CharField(max_length=100, null=True, blank=True)

    # --- Campos que Django necesita para el control de acceso ---
    is_active = models.BooleanField(default=True)   # si esta en False, no puede entrar
    is_staff = models.BooleanField(default=False)   # si puede entrar al panel /admin

    # Conecta el manager de arriba con este modelo
    objects = UserManager()

    # El campo que se usa para iniciar sesion (en vez del username de Django)
    USERNAME_FIELD = "email"
    # Campos que se piden al crear un superusuario por consola (ademas de email y password)
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return f'{self.first_name} {self.last_name}'