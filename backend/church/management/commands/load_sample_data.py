from django.core.management.base import BaseCommand
import os
import sys

class Command(BaseCommand):
    help = 'Load all sample data into the database'

    def handle(self, *args, **options):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
        
        scripts = [
            'create_church_info.py',
            'create_sample_service_times.py',
            'create_sample_core_values.py',
            'create_sample_events.py',
            'create_sample_sermons.py',
            'create_sample_ministries.py',
            'create_sample_donation_categories.py',
            'create_sample_gallery.py',
        ]
        
        for script in scripts:
            script_path = os.path.join(base_dir, script)
            if os.path.exists(script_path):
                self.stdout.write(f'Loading {script}...')
                with open(script_path, 'r') as f:
                    exec(f.read())
                self.stdout.write(self.style.SUCCESS(f'✓ {script} loaded'))
            else:
                self.stdout.write(self.style.WARNING(f'✗ {script} not found'))
        
        self.stdout.write(self.style.SUCCESS('\n✅ All sample data loaded successfully!'))
