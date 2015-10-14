from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^api/', include('users.urls')),
    url(r'^api/', include('reception_office.urls')),

    url(r'^api/admin/', include(admin.site.urls)),
    url(r'^api-token-auth/',
        'rest_framework.authtoken.views.obtain_auth_token'),
    url(r'^api/api-auth/', include(
        'rest_framework.urls', namespace='rest_framework')),
    url(r'^api/rest-auth/', include('rest_auth.urls')),
    url(r'^$', TemplateView.as_view(template_name='index.html')),
]
