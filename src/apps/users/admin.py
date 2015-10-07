from django.contrib import admin
from users.models import Permission, User, Patient, Speciality, Doctor

admin.site.register(User)
admin.site.register(Patient)
admin.site.register(Speciality)
admin.site.register(Doctor)
admin.site.register(Permission)
