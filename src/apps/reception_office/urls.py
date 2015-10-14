from rest_framework import routers
from .views import VisitViewSet

router = routers.SimpleRouter()
router.register(r'visits', VisitViewSet, base_name='visits')

urlpatterns = router.urls