# 
# Serializers del modulo products.
# Convierte modelos a JSON y valida lo que llega.
# 

from rest_framework import serializers

from .models import Brand, Category, Consumable_material, Returnable_material


class BrandSerializer(serializers.ModelSerializer):
    # Serializer simple para marcas.

    class Meta:
        model = Brand
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    # Serializer simple para categorias.

    class Meta:
        model = Category
        fields = "__all__"


class ConsumableMaterialSerializer(serializers.ModelSerializer):
    # Serializer para materiales consumibles.

    class Meta:
        model = Consumable_material
        fields = "__all__"
        extra_kwargs = {
            "user": {"required": False, "allow_null": True},
            "id_brand": {"required": False, "allow_null": True},
            "plate_sena": {"required": False, "allow_null": True},
            "image": {"required": False, "allow_null": True},
            "quantity": {"required": False, "allow_null": True},
            "unit_price": {"required": False, "allow_null": True},
            "total_price": {"required": False, "allow_null": True},
            "state": {"required": False, "allow_null": True},
            "description": {"required": False, "allow_null": True},
            "date_of_purchase": {"required": False, "allow_null": True},
            "ubication": {"required": False, "allow_null": True},
        }


class ReturnableMaterialSerializer(serializers.ModelSerializer):
    # Serializer para materiales retornables.

    class Meta:
        model = Returnable_material
        fields = "__all__"
        extra_kwargs = {
            "id_category": {"required": False, "allow_null": True},
            "model": {"required": False, "allow_null": True},
            "serial": {"required": False, "allow_null": True},
            "technical_specifications": {"required": False, "allow_null": True},
            "dimensions": {"required": False, "allow_null": True},
        }
