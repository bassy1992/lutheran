from rest_framework import serializers
from .models import SermonSeries, Sermon
from church.serializers import PastorSerializer


class SermonSeriesSerializer(serializers.ModelSerializer):
    sermon_count = serializers.ReadOnlyField()
    
    class Meta:
        model = SermonSeries
        fields = [
            'id', 'title', 'description', 'image', 'start_date',
            'end_date', 'is_active', 'sermon_count'
        ]


class SermonSerializer(serializers.ModelSerializer):
    pastor = PastorSerializer(read_only=True)
    series = SermonSeriesSerializer(read_only=True)
    
    class Meta:
        model = Sermon
        fields = [
            'id', 'title', 'description', 'pastor', 'series',
            'scripture_reference', 'date_preached', 'audio_file',
            'video_url', 'thumbnail', 'duration', 'view_count',
            'download_count', 'is_featured', 'is_published',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['view_count', 'download_count', 'created_at', 'updated_at']
