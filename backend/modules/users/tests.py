from django.test import TestCase

from .models import User
from .serializers import UserSerializer


class UserSerializerTests(TestCase):
    def test_duplicate_document_number_has_specific_error(self):
        User.objects.create_user(
            email="existing@example.com",
            password="test-password",
            first_name="Usuario",
            last_name="Existente",
            document_number="123456789",
        )

        serializer = UserSerializer(data={
            "email": "new@example.com",
            "first_name": "Usuario",
            "last_name": "Nuevo",
            "document_number": "123456789",
        })

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors["document_number"][0],
            "El número de documento ya está registrado para otro usuario.",
        )

# Create your tests here.
