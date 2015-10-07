from django.db import models
from django.db.models.signals import pre_save


DAYS_OF_WEEK = (
    (0, 'Понедельник'),
    (1, 'Вторник'),
    (2, 'Среда'),
    (3, 'Четверг'),
    (4, 'Пятница'),
    (5, 'Суббота'),
    (6, 'Воскресенье')
)


class Timetable(models.Model):
    working_days = models.ManyToManyField(
        'WorkingDay', verbose_name='Рабочие дни'
    )

    is_default = models.BooleanField(
        default=False, verbose_name='График по умолчанию')

    def __str__(self):
        return '%s–%s' % (
            DAYS_OF_WEEK[self.working_days.first().day_of_week][1],
            DAYS_OF_WEEK[self.working_days.last().day_of_week][1]
        )

    class Meta:
        verbose_name = 'График работы'
        verbose_name_plural = 'Графики работы'

    @classmethod
    def get_default(cls):
        return cls.objects.filter(is_default=True).get()

    @staticmethod
    def pre_save(sender, instance, **kwargs):
        if instance.is_default:
            sender.objects.filter(is_default=True).update(is_default=False)

    def get_working_hours_available(self, date):
        day = self.working_days.filter(day_of_week=date.weekday())
        if day.exists():
            return day.first().working_hours.all()
        return

pre_save.connect(sender=Timetable, receiver=Timetable.pre_save)


class WorkingDay(models.Model):
    day_of_week = models.PositiveSmallIntegerField(
        'День недели', choices=DAYS_OF_WEEK
    )
    working_hours = models.ManyToManyField(
        'WorkingHour', verbose_name='Рабочие часы', blank=True)

    def __str__(self):
        return '%s, %s' % (
            DAYS_OF_WEEK[self.day_of_week][1], ', '.join(
                i.__str__() for i in self.working_hours.all()))

    class Meta:
        verbose_name = 'Рабочий день'
        verbose_name_plural = 'Рабочие дни'
        ordering = ['day_of_week']


class WorkingHour(models.Model):
    begin = models.TimeField(verbose_name='Начало рабочего часа')
    end = models.TimeField(verbose_name='Конец рабочего часа')

    def __str__(self):
        return '%s–%s' % (
            self.begin.strftime("%H:%S"),
            self.end.strftime("%H:%S")
        )

    class Meta:
        verbose_name = 'Рабочий час'
        verbose_name_plural = 'Рабочие часы'


