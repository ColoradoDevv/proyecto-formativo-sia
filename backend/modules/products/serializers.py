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
    # ── Campos de solo lectura (enriquecidos) ─────────────────────────────
    brand              = BrandSerializer(read_only=True)
    user               = UserMinimalSerializer(read_only=True)
    available_quantity = serializers.SerializerMethodField()
    is_exhausted       = serializers.SerializerMethodField()

    # ── Campos de escritura para archivos ─────────────────────────────────
    # ImageField/FileField aceptan el archivo subido en un POST/PATCH multipart.
    # En to_representation se reemplazan por la URL relativa (/media/...).
    image           = serializers.ImageField(required=False, allow_null=True, allow_empty_file=True, use_url=False)
    technical_sheet = serializers.FileField(required=False,  allow_null=True, allow_empty_file=True, use_url=False)

    # ── Campos de escritura para FKs ──────────────────────────────────────
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

    # ── Métodos computados ────────────────────────────────────────────────

    def get_available_quantity(self, obj):
        if obj.quantity is None:
            return None
        from modules.loans.models import Loans
        already_lent = (
            Loans.objects.filter(id_material=obj, state='Activo')
            .aggregate(total=Sum('amount_lent'))['total'] or 0
        )
        return max(0, obj.quantity - already_lent)

    def get_is_exhausted(self, obj):
        if obj.quantity is None:
            return False
        if obj.quantity <= 0:
            return True
        available = self.get_available_quantity(obj)
        return available is not None and available <= 0

    # ── Validación ────────────────────────────────────────────────────────

    def validate(self, data):
        if 'sena_plate' in data or 'quantity' in data:
            sena_plate = data.get('sena_plate')
            quantity   = data.get('quantity')
            if not sena_plate and quantity is None:
                raise serializers.ValidationError({"quantity": "La cantidad es obligatoria si no hay placa SENA."})

        quantity = data.get('quantity')
        if quantity is not None and quantity < 0:
            raise serializers.ValidationError({'quantity': 'El stock no puede ser negativo.'})

        return data

    # ── Serialización de salida ───────────────────────────────────────────

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # Reemplazar los valores de ImageField/FileField (rutas relativas del FS)
        # por URLs navegables via el proxy de Vite → /media/<path>.
        rep['image'] = (
            f"/media/{instance.image.name}" if instance.image and instance.image.name else None
        )
        rep['technical_sheet'] = (
            f"/media/{instance.technical_sheet.name}"
            if instance.technical_sheet and instance.technical_sheet.name else None
        )
        # Si el material está agotado, forzar state = "No Disponible" en la respuesta.
        if rep.get('is_exhausted'):
            rep['state'] = 'No Disponible'
        return rep

    class Meta:
        model = ConsumableMaterial
        fields = "__all__"
        extra_kwargs = {
            "sena_plate": {"required": False, "allow_null": True},
            "quantity":   {"required": False, "allow_null": True},
        }


# ── Ficha técnica ─────────────────────────────────────────────────────────────

class TechnicalSheetSerializer(serializers.ModelSerializer):
    """Serializer para una ficha técnica individual."""
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        return f"/media/{obj.file.name}" if obj.file and obj.file.name else None

    class Meta:
        from .models import TechnicalSheet
        model  = TechnicalSheet
        fields = ['id', 'url', 'uploaded_at']


class ReturnableMaterialSerializer(serializers.ModelSerializer):
    category        = CategorySerializer(read_only=True)
    technical_sheets = serializers.SerializerMethodField()

    def get_technical_sheets(self, obj):
        from .models import TechnicalSheet
        sheets = TechnicalSheet.objects.filter(material=obj.consumable)
        return TechnicalSheetSerializer(sheets, many=True).data

    class Meta:
        model = ReturnableMaterial
        fields = ['consumable', 'category', 'model', 'serial', 'technical_sheet', 'dimensions', 'technical_sheets']
        extra_kwargs = {
            "dimensions":     {"required": False, "allow_null": True},
            "technical_sheet": {"required": False},
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        c = instance.consumable
        rep['consumable_id'] = c.id
        rep['name']          = c.name
        rep['sena_plate']    = c.sena_plate
        rep['state']         = c.state
        rep['quantity']      = c.quantity
        rep['unit_price']    = str(c.unit_price)
        rep['total_price']   = str(c.total_price)
        rep['is_active']     = c.is_active

        # is_exhausted / available_quantity
        if c.quantity is None:
            rep['is_exhausted']       = False
            rep['available_quantity'] = None
        else:
            from modules.loans.models import Loans
            from django.db.models import Sum as _Sum
            already_lent = (
                Loans.objects.filter(id_material=c, state='Activo')
                .aggregate(total=_Sum('amount_lent'))['total'] or 0
            )
            rep['is_exhausted']       = c.quantity <= 0 or max(0, c.quantity - already_lent) == 0
            rep['available_quantity'] = max(0, c.quantity - already_lent)

        if rep['is_exhausted']:
            rep['state'] = 'No Disponible'

        rep['image']        = f"/media/{c.image.name}" if c.image and c.image.name else None
        rep['purchase_date'] = str(c.purchase_date) if c.purchase_date else None
        rep['location']     = c.location
        rep['description']  = c.description
        rep['brand']        = BrandSerializer(c.brand).data if c.brand else None
        rep['user']         = UserMinimalSerializer(c.user).data if c.user else None

        # Fichas técnicas como lista de { id, url, uploaded_at }
        # (reemplaza el campo legacy technical_sheet de la tabla ReturnableMaterial)
        rep.pop('technical_sheet', None)
        return rep