from rest_framework import serializers
from .models import SermonSeries, Sermon, WeeklyBulletin, BibleReading, ServiceHymn
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


class BibleReadingSerializer(serializers.ModelSerializer):
    reading_type_display = serializers.CharField(source='get_reading_type_display', read_only=True)
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = BibleReading
        fields = [
            'id', 'reading_type', 'reading_type_display', 'reader_name',
            'photo_url', 'scripture_reference', 'order'
        ]
    
    def get_photo_url(self, obj):
        if obj.reader_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.reader_photo.url)
            return obj.reader_photo.url
        return obj.reader_photo_url


class ServiceHymnSerializer(serializers.ModelSerializer):
    hymn_type_display = serializers.CharField(source='display_type', read_only=True)
    
    class Meta:
        model = ServiceHymn
        fields = [
            'id', 'hymn_type', 'hymn_type_display', 'custom_hymn_type',
            'hymn_number', 'hymn_title', 'order'
        ]


class WeeklyBulletinSerializer(serializers.ModelSerializer):
    readings = BibleReadingSerializer(many=True, read_only=True)
    hymns = ServiceHymnSerializer(many=True, read_only=True)
    pastor = PastorSerializer(read_only=True)
    
    class Meta:
        model = WeeklyBulletin
        fields = [
            'id', 'title', 'service_date', 'pastor', 'psalm_of_the_day', 'is_active', 'has_communion',
            'notes', 'readings', 'hymns', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
