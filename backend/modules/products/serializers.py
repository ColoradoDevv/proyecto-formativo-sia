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
    category = CategorySerializer(read_only=True)

    class Meta:
        model = ReturnableMaterial
        fields = ['consumable', 'category', 'model', 'serial', 'technical_sheet', 'dimensions']
        extra_kwargs = {
            "dimensions": {"required": False, "allow_null": True},
            "technical_sheet": {"required": False, "allow_blank": True},
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        c = instance.consumable
        rep['consumable_id'] = c.id
        rep['name'] = c.name
        rep['sena_plate'] = c.sena_plate
        rep['state'] = c.state
        rep['quantity'] = c.quantity
        rep['unit_price'] = str(c.unit_price)
        rep['total_price'] = str(c.total_price)
        rep['is_active'] = c.is_active
        rep['image'] = c.image.url if c.image else None
        rep['purchase_date'] = str(c.purchase_date) if c.purchase_date else None
        rep['location'] = c.location
        rep['description'] = c.description
        rep['brand'] = BrandSerializer(c.brand).data if c.brand else None
        rep['user'] = UserMinimalSerializer(c.user).data if c.user else None
        return rep