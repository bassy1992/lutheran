from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from .models import Ministry, MinistryInterest, Member
from .serializers import MinistrySerializer


class MinistryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ministry.objects.filter(is_active=True)
    serializer_class = MinistrySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Search by name or description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def express_interest(self, request, pk=None):
        """Express interest in joining a ministry"""
        ministry = self.get_object()
        
        # Get or create member profile for the user
        try:
            member = request.user.member_profile
        except Member.DoesNotExist:
            # Create a basic member profile if it doesn't exist
            member = Member.objects.create(
                user=request.user,
                first_name=request.user.first_name or request.user.username,
                last_name=request.user.last_name or '',
                email=request.user.email,
                phone='',
                gender='other',
                membership_status='visitor'
            )
        
        # Check if already expressed interest
        interest, created = MinistryInterest.objects.get_or_create(
            member=member,
            ministry=ministry
        )
        
        if created:
            return Response({
                'message': f'Your interest in {ministry.name} has been recorded. The ministry leader will contact you soon.'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'message': f'You have already expressed interest in {ministry.name}.'
            }, status=status.HTTP_200_OK)
