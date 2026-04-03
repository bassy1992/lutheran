from rest_framework import serializers
from .models import Member, Ministry, MinistryMembership, MinistryInterest


class MemberSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Member
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'date_of_birth', 'gender', 'address', 'city', 'country', 'photo',
            'membership_status', 'joined_date', 'baptism_date', 'is_active'
        ]
        read_only_fields = ['joined_date']


class MinistrySerializer(serializers.ModelSerializer):
    member_count = serializers.ReadOnlyField()
    leader = MemberSerializer(read_only=True)
    image_display_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Ministry
        fields = [
            'id', 'name', 'description', 'leader', 'image', 'image_url', 
            'image_display_url', 'is_active', 'member_count', 'created_at'
        ]
        read_only_fields = ['created_at']


class MinistryMembershipSerializer(serializers.ModelSerializer):
    member = MemberSerializer(read_only=True)
    ministry = MinistrySerializer(read_only=True)
    
    class Meta:
        model = MinistryMembership
        fields = ['id', 'member', 'ministry', 'joined_date', 'role', 'is_active']
        read_only_fields = ['joined_date']


class MinistryInterestSerializer(serializers.ModelSerializer):
    member = MemberSerializer(read_only=True)
    ministry = MinistrySerializer(read_only=True)
    
    class Meta:
        model = MinistryInterest
        fields = ['id', 'member', 'ministry', 'expressed_at', 'contacted', 'notes']
        read_only_fields = ['expressed_at']


class MinistryRegistrationSerializer(serializers.Serializer):
    """Serializer for registering a new member to a ministry"""
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    gender = serializers.ChoiceField(choices=Member.GENDER_CHOICES)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    
    def validate_email(self, value):
        """Check if email is already registered"""
        return value
