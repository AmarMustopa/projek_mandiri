"""
Script untuk membuat user dummy untuk testing
Jalankan dengan: python manage.py shell < create_users.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User

# Create admin user
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_superuser(
        username='admin',
        email='admin@aquarium.com',
        password='admin123',
        first_name='Admin',
        last_name='System'
    )
    print('✓ Admin user created: admin / admin123')
else:
    print('✗ Admin user already exists')

# Create regular users
users_data = [
    {'username': 'amar', 'email': 'amar@aquarium.com', 'password': 'amar123', 'first_name': 'Amar', 'last_name': 'User'},
    {'username': 'user1', 'email': 'user1@aquarium.com', 'password': 'user123', 'first_name': 'User', 'last_name': 'One'},
    {'username': 'operator', 'email': 'operator@aquarium.com', 'password': 'operator123', 'first_name': 'Operator', 'last_name': 'System'},
]

for user_data in users_data:
    username = user_data['username']
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name']
        )
        print(f'✓ User created: {username} / {user_data["password"]}')
    else:
        print(f'✗ User {username} already exists')

print('\n=== User List ===')
for user in User.objects.all():
    print(f'- {user.username} ({user.email}) - {"Admin" if user.is_superuser else "User"}')
