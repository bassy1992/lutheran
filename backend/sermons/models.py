from django.db import models
from church.models import Pastor


class SermonSeries(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.URLField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = 'Sermon Series'
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title
    
    @property
    def sermon_count(self):
        return self.sermons.count()


class Sermon(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    pastor = models.ForeignKey(Pastor, on_delete=models.SET_NULL, null=True, blank=True, related_name='sermons')
    series = models.ForeignKey(SermonSeries, on_delete=models.SET_NULL, null=True, blank=True, related_name='sermons')
    scripture_reference = models.CharField(max_length=200)
    date_preached = models.DateField()
    audio_file = models.URLField(blank=True, null=True)
    video_url = models.URLField(blank=True)
    thumbnail = models.URLField(blank=True, null=True)
    duration = models.CharField(max_length=20, blank=True, null=True)
    view_count = models.IntegerField(default=0)
    download_count = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date_preached']
    
    def __str__(self):
        return self.title

