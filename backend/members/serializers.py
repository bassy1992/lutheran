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
    
    class Meta:
        model = Ministry
        fields = [
            'id', 'name', 'description', 'leader', 'image', 'is_active',
            'member_count', 'created_at'
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
