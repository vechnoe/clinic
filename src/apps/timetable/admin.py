from django.contrib import admin
from timetable.models import Timetable, WorkingDay, WorkingHour

admin.site.register(Timetable)
admin.site.register(WorkingDay)
admin.site.register(WorkingHour)