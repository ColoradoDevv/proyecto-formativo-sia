# Vista sencilla para la ruta raiz (ping rapido).

from django.http import HttpResponse


def index(request):
    # Devuelve un texto simple para confirmar que el servidor responde.
    return HttpResponse("Hello, world. You're at the polls index.")
