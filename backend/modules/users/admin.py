from django.contrib import admin
from .models import User, Role, Type_document

admin.site.register(User)
admin.site.register(Role)
admin.site.register(Type_document)