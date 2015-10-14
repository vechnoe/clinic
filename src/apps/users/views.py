import dateutil.parser

from rest_framework import viewsets, permissions, mixins
from rest_framework.exceptions import NotFound, PermissionDenied

from timetable.models import WorkingHour
from .models import Doctor, Patient, User

from timetable.serializers import WorkingHourSerializer
from reception_office.serializers import VisitSerializer
from .serializers import DoctorSerializer, PatientSerializer


class DoctorViewSet(viewsets.GenericViewSet,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = (permissions.AllowAny,)


class WorkingHourViewSet(viewsets.GenericViewSet,
                         mixins.RetrieveModelMixin,
                         mixins.ListModelMixin):
    serializer_class = WorkingHourSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        doctor = Doctor.objects.filter(pk=self.kwargs['doctor_pk']).first()
        try:
            date = dateutil.parser.parse(self.kwargs['date'])
        except ValueError:
            raise NotFound('Date invalid')

        return doctor.get_available_hours(date)


class DoctorVisitViewSet(viewsets.GenericViewSet,
                         mixins.CreateModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.RetrieveModelMixin,
                         mixins.ListModelMixin):
    serializer_class = VisitSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """
        :return: visits queryset according user.role.
        Patients and doctors can views only own visits.
        """
        doctor = Doctor.objects.filter(pk=self.kwargs['doctor_pk']).first()
        if self.request.user.role == 'doctor':
            if self.request.user.doctor_set.first().id == doctor.id:
                return doctor.visit_set.all()
        if self.request.user.role == 'patient':
            return doctor.visit_set.filter(
                patient=self.request.user.patient_set.first())
        raise PermissionDenied(
            'Only patients and their doctors can views visits')


class PatientViewSet(viewsets.GenericViewSet,
                     mixins.CreateModelMixin):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = (permissions.AllowAny,)







