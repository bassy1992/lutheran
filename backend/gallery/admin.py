from django.contrib import admin
from django.utils.html import format_html
from .models import GalleryAlbum, GalleryPhoto


class GalleryPhotoInline(admin.TabularInline):
    model = GalleryPhoto
    extra = 3
    fields = ['image', 'title', 'description', 'photographer', 'order', 'is_featured', 'image_preview']
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 100px;" />', obj.thumbnail.url)
        elif obj.image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 100px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'


@admin.register(GalleryAlbum)
class GalleryAlbumAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'photo_count', 'is_featured', 'is_published', 'cover_preview', 'created_at']
    list_filter = ['is_featured', 'is_published', 'date']
    search_fields = ['title', 'description']
    date_hierarchy = 'date'
    inlines = [GalleryPhotoInline]
    
    fieldsets = (
        ('Album Information', {
            'fields': ('title', 'description', 'cover_image', 'date')
        }),
        ('Settings', {
            'fields': ('is_featured', 'is_published')
        }),
    )
    
    def cover_preview(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" style="max-height: 50px; max-width: 100px;" />', obj.cover_image.url)
        return "No cover"
    cover_preview.short_description = 'Cover'


@admin.register(GalleryPhoto)
class GalleryPhotoAdmin(admin.ModelAdmin):
    list_display = ['title', 'album', 'photographer', 'date_taken', 'order', 'is_featured', 'image_preview', 'created_at']
    list_filter = ['album', 'is_featured', 'date_taken']
    search_fields = ['title', 'description', 'photographer']
    ordering = ['album', 'order', '-created_at']
    
    fieldsets = (
        ('Photo Information', {
            'fields': ('album', 'title', 'description', 'image', 'image_preview')
        }),
        ('Metadata', {
            'fields': ('photographer', 'date_taken', 'order')
        }),
        ('Settings', {
            'fields': ('is_featured',)
        }),
    )
    
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        if obj.thumbnail:
            return format_html('<img src="{}" style="max-height: 200px; max-width: 300px;" />', obj.thumbnail.url)
        elif obj.image:
            return format_html('<img src="{}" style="max-height: 200px; max-width: 300px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = 'Preview'
