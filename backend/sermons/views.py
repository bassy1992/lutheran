from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import SermonSeries, Sermon, WeeklyBulletin
from .serializers import SermonSeriesSerializer, SermonSerializer, WeeklyBulletinSerializer


class SermonSeriesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SermonSeries.objects.filter(is_active=True)
    serializer_class = SermonSeriesSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Disable pagination for series


class SermonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sermon.objects.filter(is_published=True)
    serializer_class = SermonSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by series
        series_id = self.request.query_params.get('series')
        if series_id:
            queryset = queryset.filter(series_id=series_id)
        
        # Filter by pastor
        pastor_id = self.request.query_params.get('pastor')
        if pastor_id:
            queryset = queryset.filter(pastor_id=pastor_id)
        
        # Filter by featured
        is_featured = self.request.query_params.get('is_featured')
        if is_featured:
            queryset = queryset.filter(is_featured=True)
        
        # Search by title or scripture
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(scripture_reference__icontains=search) |
                Q(description__icontains=search)
            )
        
        return queryset


class WeeklyBulletinViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WeeklyBulletin.objects.all()
    serializer_class = WeeklyBulletinSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by active (current week)
        is_active = self.request.query_params.get('is_active')
        if is_active:
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
