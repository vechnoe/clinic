angular.module('clinic.auth', [
  'authInterceptor',
  'authService',
  'authorizationHandler',
  'LoginController',
  'RegistrationController',
  'ui.router'
])

.config(function config($stateProvider) {

      $stateProvider
      .state('main', {
            url: '/'
          })
      .state('login', {
            url: '/login',
            views: {
              'main': {
                controller: 'LoginController as vm',
                templateUrl: 'auth/login.tpl.html'
              }
            },
            data: {
              access: ['anonimus'],
              title: { simpleTitle: 'Вход'}
            }
          })
       .state('registration', {
            url: '/registration',
            views: {
              'main': {
                controller: 'RegistrationController as vm',
                templateUrl: 'auth/registration.tpl.html'
              }
            },
            data: {
              access: ['anonimus'],
              title: { simpleTitle: 'Регистрация'}
            }
          });
    });