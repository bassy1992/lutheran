from rest_framework import serializers
from .models import GalleryAlbum, GalleryPhoto


class GalleryPhotoSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    thumbnail = serializers.ImageField(use_url=True, read_only=True)
    
    class Meta:
        model = GalleryPhoto
        fields = [
            'id', 'album', 'title', 'description', 'image', 'thumbnail',
            'photographer', 'date_taken', 'order', 'is_featured', 'created_at'
        ]


class GalleryAlbumSerializer(serializers.ModelSerializer):
    photo_count = serializers.ReadOnlyField()
    photos = GalleryPhotoSerializer(many=True, read_only=True)
    cover_image = serializers.ImageField(use_url=True, required=False)
    
    class Meta:
        model = GalleryAlbum
        fields = [
            'id', 'title', 'description', 'cover_image', 'date',
            'is_featured', 'is_published', 'photo_count', 'photos',
            'created_at', 'updated_at'
        ]


class GalleryAlbumListSerializer(serializers.ModelSerializer):
    """Lighter serializer for album list view without photos"""
    photo_count = serializers.ReadOnlyField()
    cover_image = serializers.ImageField(use_url=True, required=False)
    
    class Meta:
        model = GalleryAlbum
        fields = [
            'id', 'title', 'description', 'cover_image', 'date',
            'is_featured', 'is_published', 'photo_count',
            'created_at', 'updated_at'
        ]
