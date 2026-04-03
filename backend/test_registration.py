import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from members.models import Ministry, Member, MinistryMembership
from django.contrib.auth.models import User

# Test the registration logic
ministry = Ministry.objects.first()
print(f"Testing registration for ministry: {ministry.name}")
print(f"Current member count: {ministry.member_count}")

# Create test data
test_data = {
    'first_name': 'Jane',
    'last_name': 'Smith',
    'email': 'jane.smith@test.com',
    'phone': '+233987654321',
    'gender': 'female',
    'city': 'Accra'
}

# Check if member exists
member = Member.objects.filter(email=test_data['email']).first()

if member:
    print(f"Member already exists: {member.full_name}")
else:
    # Create user
    username = test_data['email'].split('@')[0]
    user = User.objects.create_user(
        username=username,
        email=test_data['email'],
        first_name=test_data['first_name'],
        last_name=test_data['last_name']
    )
    
    # Create member
    member = Member.objects.create(
        user=user,
        first_name=test_data['first_name'],
        last_name=test_data['last_name'],
        email=test_data['email'],
        phone=test_data['phone'],
        gender=test_data['gender'],
        city=test_data.get('city', ''),
        membership_status='visitor'
    )
    print(f"Created new member: {member.full_name}")

# Create ministry membership
membership, created = MinistryMembership.objects.get_or_create(
    member=member,
    ministry=ministry
)

if created:
    print(f"Successfully registered {member.full_name} to {ministry.name}")
else:
    print(f"{member.full_name} is already registered for {ministry.name}")

print(f"New member count: {ministry.member_count}")
