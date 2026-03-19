from rest_framework import serializers
from .models import DonationCategory, Donation


class DonationCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationCategory
        fields = ['id', 'name', 'description', 'is_active']


class DonationSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Donation
        fields = [
            'id', 'member', 'donor_name', 'donor_email', 'donor_phone',
            'category', 'category_name', 'amount', 'currency', 'payment_method',
            'transaction_id', 'status', 'is_anonymous', 'notes',
            'donated_at', 'updated_at'
        ]
        read_only_fields = ['id', 'donated_at', 'updated_at']
