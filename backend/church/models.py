from django.db import models


class ChurchInfo(models.Model):
    name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)
    founded_year = models.IntegerField(null=True, blank=True)
    logo = models.ImageField(upload_to='church/', blank=True, null=True, help_text="Upload church logo")
    logo_url = models.URLField(blank=True, null=True, help_text="Or provide logo URL")
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Church Information'
        verbose_name_plural = 'Church Information'
        ordering = ['-id']
    
    def __str__(self):
        return self.name
    
    @property
    def logo_display_url(self):
        """Return logo URL, prioritizing uploaded file over URL field"""
        if self.logo:
            return self.logo.url
        return self.logo_url


class Pastor(models.Model):
    ROLE_CHOICES = [
        ('head', 'Head Pastor'),
        ('associate', 'Associate Pastor'),
        ('youth', 'Youth Pastor'),
        ('worship', 'Worship Pastor'),
    ]
    
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    bio = models.TextField()
    photo = models.ImageField(upload_to='pastors/', blank=True, null=True, help_text="Upload pastor photo")
    photo_url = models.URLField(blank=True, null=True, help_text="Or provide photo URL")
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    joined_date = models.DateField()
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.get_role_display()}"
    
    @property
    def photo_display_url(self):
        """Return photo URL, prioritizing uploaded file over URL field"""
        if self.photo:
            return self.photo.url
        return self.photo_url


class ServiceTime(models.Model):
    day = models.CharField(max_length=50)
    time = models.TimeField()
    description = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'day']
    
    def __str__(self):
        return f"{self.day} - {self.time}"


class CoreValue(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'title']
    
    def __str__(self):
        return self.title

