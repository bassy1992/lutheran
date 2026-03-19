"""
Signal handlers for Members app to manage file cleanup
"""
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from .models import Member, Ministry


@receiver(pre_delete, sender=Member)
def delete_member_photo(sender, instance, **kwargs):
    """Delete member photo file when member is deleted"""
    if instance.photo:
        instance.photo.delete(save=False)


@receiver(pre_save, sender=Member)
def delete_old_member_photo_on_update(sender, instance, **kwargs):
    """Delete old member photo when a new one is uploaded"""
    if not instance.pk:
        return
    
    try:
        old_instance = Member.objects.get(pk=instance.pk)
    except Member.DoesNotExist:
        return
    
    if old_instance.photo and old_instance.photo != instance.photo:
        old_instance.photo.delete(save=False)


@receiver(pre_delete, sender=Ministry)
def delete_ministry_image(sender, instance, **kwargs):
    """Delete ministry image file when ministry is deleted"""
    if instance.image:
        instance.image.delete(save=False)


@receiver(pre_save, sender=Ministry)
def delete_old_ministry_image_on_update(sender, instance, **kwargs):
    """Delete old ministry image when a new one is uploaded"""
    if not instance.pk:
        return
    
    try:
        old_instance = Ministry.objects.get(pk=instance.pk)
    except Ministry.DoesNotExist:
        return
    
    if old_instance.image and old_instance.image != instance.image:
        old_instance.image.delete(save=False)
