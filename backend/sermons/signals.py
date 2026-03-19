"""
Signal handlers for Sermons app to manage file cleanup
"""
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from .models import BibleReading


@receiver(pre_delete, sender=BibleReading)
def delete_reader_photo(sender, instance, **kwargs):
    """Delete reader photo file when reading is deleted"""
    if instance.reader_photo:
        instance.reader_photo.delete(save=False)


@receiver(pre_save, sender=BibleReading)
def delete_old_reader_photo_on_update(sender, instance, **kwargs):
    """Delete old reader photo when a new one is uploaded"""
    if not instance.pk:
        return  # New instance, no old file to delete
    
    try:
        old_instance = BibleReading.objects.get(pk=instance.pk)
    except BibleReading.DoesNotExist:
        return
    
    # If photo changed, delete the old one
    if old_instance.reader_photo and old_instance.reader_photo != instance.reader_photo:
        old_instance.reader_photo.delete(save=False)
