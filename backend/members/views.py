from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from django.contrib.auth.models import User
from .models import Ministry, MinistryInterest, Member, MinistryMembership
from .serializers import MinistrySerializer, MinistryRegistrationSerializer


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
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def register(self, request, pk=None):
        """Register a new member to a ministry"""
        ministry = self.get_object()
        
        serializer = MinistryRegistrationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Check if member with this email already exists
        member = Member.objects.filter(email=data['email']).first()
        
        if member:
            # Member exists, check if already in this ministry
            membership_exists = MinistryMembership.objects.filter(
                member=member,
                ministry=ministry
            ).exists()
            
            if membership_exists:
                return Response({
                    'error': 'You are already registered for this ministry.'
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Create new member (without user account)
            # Generate a unique username from email
            username = data['email'].split('@')[0]
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            # Create user account
            user = User.objects.create_user(
                username=username,
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name']
            )
            
            # Create member profile
            member = Member.objects.create(
                user=user,
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                phone=data['phone'],
                date_of_birth=data.get('date_of_birth'),
                gender=data['gender'],
                address=data.get('address', ''),
                city=data.get('city', ''),
                membership_status='visitor'
            )
        
        # Create ministry membership
        MinistryMembership.objects.create(
            member=member,
            ministry=ministry,
            is_active=True
        )
        
        return Response({
            'message': f'Successfully registered for {ministry.name}! Welcome to our ministry.',
            'member_id': member.id
        }, status=status.HTTP_201_CREATED)
