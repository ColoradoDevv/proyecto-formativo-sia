from django.contrib import admin
from .models import Brand, Category, Consumable_material, Returnable_material

admin.site.register(Brand)
admin.site.register(Category)
admin.site.register(Consumable_material)
admin.site.register(Returnable_material)