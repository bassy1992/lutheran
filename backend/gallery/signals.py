"""
Signal handlers for Gallery app to manage file cleanup
"""
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from .models import GalleryAlbum, GalleryPhoto


@receiver(pre_delete, sender=GalleryAlbum)
def delete_album_cover_image(sender, instance, **kwargs):
    """Delete cover image file when album is deleted"""
    if instance.cover_image:
        instance.cover_image.delete(save=False)


@receiver(pre_delete, sender=GalleryPhoto)
def delete_photo_files(sender, instance, **kwargs):
    """Delete image and thumbnail files when photo is deleted"""
    if instance.image:
        instance.image.delete(save=False)
    if instance.thumbnail:
        instance.thumbnail.delete(save=False)


@receiver(pre_save, sender=GalleryAlbum)
def delete_old_album_cover_on_update(sender, instance, **kwargs):
    """Delete old cover image when a new one is uploaded"""
    if not instance.pk:
        return  # New instance, no old file to delete
    
    try:
        old_instance = GalleryAlbum.objects.get(pk=instance.pk)
    except GalleryAlbum.DoesNotExist:
        return
    
    # If cover image changed, delete the old one
    if old_instance.cover_image and old_instance.cover_image != instance.cover_image:
        old_instance.cover_image.delete(save=False)


@receiver(pre_save, sender=GalleryPhoto)
def delete_old_photo_on_update(sender, instance, **kwargs):
    """Delete old image and thumbnail when new ones are uploaded"""
    if not instance.pk:
        return  # New instance, no old files to delete
    
    try:
        old_instance = GalleryPhoto.objects.get(pk=instance.pk)
    except GalleryPhoto.DoesNotExist:
        return
    
    # If image changed, delete the old one
    if old_instance.image and old_instance.image != instance.image:
        old_instance.image.delete(save=False)
    
    # If thumbnail changed, delete the old one
    if old_instance.thumbnail and old_instance.thumbnail != instance.thumbnail:
        old_instance.thumbnail.delete(save=False)
