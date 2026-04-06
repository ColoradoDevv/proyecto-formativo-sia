# 
# Serializers del modulo products.
# Convierte modelos a JSON y valida lo que llega.
# 

from rest_framework import serializers

from .models import Brand, Category, ConsumableMaterial, ReturnableMaterial


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
        model = ConsumableMaterial
        fields = "__all__"
        extra_kwargs = {
            # Estos campos son opcionales segun el diccionario
            "sena_plate":    {"required": False, "allow_null": True},
            "quantity":      {"required": False, "allow_null": True},
            # Los siguientes estaban como opcionales en el serializer anterior
            # pero el diccionario los marca como obligatorios — se dejan
            # sin extra_kwargs para que DRF los valide correctamente
        }


class ReturnableMaterialSerializer(serializers.ModelSerializer):
    # Serializer para materiales retornables.

    class Meta:
        model = ReturnableMaterial
        fields = "__all__"
        extra_kwargs = {
            # Solo dimensiones es opcional segun el diccionario
            "dimensions": {"required": False, "allow_null": True},
        }