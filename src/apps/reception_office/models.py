from django.db import models

from timetable.models import Timetable, WorkingHour
from users.models import Patient, Doctor


class Visit(models.Model):
    date = models.DateField(
        verbose_name='Дата приема', null=True)
    visit_hour = models.ForeignKey(
        'timetable.WorkingHour', blank=True, verbose_name='Назначенный час')
    patient = models.ForeignKey(
        'users.Patient', blank=True, verbose_name='Пациент')
    doctor = models.ForeignKey(
        'users.Doctor', blank=True,  verbose_name='Врач')

    def __str__(self):
        return self.date_begin.strftime('%d %m %Y %H:%m')

    class Meta:
        verbose_name = 'Прием'
        verbose_name_plural = 'Приемы'

