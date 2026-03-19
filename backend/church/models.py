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
    logo = models.URLField(blank=True, null=True)
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
    photo = models.URLField(blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    joined_date = models.DateField()
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.get_role_display()}"


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

