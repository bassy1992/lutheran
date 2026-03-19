from django.db import models
from django.core.validators import MinValueValidator

class Event(models.Model):
    EVENT_TYPES = [
        ('service', 'Service'),
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('retreat', 'Retreat'),
        ('outreach', 'Outreach'),
        ('social', 'Social'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='other')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=200)
    address = models.TextField()
    image = models.ImageField(upload_to='events/', blank=True, null=True, help_text="Upload event image")
    image_url = models.URLField(blank=True, null=True, help_text="Or provide image URL")
    max_attendees = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    registration_required = models.BooleanField(default=False)
    registration_deadline = models.DateTimeField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title
    
    @property
    def image_display_url(self):
        """Return image URL, prioritizing uploaded file over URL field"""
        if self.image:
            return self.image.url
        return self.image_url
    
    @property
    def attendee_count(self):
        return self.registrations.filter(status='confirmed').aggregate(
            total=models.Sum('number_of_attendees')
        )['total'] or 0
    
    @property
    def is_full(self):
        if self.max_attendees:
            return self.attendee_count >= self.max_attendees
        return False


class EventRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    number_of_attendees = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    notes = models.TextField(blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-registered_at']
    
    def __str__(self):
        return f"{self.name} - {self.event.title}"
