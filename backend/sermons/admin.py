from django.contrib import admin
from .models import SermonSeries, Sermon


@admin.register(SermonSeries)
class SermonSeriesAdmin(admin.ModelAdmin):
    list_display = ['title', 'start_date', 'end_date', 'sermon_count', 'is_active']
    list_filter = ['is_active', 'start_date']
    search_fields = ['title', 'description']
    date_hierarchy = 'start_date'


@admin.register(Sermon)
class SermonAdmin(admin.ModelAdmin):
    list_display = ['title', 'pastor', 'series', 'date_preached', 'view_count', 'is_featured', 'is_published']
    list_filter = ['is_featured', 'is_published', 'pastor', 'series', 'date_preached']
    search_fields = ['title', 'scripture_reference', 'description']
    date_hierarchy = 'date_preached'
    ordering = ['-date_preached']
