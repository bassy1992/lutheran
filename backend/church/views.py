from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import ChurchInfo, Pastor, ServiceTime, CoreValue
from .serializers import ChurchInfoSerializer, PastorSerializer, ServiceTimeSerializer, CoreValueSerializer


class ChurchInfoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ChurchInfo.objects.all()
    serializer_class = ChurchInfoSerializer
    permission_classes = [AllowAny]


class PastorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Pastor.objects.filter(is_active=True)
    serializer_class = PastorSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Disable pagination for pastors


class ServiceTimeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceTime.objects.filter(is_active=True)
    serializer_class = ServiceTimeSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Disable pagination for service times


class CoreValueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CoreValue.objects.all()
    serializer_class = CoreValueSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Disable pagination for core values

