"""
Create sample pastors, sermon series, and sermons
Run with: python manage.py shell < create_sample_sermons.py
"""
from church.models import Pastor
from sermons.models import SermonSeries, Sermon
from datetime import date, timedelta

# Clear existing data
Sermon.objects.all().delete()
SermonSeries.objects.all().delete()
Pastor.objects.all().delete()

# Create pastors
pastors_data = [
    {
        'name': 'Rev. Dr. Emmanuel Mensah',
        'role': 'head',
        'bio': 'Senior Pastor with over 20 years of ministry experience. Passionate about teaching God\'s Word and building strong communities of faith.',
        'photo': 'https://picsum.photos/seed/pastor1/400/400',
        'email': 'emmanuel.mensah@trinitylutheran.org',
        'phone': '+233 24 111 1111',
        'joined_date': date(2010, 1, 15),
        'is_active': True,
        'order': 1,
    },
    {
        'name': 'Pastor Grace Osei',
        'role': 'associate',
        'bio': 'Associate Pastor focusing on women\'s ministry and pastoral care. Dedicated to helping people grow in their relationship with Christ.',
        'photo': 'https://picsum.photos/seed/pastor2/400/400',
        'email': 'grace.osei@trinitylutheran.org',
        'phone': '+233 24 222 2222',
        'joined_date': date(2015, 6, 1),
        'is_active': True,
        'order': 2,
    },
    {
        'name': 'Pastor Michael Boateng',
        'role': 'youth',
        'bio': 'Youth Pastor with a heart for the next generation. Leading young people to discover their purpose in Christ.',
        'photo': 'https://picsum.photos/seed/pastor3/400/400',
        'email': 'michael.boateng@trinitylutheran.org',
        'phone': '+233 24 333 3333',
        'joined_date': date(2018, 9, 1),
        'is_active': True,
        'order': 3,
    },
]

pastors = []
for pastor_data in pastors_data:
    pastor = Pastor.objects.create(**pastor_data)
    pastors.append(pastor)
    print(f"Created pastor: {pastor.name}")

# Create sermon series
series_data = [
    {
        'title': 'Faith in Action',
        'description': 'A powerful series exploring how our faith should transform our daily lives and impact our communities.',
        'image': 'https://picsum.photos/seed/series1/800/400',
        'start_date': date.today() - timedelta(days=90),
        'end_date': date.today() - timedelta(days=30),
        'is_active': False,
    },
    {
        'title': 'The Gospel of John',
        'description': 'Journey through the Gospel of John, discovering the life and teachings of Jesus Christ.',
        'image': 'https://picsum.photos/seed/series2/800/400',
        'start_date': date.today() - timedelta(days=28),
        'end_date': None,
        'is_active': True,
    },
    {
        'title': 'Living with Purpose',
        'description': 'Discover God\'s purpose for your life and learn to live with intentionality and meaning.',
        'image': 'https://picsum.photos/seed/series3/800/400',
        'start_date': date.today() - timedelta(days=120),
        'end_date': date.today() - timedelta(days=91),
        'is_active': False,
    },
]

series_list = []
for series_item in series_data:
    series_obj = SermonSeries.objects.create(**series_item)
    series_list.append(series_obj)
    print(f"Created series: {series_obj.title}")

# Create sermons
sermons_data = [
    {
        'title': 'The Light of the World',
        'description': 'Jesus declares Himself as the light of the world. What does this mean for us today?',
        'pastor': pastors[0],
        'series': series_list[1],
        'scripture_reference': 'John 8:12',
        'date_preached': date.today() - timedelta(days=7),
        'video_url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail': 'https://picsum.photos/seed/sermon1/800/450',
        'duration': '45:30',
        'is_featured': True,
        'is_published': True,
    },
    {
        'title': 'Faith That Moves Mountains',
        'description': 'Understanding the power of faith and how it can transform impossible situations.',
        'pastor': pastors[0],
        'series': series_list[0],
        'scripture_reference': 'Matthew 17:20',
        'date_preached': date.today() - timedelta(days=14),
        'video_url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail': 'https://picsum.photos/seed/sermon2/800/450',
        'duration': '42:15',
        'is_featured': True,
        'is_published': True,
    },
    {
        'title': 'The Good Shepherd',
        'description': 'Jesus as our Good Shepherd who knows us, leads us, and protects us.',
        'pastor': pastors[1],
        'series': series_list[1],
        'scripture_reference': 'John 10:11-18',
        'date_preached': date.today() - timedelta(days=21),
        'video_url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail': 'https://picsum.photos/seed/sermon3/800/450',
        'duration': '38:45',
        'is_featured': False,
        'is_published': True,
    },
    {
        'title': 'Living with Eternal Purpose',
        'description': 'How to align our daily lives with God\'s eternal purposes.',
        'pastor': pastors[0],
        'series': series_list[2],
        'scripture_reference': 'Ephesians 2:10',
        'date_preached': date.today() - timedelta(days=28),
        'video_url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail': 'https://picsum.photos/seed/sermon4/800/450',
        'duration': '40:20',
        'is_featured': False,
        'is_published': True,
    },
    {
        'title': 'The Bread of Life',
        'description': 'Jesus satisfies our deepest spiritual hunger and gives us eternal life.',
        'pastor': pastors[2],
        'series': series_list[1],
        'scripture_reference': 'John 6:35',
        'date_preached': date.today() - timedelta(days=35),
        'video_url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail': 'https://picsum.photos/seed/sermon5/800/450',
        'duration': '36:50',
        'is_featured': False,
        'is_published': True,
    },
    {
        'title': 'Love in Action',
        'description': 'Practical ways to demonstrate God\'s love in our daily interactions.',
        'pastor': pastors[1],
        'series': series_list[0],
        'scripture_reference': '1 John 3:18',
        'date_preached': date.today() - timedelta(days=42),
        'video_url': 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail': 'https://picsum.photos/seed/sermon6/800/450',
        'duration': '44:10',
        'is_featured': False,
        'is_published': True,
    },
]

for sermon_data in sermons_data:
    sermon = Sermon.objects.create(**sermon_data)
    print(f"Created sermon: {sermon.title}")

print(f"\nTotal created:")
print(f"Pastors: {Pastor.objects.count()}")
print(f"Series: {SermonSeries.objects.count()}")
print(f"Sermons: {Sermon.objects.count()}")
