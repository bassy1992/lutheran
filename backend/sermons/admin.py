from django.contrib import admin
from .models import SermonSeries, Sermon, WeeklyBulletin, BibleReading, ServiceHymn


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


class BibleReadingInline(admin.TabularInline):
    model = BibleReading
    extra = 5
    fields = ['reading_type', 'reader_name', 'reader_photo', 'scripture_reference', 'order']


class ServiceHymnInline(admin.TabularInline):
    model = ServiceHymn
    extra = 4
    fields = ['hymn_type', 'hymn_number', 'hymn_title', 'order']


@admin.register(WeeklyBulletin)
class WeeklyBulletinAdmin(admin.ModelAdmin):
    list_display = ['title', 'service_date', 'is_active', 'has_communion', 'created_at']
    list_filter = ['is_active', 'has_communion', 'service_date']
    search_fields = ['title', 'notes']
    date_hierarchy = 'service_date'
    inlines = [BibleReadingInline, ServiceHymnInline]
    
    fieldsets = (
        ('Service Information', {
            'fields': ('title', 'service_date', 'is_active', 'has_communion')
        }),
        ('Additional Notes', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
    )
