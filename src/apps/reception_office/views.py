from rest_framework import viewsets, permissions, mixins
from rest_framework.exceptions import PermissionDenied

from timetable.models import WorkingHour
from users.models import Doctor, Patient, User
from .models import Visit

from .serializers import VisitSerializer


class VisitViewSet(viewsets.GenericViewSet,
                   mixins.RetrieveModelMixin,
                   mixins.ListModelMixin):
    serializer_class = VisitSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """
        :return: visits queryset according user.role.
        Patients and doctors can views only own visits.
        """
        user = self.request.user
        if (user.role == 'doctor' and
                user.doctor_set.first().is_chief_doctor):
            return Visit.objects.all()

        if user.role == 'doctor':
            return user.doctor_set.first().visit_set.all()

        if user.role == 'patient':
            return user.patient_set.first().visit_set.all()

        raise PermissionDenied(
            'Only patients and their doctors can views visits')