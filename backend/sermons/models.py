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


class WeeklyBulletin(models.Model):
    """Weekly Service Bulletin/Order of Worship"""
    title = models.CharField(max_length=200, help_text="e.g., 'Third Sunday in Lent'")
    service_date = models.DateField(help_text="Date of the service")
    is_active = models.BooleanField(default=True, help_text="Set to True for current week's bulletin")
    has_communion = models.BooleanField(default=False, help_text="Check if communion will be served")
    notes = models.TextField(blank=True, help_text="Additional notes or announcements")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-service_date']
        verbose_name = 'Weekly Bulletin'
        verbose_name_plural = 'Weekly Bulletins'
    
    def __str__(self):
        return f"{self.title} - {self.service_date}"


class BibleReading(models.Model):
    """Bible readings for the service"""
    READING_TYPE_CHOICES = [
        ('first', '1st Reading'),
        ('second', '2nd Reading'),
        ('gospel', '3rd Reading (Gospel)'),
        ('akan', 'Akan Reading'),
        ('fante', 'Fante Reading'),
        ('ga', 'Ga Reading'),
    ]
    
    bulletin = models.ForeignKey(WeeklyBulletin, on_delete=models.CASCADE, related_name='readings')
    reading_type = models.CharField(max_length=20, choices=READING_TYPE_CHOICES)
    reader_name = models.CharField(max_length=200)
    reader_photo = models.ImageField(upload_to='readers/', blank=True, null=True, help_text="Upload reader's photo")
    reader_photo_url = models.URLField(blank=True, null=True, help_text="Or provide photo URL")
    scripture_reference = models.CharField(max_length=200, help_text="e.g., 'Genesis 1:1-2'")
    order = models.IntegerField(default=0, help_text="Display order")
    
    class Meta:
        ordering = ['order', 'reading_type']
        verbose_name = 'Bible Reading'
        verbose_name_plural = 'Bible Readings'
    
    def __str__(self):
        return f"{self.get_reading_type_display()} - {self.reader_name}"
    
    @property
    def photo_url(self):
        """Return photo URL, prioritizing uploaded file over URL field"""
        if self.reader_photo:
            return self.reader_photo.url
        return self.reader_photo_url


class ServiceHymn(models.Model):
    """Hymns for the service"""
    HYMN_TYPE_CHOICES = [
        ('opening', 'Opening Hymn'),
        ('communion', 'Communion Hymn'),
        ('closing', 'Closing Hymn'),
        ('recessional', 'Recessional Hymn'),
        ('other', 'Other'),
    ]
    
    bulletin = models.ForeignKey(WeeklyBulletin, on_delete=models.CASCADE, related_name='hymns')
    hymn_type = models.CharField(max_length=20, choices=HYMN_TYPE_CHOICES)
    custom_hymn_type = models.CharField(max_length=100, blank=True, help_text="Custom hymn type (if 'Other' is selected)")
    hymn_number = models.CharField(max_length=50, blank=True, help_text="Hymn number from hymnal")
    hymn_title = models.CharField(max_length=200)
    order = models.IntegerField(default=0, help_text="Display order")
    
    class Meta:
        ordering = ['order', 'hymn_type']
        verbose_name = 'Service Hymn'
        verbose_name_plural = 'Service Hymns'
    
    def __str__(self):
        hymn_type_display = self.custom_hymn_type if self.hymn_type == 'other' and self.custom_hymn_type else self.get_hymn_type_display()
        return f"{hymn_type_display} - {self.hymn_title}"
    
    @property
    def display_type(self):
        """Return custom type if 'other' is selected, otherwise return choice display"""
        if self.hymn_type == 'other' and self.custom_hymn_type:
            return self.custom_hymn_type
        return self.get_hymn_type_display()
