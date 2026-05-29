# 
# Serializers del modulo products.
# Convierte modelos a JSON y valida lo que llega.
# 

from rest_framework import serializers

from .models import Brand, Category, ConsumableMaterial, ReturnableMaterial
from modules.users.models import User



class BrandSerializer(serializers.ModelSerializer):
    # Serializer simple para marcas.

    class Meta:
        model = Brand
        fields = "__all__"
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']

class ConsumableMaterialSerializer(serializers.ModelSerializer):
    # Para leer
    brand = BrandSerializer(read_only=True)
    user = UserMinimalSerializer(read_only=True)
    
    # Para escribir
    
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='user',
        write_only=True
    )

    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(),
        source='brand',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    def validate(self, data):
        if 'sena_plate' in data or 'quantity' in data:
            sena_plate = data.get('sena_plate')
            quantity = data.get('quantity')
            if not sena_plate and quantity is None:
                raise serializers.ValidationError({"quantity": "La cantidad es obligatoria si no hay placa SENA."})
        return data

    class Meta:
        model = ConsumableMaterial
        fields = "__all__"
        extra_kwargs = {
            "sena_plate": {"required": False, "allow_null": True},
            "quantity":   {"required": False, "allow_null": True},
        }


class ReturnableMaterialSerializer(serializers.ModelSerializer):
    # Serializer para materiales retornables.
# Para leer
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    # Para escribir
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(),
        source='brand',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = ReturnableMaterial
        fields = "__all__"
        extra_kwargs = {
            # Solo dimensiones es opcional segun el diccionario
            "dimensions": {"required": False, "allow_null": True},
        }