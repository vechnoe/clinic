from django.contrib import admin
from .models import User, Patient, Speciality, Doctor

admin.site.register(User)
admin.site.register(Patient)
admin.site.register(Speciality)
admin.site.register(Doctor)

