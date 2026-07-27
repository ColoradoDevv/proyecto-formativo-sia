# 
# Serializers del modulo products.
# Convierte modelos a JSON y valida lo que llega.
# 

from rest_framework import serializers
from django.db.models import Sum

from .models import Brand, Category, ConsumableMaterial, ReturnableMaterial
from modules.users.models import User



class BrandSerializer(serializers.ModelSerializer):
    # Serializer simple para marcas.

    def validate_name(self, value):
        # Unicidad insensible a mayúsculas/minúsculas (SQLite es case-sensitive
        # en UNIQUE, por lo que "SENA" y "sena" coexistirían sin esta guarda).
        qs = Brand.objects.filter(name__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Ya existe una marca con ese nombre.")
        return value

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
    available_quantity = serializers.SerializerMethodField()

    # URL con prefijo /media/ para que el proxy de Vite la redirija al backend.
    # Se usa SerializerMethodField para controlar el formato exacto del path.
    image = serializers.SerializerMethodField()

    # URL de la ficha técnica con el mismo patrón que la imagen.
    technical_sheet = serializers.SerializerMethodField()

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

    def get_image(self, obj):
        # obj.image es un ImageField; .name es el path relativo guardado en BD
        # (ej. "materials/archivo.jpg"). Solo devolvemos la URL si el archivo
        # tiene nombre real — evita devolver "/media/" cuando el campo está vacío.
        if obj.image and obj.image.name:
            return f"/media/{obj.image.name}"
        return None

    def get_technical_sheet(self, obj):
        # Mismo patrón que get_image: path relativo prefijado con /media/
        # para que el proxy de Vite lo redirija al backend en desarrollo.
        if obj.technical_sheet and obj.technical_sheet.name:
            return f"/media/{obj.technical_sheet.name}"
        return None

    
    def validate(self, data):
        # Obligatoriedad condicional: si no hay placa SENA debe haber cantidad
        if 'sena_plate' in data or 'quantity' in data:
            sena_plate = data.get('sena_plate')
            quantity = data.get('quantity')
            if not sena_plate and quantity is None:
                raise serializers.ValidationError({"quantity": "La cantidad es obligatoria si no hay placa SENA."})

        # El stock no puede ser negativo
        quantity = data.get('quantity')
        if quantity is not None and quantity < 0:
            raise serializers.ValidationError({'quantity': 'El stock no puede ser negativo.'})

        return data

    def get_available_quantity(self, obj):
        if obj.quantity is None:
            return None

        # Import local para evitar import circular: loans.models importa
        # ConsumableMaterial desde products, asi que products no puede
        # importar Loans a nivel de modulo.
        from modules.loans.models import Loans

        already_lent = Loans.objects.filter(
            id_material=obj,
            state='Activo',
        ).aggregate(total=Sum('amount_lent'))['total'] or 0

        return obj.quantity - already_lent

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
            "technical_sheet": {"required": False},
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
        # Mismo formato que ConsumableMaterialSerializer: /media/<path> via proxy Vite.
        rep['image'] = f"/media/{c.image.name}" if c.image and c.image.name else None
        # Ficha técnica: también con el mismo patrón para consistencia.
        rep['technical_sheet'] = f"/media/{instance.technical_sheet.name}" if instance.technical_sheet and instance.technical_sheet.name else None
        rep['purchase_date'] = str(c.purchase_date) if c.purchase_date else None
        rep['location'] = c.location
        rep['description'] = c.description
        rep['brand'] = BrandSerializer(c.brand).data if c.brand else None
        rep['user'] = UserMinimalSerializer(c.user).data if c.user else None
        return rep