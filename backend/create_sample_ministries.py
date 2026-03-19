"""
Create sample ministries
Run with: python manage.py shell < create_sample_ministries.py
"""
from members.models import Ministry

# Clear existing ministries
Ministry.objects.all().delete()

# Create sample ministries
ministries_data = [
    {
        'name': 'Worship & Music Ministry',
        'description': 'Lead the congregation in worship through music, singing, and instrumental performances. We practice weekly and perform during Sunday services and special events.',
        'image': 'https://picsum.photos/seed/worship/600/400',
        'is_active': True,
    },
    {
        'name': 'Youth Ministry',
        'description': 'Engaging young people ages 13-25 in faith formation, fellowship, and service. We meet weekly for Bible study, games, and community outreach projects.',
        'image': 'https://picsum.photos/seed/youth/600/400',
        'is_active': True,
    },
    {
        'name': 'Children\'s Ministry',
        'description': 'Teaching children about God\'s love through Sunday School, Vacation Bible School, and special programs. We create a safe, fun environment for kids to grow in faith.',
        'image': 'https://picsum.photos/seed/children/600/400',
        'is_active': True,
    },
    {
        'name': 'Outreach & Missions',
        'description': 'Serving our community and beyond through food drives, homeless ministry, prison ministry, and international mission trips. Making a difference in Jesus\' name.',
        'image': 'https://picsum.photos/seed/outreach/600/400',
        'is_active': True,
    },
    {
        'name': 'Prayer Ministry',
        'description': 'Interceding for the needs of our church family and community. We meet weekly for prayer meetings and maintain a 24/7 prayer chain for urgent requests.',
        'image': 'https://picsum.photos/seed/prayer/600/400',
        'is_active': True,
    },
    {
        'name': 'Hospitality Ministry',
        'description': 'Welcoming visitors and members with warmth and care. We coordinate greeters, ushers, coffee hour, and special event hospitality.',
        'image': 'https://picsum.photos/seed/hospitality/600/400',
        'is_active': True,
    },
    {
        'name': 'Men\'s Ministry',
        'description': 'Building brotherhood and discipleship among men through Bible studies, accountability groups, service projects, and fellowship events.',
        'image': 'https://picsum.photos/seed/mens/600/400',
        'is_active': True,
    },
    {
        'name': 'Women\'s Ministry',
        'description': 'Empowering women to grow in faith and friendship through Bible studies, retreats, mentoring, and service opportunities.',
        'image': 'https://picsum.photos/seed/womens/600/400',
        'is_active': True,
    },
    {
        'name': 'Media & Technology',
        'description': 'Managing audio/visual equipment, live streaming, website, and social media to extend our ministry reach and enhance worship experiences.',
        'image': 'https://picsum.photos/seed/media/600/400',
        'is_active': True,
    },
    {
        'name': 'Small Groups Ministry',
        'description': 'Facilitating home-based Bible studies and fellowship groups throughout the week. Building deeper relationships and spiritual growth in intimate settings.',
        'image': 'https://picsum.photos/seed/smallgroups/600/400',
        'is_active': True,
    },
    {
        'name': 'Counseling & Care',
        'description': 'Providing pastoral care, grief support, marriage counseling, and crisis intervention. Walking alongside members during life\'s challenges.',
        'image': 'https://picsum.photos/seed/counseling/600/400',
        'is_active': True,
    },
    {
        'name': 'Evangelism & Discipleship',
        'description': 'Equipping believers to share their faith and make disciples. Training in evangelism methods, apologetics, and spiritual mentoring.',
        'image': 'https://picsum.photos/seed/evangelism/600/400',
        'is_active': True,
    },
]

for ministry_data in ministries_data:
    ministry = Ministry.objects.create(**ministry_data)
    print(f"Created ministry: {ministry.name}")

print(f"\nTotal ministries created: {Ministry.objects.count()}")
