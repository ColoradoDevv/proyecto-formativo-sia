from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Material
from .serializers import MaterialSerializer
from django.shortcuts import render

class UserListCreateView(APIView):
    def get(self, request):
        materials = Material.objects.all()
        return Response(MaterialSerializer(materials, many=True).data)
    
    def post(self, request):
        serializer = MaterialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    def get_object(self, pk):
        try: return Material.objects.get(id=pk)
        except: return None

    def get(self, request, pk):
        material = self.get_object(pk)
        if not material: return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(MaterialSerializer(material).data)
    
    def put(self, request, pk):
        material = self.get_object(pk)
        if not material: return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = MaterialSerializer(material, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        material = self.get_object(pk)
        if not material: return Response(status=status.HTTP_404_NOT_FOUND)
        material.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
