from django.contrib import admin
from .models import Member, Ministry, MinistryMembership, MinistryInterest


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'membership_status', 'joined_date', 'is_active']
    list_filter = ['membership_status', 'gender', 'is_active', 'joined_date']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    date_hierarchy = 'joined_date'


@admin.register(Ministry)
class MinistryAdmin(admin.ModelAdmin):
    list_display = ['name', 'leader', 'member_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    date_hierarchy = 'created_at'


@admin.register(MinistryMembership)
class MinistryMembershipAdmin(admin.ModelAdmin):
    list_display = ['member', 'ministry', 'role', 'joined_date', 'is_active']
    list_filter = ['ministry', 'is_active', 'joined_date']
    search_fields = ['member__first_name', 'member__last_name', 'ministry__name']
    date_hierarchy = 'joined_date'


@admin.register(MinistryInterest)
class MinistryInterestAdmin(admin.ModelAdmin):
    list_display = ['member', 'ministry', 'expressed_at', 'contacted']
    list_filter = ['ministry', 'contacted', 'expressed_at']
    search_fields = ['member__first_name', 'member__last_name', 'ministry__name']
    date_hierarchy = 'expressed_at'
