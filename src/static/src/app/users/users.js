angular.module('clinic.users', [
  'VisitController',
  'patients',
  'ui.router'
])

.config(function config($stateProvider) {
  $stateProvider
      .state('reception', {
            url: '/reception',
            views: {
              'main': {
                controller: 'ReceptionController as vm',
                templateUrl: 'users/patients/reception.tpl.html'
              }
            },
            data: {
              access: ['patient'],
              title: { simpleTitle: 'Запись на прием'}
            }
          })
          .state('visits', {
            url: '/visits',
            views: {
              'main': {
                controller: 'VisitController as vm',
                templateUrl: 'users/visits.tpl.html'
              }
            },
            data: {
              access: ['patient', 'doctor'],
              title: { simpleTitle: 'Назначенные приемы'}
            }
          });
    });
