from django.db import models

from timetable.models import Timetable, WorkingHour
from users.models import Patient, Doctor


class Visit(models.Model):
    date = models.DateField(
        verbose_name='Дата приема', null=True)
    visit_hour = models.ForeignKey(
        'timetable.WorkingHour', blank=True, null=True,
        verbose_name='Назначенный час')
    patient = models.ForeignKey(
        'users.Patient', blank=True, null=True, verbose_name='Пациент')
    doctor = models.ForeignKey(
        'users.Doctor', blank=True, null=True,  verbose_name='Врач')

    def __str__(self):
        return '%s | на время: %s | принимает %s | %s' % (
            self.date.strftime('%d.%m.%Y'),
            self.visit_hour,
            self.doctor,
            self.patient
        )

    class Meta:
        verbose_name = 'Прием'
        verbose_name_plural = 'Приемы'

