from django.contrib import admin
from .models import Timetable, WorkingDay, WorkingHour

admin.site.register(Timetable)
admin.site.register(WorkingDay)
admin.site.register(WorkingHour)