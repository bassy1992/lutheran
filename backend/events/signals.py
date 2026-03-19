"""
Signal handlers for Events app to manage file cleanup
"""
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from .models import Event


@receiver(pre_delete, sender=Event)
def delete_event_image(sender, instance, **kwargs):
    """Delete event image file when event is deleted"""
    if instance.image:
        instance.image.delete(save=False)


@receiver(pre_save, sender=Event)
def delete_old_event_image_on_update(sender, instance, **kwargs):
    """Delete old event image when a new one is uploaded"""
    if not instance.pk:
        return  # New instance, no old file to delete
    
    try:
        old_instance = Event.objects.get(pk=instance.pk)
    except Event.DoesNotExist:
        return
    
    # If image changed, delete the old one
    if old_instance.image and old_instance.image != instance.image:
        old_instance.image.delete(save=False)
