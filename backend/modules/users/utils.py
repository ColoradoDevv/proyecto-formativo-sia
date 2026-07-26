# modules/users/utils.py
import secrets 
import string

from django.conf import settings
from django.core.mail import send_mail

def generate_secure_password(length=12):
    """
    Genera una contraseña aleatoria criptograficamente segura que cumple
    la misma politica de complejidad usada en ResetPasswordView:
    minimo 10 caracteres, mayuscula, minuscula, numero y caracter especial.
    """
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    special = "!@#$%^&*()-_=+"

    # Garantizamos al menos un caracter de cada tipo exigido por la politica
    required_chars = [
        secrets.choice(lowercase),
        secrets.choice(uppercase),
        secrets.choice(digits),
        secrets.choice(special),
    ]

    all_chars = lowercase + uppercase + digits + special
    remaining = [secrets.choice(all_chars) for _ in range(length - len(required_chars))]

    password_chars = required_chars + remaining
    secrets.SystemRandom().shuffle(password_chars)  # evita que los tipos queden en orden fijo

    return "".join(password_chars)

def send_welcome_email(user, plain_password):
    """
    Envia al correo del usuario recien creado sus credenciales de acceso.
    Se usa la misma configuracion SMTP (Gmail) ya definida en settings.
    """
    send_mail(
        subject="Bienvenido a SGI - Tus credenciales de acceso",
        message=(
            f"Hola {user.first_name},\n\n"
            "Se ha creado una cuenta para ti en el sistema SGI.\n"
            "Estas son tus credenciales de acceso:\n\n"
            f"Correo: {user.email}\n"
            f"Contraseña: {plain_password}\n\n"
            "Por seguridad, te recomendamos iniciar sesión y cambiar tu contraseña "
            "lo antes posible desde la opción 'Olvidé mi contraseña'.\n\n"
            f"Inicia sesión aquí: {settings.FRONTEND_URL}/login"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
