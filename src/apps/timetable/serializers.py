from rest_framework import serializers
from .models import WorkingHour


class WorkingHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkingHour
        fields = ('id', 'hour')

