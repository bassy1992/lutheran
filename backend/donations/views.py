from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import DonationCategory, Donation
from .serializers import DonationCategorySerializer, DonationSerializer


class DonationCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DonationCategory.objects.filter(is_active=True)
    serializer_class = DonationCategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Return all categories without pagination


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'payment_method']
    search_fields = ['donor_name', 'donor_email', 'transaction_id']
    ordering_fields = ['donated_at', 'amount']
    ordering = ['-donated_at']
