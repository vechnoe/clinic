import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'src.settings'

from django.test import TestCase

import django
django.setup()

from users.models import User


class AuthTestCase(TestCase):
    def setUp(self):
        self.u = User.objects.create_user(
            'test@site.com',  'pass')
        self.u.is_superuser = False
        self.u.is_active = True
        self.u.save()

    def testLogin(self):
        self.client.login(username='test@site.com', password='pass')