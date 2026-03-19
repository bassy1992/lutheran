from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render, redirect
from django.contrib import messages
from django import forms
from .models import GalleryAlbum, GalleryPhoto


class MultipleFileInput(forms.FileInput):
    """Custom widget that supports multiple file uploads"""
    def __init__(self, attrs=None):
        super().__init__(attrs)
        
    def render(self, name, value, attrs=None, renderer=None):
        if attrs is None:
            attrs = {}
        attrs['multiple'] = 'multiple'
        return super().render(name, value, attrs, renderer)


class BulkPhotoUploadForm(forms.Form):
    """Form for creating album and uploading multiple photos at once"""
    # Album fields
    title = forms.CharField(max_length=200, widget=forms.TextInput(attrs={'size': '60'}))
    description = forms.CharField(widget=forms.Textarea(attrs={'rows': 3, 'cols': 60}), required=False)
    date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    cover_image = forms.ImageField(required=False, help_text="Optional: Album cover image")
    is_featured = forms.BooleanField(required=False, initial=False)
    is_published = forms.BooleanField(required=False, initial=True)
    
    # Photo fields
    photos = forms.FileField(
        widget=MultipleFileInput(),
        required=False,
        help_text="Select multiple photos to upload"
    )
    photographer = forms.CharField(max_length=100, required=False, help_text="Optional: Photographer name for all photos")


class GalleryPhotoInline(admin.TabularInline):
    model = GalleryPhoto
    extra = 0
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
            '<a class="button" href="{}">📤 Add More Photos</a>',
            f'/admin/gallery/galleryalbum/{obj.pk}/bulk-upload/'
        )
    bulk_upload_link.short_description = 'Actions'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('create-with-photos/', self.admin_site.admin_view(self.create_with_photos_view), name='gallery_create_with_photos'),
            path('<int:album_id>/bulk-upload/', self.admin_site.admin_view(self.bulk_upload_view), name='gallery_album_bulk_upload'),
        ]
        return custom_urls + urls
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['create_with_photos_url'] = 'create-with-photos/'
        return super().changelist_view(request, extra_context)
    
    def create_with_photos_view(self, request):
        """View to create album and upload photos in one step"""
        if request.method == 'POST':
            form = BulkPhotoUploadForm(request.POST, request.FILES)
            
            if form.is_valid():
                # Create the album
                album = GalleryAlbum.objects.create(
                    title=form.cleaned_data['title'],
                    description=form.cleaned_data['description'],
                    date=form.cleaned_data['date'],
                    cover_image=form.cleaned_data.get('cover_image'),
                    is_featured=form.cleaned_data['is_featured'],
                    is_published=form.cleaned_data['is_published']
                )
                
                # Upload photos
                files = request.FILES.getlist('photos')
                photographer = form.cleaned_data.get('photographer', '')
                
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
                    messages.success(request, f'✓ Created album "{album.title}" with {created_count} photo(s)')
                else:
                    messages.success(request, f'✓ Created album "{album.title}"')
                
                return redirect('admin:gallery_galleryalbum_changelist')
        else:
            form = BulkPhotoUploadForm()
        
        context = {
            'form': form,
            'title': 'Create Album with Photos',
            'opts': self.model._meta,
            'has_view_permission': self.has_view_permission(request),
        }
        
        return render(request, 'admin/gallery/create_with_photos.html', context)
    
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
            'title': f'Add Photos to {album.title}',
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
