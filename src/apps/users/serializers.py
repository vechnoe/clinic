from django.contrib.auth import authenticate, login

from rest_framework import serializers, exceptions
from rest_framework.authtoken.models import Token

from .models import User, Doctor, Speciality, Patient


class UserTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'full_name', 'email', 'role')


class AuthTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('key',)


class UserDoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'full_name')


class UserPatientSerializer(serializers.ModelSerializer):
    auth_token = AuthTokenSerializer(many=False, read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name',
            'patronymic', 'email', 'auth_token', 'full_name', 'role')


class SpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = ('id', 'name')


class DoctorSerializer(serializers.ModelSerializer):
    user = UserDoctorSerializer(many=False, read_only=True)
    speciality = SpecialitySerializer(many=False, read_only=True)

    class Meta:
        model = Doctor
        fields = ('id', 'user', 'speciality', 'is_chief_doctor')


class PatientSerializer(serializers.ModelSerializer):
    user = UserPatientSerializer(many=False, read_only=False)

    class Meta:
        model = Patient
        fields = ('id', 'user')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        generated_password = User.objects.make_random_password()
        user_data.update({'password': generated_password})

        user = User.objects.create(**user_data)
        user.set_password(generated_password)
        user.save()

        # authenticate & login after registration
        user = authenticate(
            username=user_data['email'], password=generated_password)
        login(self.context['request'], user)

        patient = Patient()
        patient.user = user
        patient.save()

        return patient


class TokenSerializer(serializers.ModelSerializer):
    user = UserTokenSerializer(many=False, read_only=True)

    class Meta:
        model = Token
        fields = ('key', 'user')
