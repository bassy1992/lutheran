from rest_framework import serializers
from .models import ChurchInfo, Pastor, ServiceTime, CoreValue


class ChurchInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChurchInfo
        fields = [
            'id', 'name', 'tagline', 'description', 'address', 'city', 'country',
            'phone', 'email', 'website', 'founded_year', 'logo', 'facebook_url',
            'twitter_url', 'instagram_url', 'youtube_url', 'updated_at'
        ]
        read_only_fields = ['updated_at']


class PastorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pastor
        fields = [
            'id', 'name', 'role', 'bio', 'photo', 'email', 'phone',
            'joined_date', 'is_active', 'order'
        ]


class ServiceTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTime
        fields = ['id', 'day', 'time', 'description', 'is_active', 'order']


class CoreValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoreValue
        fields = ['id', 'title', 'description', 'icon', 'order']

