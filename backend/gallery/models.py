from django.db import models
from django.contrib.auth.models import User
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys


class GalleryAlbum(models.Model):
    """Photo albums for organizing gallery images"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='gallery/albums/', blank=True, null=True)
    date = models.DateField()
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def photo_count(self):
        return self.photos.count()


class GalleryPhoto(models.Model):
    """Individual photos in the gallery"""
    album = models.ForeignKey(GalleryAlbum, on_delete=models.CASCADE, related_name='photos')
    title = models.CharField(max_length=200, blank=True, help_text="Optional: Leave blank to auto-generate")
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='gallery/photos/')
    thumbnail = models.ImageField(upload_to='gallery/thumbnails/', blank=True, null=True)
    photographer = models.CharField(max_length=100, blank=True)
    date_taken = models.DateField(null=True, blank=True)
    order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return self.title if self.title else f"Photo {self.id} - {self.album.title}"
    
    def save(self, *args, **kwargs):
        """Auto-generate title and thumbnail on save"""
        # Auto-generate simple title if not provided
        if not self.title:
            self.title = self.album.title
        
        # Auto-generate thumbnail
        if self.image and not self.thumbnail:
            # Open the uploaded image
            img = Image.open(self.image)
            
            # Convert RGBA to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Create thumbnail
            output_size = (400, 300)
            img.thumbnail(output_size, Image.Resampling.LANCZOS)
            
            # Save thumbnail to BytesIO
            thumb_io = BytesIO()
            img.save(thumb_io, format='JPEG', quality=85)
            thumb_io.seek(0)
            
            # Create InMemoryUploadedFile
            thumb_file = InMemoryUploadedFile(
                thumb_io, None, 
                f'thumb_{self.image.name.split("/")[-1]}',
                'image/jpeg', 
                sys.getsizeof(thumb_io), 
                None
            )
            
            self.thumbnail = thumb_file
        
        super().save(*args, **kwargs)
