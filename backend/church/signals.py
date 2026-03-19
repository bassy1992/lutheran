"""
Signal handlers for Church app to manage file cleanup
"""
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from .models import ChurchInfo, Pastor


@receiver(pre_delete, sender=ChurchInfo)
def delete_church_logo(sender, instance, **kwargs):
    """Delete church logo file when church info is deleted"""
    if instance.logo:
        instance.logo.delete(save=False)


@receiver(pre_save, sender=ChurchInfo)
def delete_old_church_logo_on_update(sender, instance, **kwargs):
    """Delete old church logo when a new one is uploaded"""
    if not instance.pk:
        return
    
    try:
        old_instance = ChurchInfo.objects.get(pk=instance.pk)
    except ChurchInfo.DoesNotExist:
        return
    
    if old_instance.logo and old_instance.logo != instance.logo:
        old_instance.logo.delete(save=False)


@receiver(pre_delete, sender=Pastor)
def delete_pastor_photo(sender, instance, **kwargs):
    """Delete pastor photo file when pastor is deleted"""
    if instance.photo:
        instance.photo.delete(save=False)


@receiver(pre_save, sender=Pastor)
def delete_old_pastor_photo_on_update(sender, instance, **kwargs):
    """Delete old pastor photo when a new one is uploaded"""
    if not instance.pk:
        return
    
    try:
        old_instance = Pastor.objects.get(pk=instance.pk)
    except Pastor.DoesNotExist:
        return
    
    if old_instance.photo and old_instance.photo != instance.photo:
        old_instance.photo.delete(save=False)
