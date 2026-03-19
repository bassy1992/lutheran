from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import GalleryAlbum, GalleryPhoto
from .serializers import (
    GalleryAlbumSerializer, 
    GalleryAlbumListSerializer,
    GalleryPhotoSerializer
)


class GalleryAlbumViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryAlbum.objects.filter(is_published=True)
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return GalleryAlbumListSerializer
        return GalleryAlbumSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by featured
        is_featured = self.request.query_params.get('is_featured')
        if is_featured:
            queryset = queryset.filter(is_featured=True)
        
        # Search by title or description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        # Filter by year
        year = self.request.query_params.get('year')
        if year:
            queryset = queryset.filter(date__year=year)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def years(self, request):
        """Get list of years that have albums"""
        years = GalleryAlbum.objects.filter(
            is_published=True
        ).dates('date', 'year', order='DESC')
        
        year_list = [date.year for date in years]
        return Response({'years': year_list})


class GalleryPhotoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryPhoto.objects.all()
    serializer_class = GalleryPhotoSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by album
        album_id = self.request.query_params.get('album')
        if album_id:
            queryset = queryset.filter(album_id=album_id)
        
        # Filter by featured
        is_featured = self.request.query_params.get('is_featured')
        if is_featured:
            queryset = queryset.filter(is_featured=True)
        
        return queryset
