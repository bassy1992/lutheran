from django.db import models
from django.contrib.auth.models import User


class Member(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    MEMBERSHIP_STATUS = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('visitor', 'Visitor'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member_profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='Ghana')
    photo = models.ImageField(upload_to='members/', blank=True, null=True, help_text="Upload member photo")
    photo_url = models.URLField(blank=True, null=True, help_text="Or provide photo URL")
    membership_status = models.CharField(max_length=20, choices=MEMBERSHIP_STATUS, default='visitor')
    joined_date = models.DateField(auto_now_add=True)
    baptism_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return self.full_name
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def photo_display_url(self):
        """Return photo URL, prioritizing uploaded file over URL field"""
        if self.photo:
            return self.photo.url
        return self.photo_url


class Ministry(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    leader = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_ministries')
    image = models.ImageField(upload_to='ministries/', blank=True, null=True, help_text="Upload ministry image")
    image_url = models.URLField(blank=True, null=True, help_text="Or provide image URL")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Ministries'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def member_count(self):
        return self.members.count()
    
    @property
    def image_display_url(self):
        """Return image URL, prioritizing uploaded file over URL field"""
        if self.image:
            return self.image.url
        return self.image_url


class MinistryMembership(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='ministry_memberships')
    ministry = models.ForeignKey(Ministry, on_delete=models.CASCADE, related_name='members')
    joined_date = models.DateField(auto_now_add=True)
    role = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['member', 'ministry']
        ordering = ['-joined_date']
    
    def __str__(self):
        return f"{self.member.full_name} - {self.ministry.name}"


class MinistryInterest(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='ministry_interests')
    ministry = models.ForeignKey(Ministry, on_delete=models.CASCADE, related_name='interested_members')
    expressed_at = models.DateTimeField(auto_now_add=True)
    contacted = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['member', 'ministry']
        ordering = ['-expressed_at']
    
    def __str__(self):
        return f"{self.member.full_name} interested in {self.ministry.name}"
