from django.contrib import admin
from .models import DonationCategory, Donation


@admin.register(DonationCategory)
class DonationCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ['donor_name', 'amount', 'currency', 'category', 'payment_method', 'status', 'donated_at']
    list_filter = ['status', 'payment_method', 'category', 'is_anonymous', 'donated_at']
    search_fields = ['donor_name', 'donor_email', 'transaction_id']
    readonly_fields = ['donated_at', 'updated_at']
    date_hierarchy = 'donated_at'
    
    fieldsets = (
        ('Donor Information', {
            'fields': ('member', 'donor_name', 'donor_email', 'donor_phone', 'is_anonymous')
        }),
        ('Donation Details', {
            'fields': ('category', 'amount', 'currency', 'notes')
        }),
        ('Payment Information', {
            'fields': ('payment_method', 'transaction_id', 'status')
        }),
        ('Timestamps', {
            'fields': ('donated_at', 'updated_at')
        }),
    )
