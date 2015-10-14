from django.conf.urls import url, include
from rest_framework_nested import routers
from .views import DoctorViewSet, PatientViewSet, \
    WorkingHourViewSet, DoctorVisitViewSet

router = routers.SimpleRouter()

router.register(r'doctors', DoctorViewSet)
router.register(r'patients', PatientViewSet)

doctors_router = routers.NestedSimpleRouter(
    router, r'doctors', lookup='doctor')

doctors_router.register(
    r'hours/(?P<date>\d{4}-\d{2}-\d{2})',
    WorkingHourViewSet, base_name='doctor-hours'
)
doctors_router.register(
    r'visits',
    DoctorVisitViewSet, base_name='doctor-visits'
)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^', include(doctors_router.urls)),
]