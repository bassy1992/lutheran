from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import GalleryAlbum, GalleryPhoto


class GalleryPhotoInline(admin.TabularInline):
    model = GalleryPhoto
    extra = 1
    fields = ['image', 'title', 'photographer', 'order', 'is_featured', 'image_preview']
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
    list_display = ['title', 'date', 'photo_count', 'is_featured', 'is_published', 'cover_preview', 'bulk_upload_link', 'created_at']
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
    
    def bulk_upload_link(self, obj):
        return format_html(
            '<a class="button" href="{}">📤 Bulk Upload Photos</a>',
            f'/admin/gallery/galleryalbum/{obj.pk}/bulk-upload/'
        )
    bulk_upload_link.short_description = 'Actions'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('<int:album_id>/bulk-upload/', self.admin_site.admin_view(self.bulk_upload_view), name='gallery_album_bulk_upload'),
        ]
        return custom_urls + urls
    
    def bulk_upload_view(self, request, album_id):
        album = GalleryAlbum.objects.get(pk=album_id)
        
        if request.method == 'POST':
            files = request.FILES.getlist('photos')
            photographer = request.POST.get('photographer', '')
            
            if not files:
                messages.error(request, 'Please select at least one photo to upload.')
                return redirect(request.path)
            
            # Create photos
            created_count = 0
            for file in files:
                try:
                    GalleryPhoto.objects.create(
                        album=album,
                        image=file,
                        photographer=photographer,
                        date_taken=album.date
                    )
                    created_count += 1
                except Exception as e:
                    messages.error(request, f'Error uploading {file.name}: {str(e)}')
            
            if created_count > 0:
                messages.success(request, f'Successfully uploaded {created_count} photo(s) to {album.title}')
            
            return redirect('admin:gallery_galleryalbum_change', album_id)
        
        context = {
            'album': album,
            'title': f'Bulk Upload Photos to {album.title}',
            'opts': self.model._meta,
            'has_view_permission': self.has_view_permission(request),
        }
        
        return render(request, 'admin/gallery/bulk_upload.html', context)


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
