"""
Signal handlers for Sermons app to manage file cleanup
"""
from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from .models import BibleReading, SermonSeries, Sermon


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


@receiver(pre_delete, sender=SermonSeries)
def delete_series_image(sender, instance, **kwargs):
    """Delete series image file when series is deleted"""
    if instance.image:
        instance.image.delete(save=False)


@receiver(pre_save, sender=SermonSeries)
def delete_old_series_image_on_update(sender, instance, **kwargs):
    """Delete old series image when a new one is uploaded"""
    if not instance.pk:
        return
    
    try:
        old_instance = SermonSeries.objects.get(pk=instance.pk)
    except SermonSeries.DoesNotExist:
        return
    
    if old_instance.image and old_instance.image != instance.image:
        old_instance.image.delete(save=False)


@receiver(pre_delete, sender=Sermon)
def delete_sermon_thumbnail(sender, instance, **kwargs):
    """Delete sermon thumbnail file when sermon is deleted"""
    if instance.thumbnail:
        instance.thumbnail.delete(save=False)


@receiver(pre_save, sender=Sermon)
def delete_old_sermon_thumbnail_on_update(sender, instance, **kwargs):
    """Delete old sermon thumbnail when a new one is uploaded"""
    if not instance.pk:
        return
    
    try:
        old_instance = Sermon.objects.get(pk=instance.pk)
    except Sermon.DoesNotExist:
        return
    
    if old_instance.thumbnail and old_instance.thumbnail != instance.thumbnail:
        old_instance.thumbnail.delete(save=False)
