# Registro de modelos en el admin (util para cargar roles rapido).

from django.contrib import admin
from .models import User, Role, DocumentType

admin.site.register(User)
admin.site.register(Role)
admin.site.register(DocumentType)