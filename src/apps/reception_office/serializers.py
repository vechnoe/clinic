from django.db.models import Q

from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from users.models import Doctor, Patient
from timetable.models import WorkingHour
from .models import Visit

from users.serializers import DoctorSerializer, UserPatientSerializer
from timetable.serializers import WorkingHourSerializer


class PatientSerializer(serializers.ModelSerializer):
    user = UserPatientSerializer(many=False, read_only=True)

    class Meta:
        model = Patient
        fields = ('id', 'user')


class VisitSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(many=False, required=False)
    doctor = DoctorSerializer(many=False)
    visit_hour = WorkingHourSerializer(many=False, read_only=False)

    class Meta:
        model = Visit
        fields = ('id', 'date', 'visit_hour', 'patient', 'doctor')
        read_only_fields = ('visit_hour', 'patient', 'doctor')

    def create(self, validated_data):
        data = self.context['request'].data
        user = self.context['request'].user

        print(data)
        print(user)

        if user.role == 'patient':
            date = data.get('date')
            hour = WorkingHour.objects.get(pk=data['visit_hour']['id'])
            doctor = Doctor.objects.get(pk=data['doctor']['id'])
            if not Visit.objects.filter(
                    Q(date=date) &
                    Q(visit_hour=hour) &
                    Q(doctor=doctor)).exists():

                visit = Visit()
                visit.date = date
                visit.visit_hour = hour
                visit.doctor = doctor
                visit.patient = user.patient_set.first()

                visit.save()
                return visit
        raise PermissionDenied('Оnly patients can create visits')











