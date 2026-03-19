"""
Create sample core values
Run with: python manage.py shell < create_sample_core_values.py
"""
from church.models import CoreValue

# Clear existing core values
CoreValue.objects.all().delete()

# Create core values
core_values_data = [
    {
        'title': 'Pure Word',
        'description': 'Preaching the undiluted truth of the Bible.',
        'icon': 'BookOpen',
        'order': 1,
    },
    {
        'title': 'Genuine Fellowship',
        'description': 'A family where everyone belongs.',
        'icon': 'Heart',
        'order': 2,
    },
    {
        'title': 'Community Impact',
        'description': 'Active missions serving the needy in Ghana.',
        'icon': 'Users',
        'order': 3,
    },
    {
        'title': 'Spiritual Growth',
        'description': 'Mentorship for all stages of life.',
        'icon': 'Zap',
        'order': 4,
    },
]

for value_data in core_values_data:
    value = CoreValue.objects.create(**value_data)
    print(f"Created core value: {value.title}")

print(f"\nTotal core values created: {CoreValue.objects.count()}")
