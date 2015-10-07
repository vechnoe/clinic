from django.db import models
from django.db.models.signals import pre_save

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation

from users.exceptions import RoleNotFound

ROLE_NAMES = {
    'patient': 'Пациент',
    'doctor': 'Врач',
}


class UserManager(BaseUserManager):

    def _build_user(self, email, password, **kwargs):
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None):
        return self._build_user(email=email, password=password)

    def create_superuser(self, email, password):
        return self._build_user(email=email, password=password,
                                is_superuser=True, is_active=True)


class Permission(models.Model):
    code_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey(ContentType, related_name='+')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Допуск'
        verbose_name_plural = 'Допуски'


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(
        verbose_name='Имя', max_length=30, blank=True)
    last_name = models.CharField(
        verbose_name='Фамилия', max_length=30, blank=True)
    patronymic = models.CharField(
        verbose_name='Отчество', max_length=30, blank=True)

    role_content_type = models.ForeignKey(ContentType, null=True, blank=True)
    role_object_id = models.PositiveIntegerField(null=True, blank=True)
    role = GenericForeignKey('role_content_type', 'role_object_id')

    is_superuser = models.BooleanField(
        verbose_name='Администратор', default=False)
    is_active = models.BooleanField(default=False)

    permissions = models.ManyToManyField(
        Permission, verbose_name='Права', blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    @property
    def is_staff(self):
        return self.is_superuser

    def get_full_name(self):
        return '%s %s %s' % (self.last_name, self.first_name, self.patronymic)

    def get_short_name(self):
        return self.email

    def get_role(self, role=None, *args, **kwargs):
        if role is None:
            return self.role

        if self.role is None:
            raise RoleNotFound('Role is None')

        if self.role.shortcut != role:
            raise RoleNotFound('%s role not found' % role)

        return self.role

    def has_module_perms(self, app_label):
        if self.is_active and self.is_superuser:
            return True

    def has_perm(self, perm_name):
        if not self.is_active:
            return False

        if self.is_superuser:
            return True

        try:
            app_label, model, code_name = perm_name.split('.')
        except ValueError:
            return False

        return self.permissions.filter(
            content_type__app_label=app_label,
            content_type__model=model,
            code_name=code_name
        ).exists()

    class Meta:
        verbose_name = u'Пользователь'
        verbose_name_plural = u'Пользователи'


class Role(models.Model):
    user = GenericRelation(
        'User',
        content_type_field='role_content_type',
        object_id_field='role_object_id'
    )

    class Meta:
        abstract = True

    @classmethod
    def short_name(cls):
        return ROLE_NAMES[cls.__name__.lower()]

    @property
    def shortcut(self):
        return self.__class__.__name__.lower()

    def get_content_type(self):
        return ContentType.objects.get_for_model(self)


class Patient(Role):
    def __str__(self):
        return 'Пациент: %s' % self.user.first().get_full_name()

    @property
    def full_name(self):
        return self.user.first().get_full_name()

    class Meta:
        verbose_name = 'Пациент'
        verbose_name_plural = 'Пациенты'


class Speciality(models.Model):
    name = models.CharField(
        verbose_name='Название врачебной специализации', max_length=255)

    class Meta:
        verbose_name = 'Специализация'
        verbose_name_plural = 'Специализации'

    def __str__(self):
        return self.name


class Doctor(Role):
    speciality = models.ForeignKey('Speciality', verbose_name='Специализация')
    is_chief_doctor = models.BooleanField(
        default=False, verbose_name='Главврач')

    class Meta:
        verbose_name = 'Врач'
        verbose_name_plural = 'Врачи'

    def __str__(self):
        if not self.is_chief_doctor:
            return 'Врач-%s: %s' % (
                self.speciality.__str__().lower(), self.full_name)
        return 'Главврач: %s' % self.full_name

    @property
    def full_name(self):
        if self.user.exists():
            return self.user.first().get_full_name()
        return ''

    @classmethod
    def get_chief_doctor(cls):
        return cls.objects.filter(is_chief_doctor=True).get()

    @staticmethod
    def pre_save(sender, instance, **kwargs):
        if instance.is_chief_doctor:
            sender.objects.filter(
                is_chief_doctor=True).update(is_chief_doctor=False)

    def get_free_working_hours(self):
        pass

pre_save.connect(sender=Doctor, receiver=Doctor.pre_save)

