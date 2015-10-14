angular.module('clinic', [
  'angularMoment',
  'angular-loading-bar',
  'clinic.auth',
  'clinic.users',
  'clinic.menus',
  'clinic.utils',
  'config',
  'LocalStorageModule',
  'templates-app',
  'templates-common',
  'ui-notification',
  'ui.router'
])

.config(
  function ($urlMatcherFactoryProvider, $urlRouterProvider,
              $httpProvider, $resourceProvider, $stateProvider,
              NotificationProvider, localStorageServiceProvider) {
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise('/');
    $resourceProvider.defaults.stripTrailingSlashes = false;

    NotificationProvider.setOptions({
      delay: 10000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'left',
      positionY: 'bottom'
    });

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.interceptors.push('authInterceptor');

    //localStorageServiceProvider.setStorageType('sessionStorage');
    localStorageServiceProvider.setPrefix('clinic');
  })

.run(
  function ($location, $state, $stateParams,
            moment, amMoment, authService, authorizationHandler) {
    amMoment.changeLocale('ru');
    authorizationHandler.check();
  })

.controller('AppController',
  function AppController($scope, $location, $stateParams,
                           moment, pageTitleService) {

    $scope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
        $scope.pageTitle = pageTitleService.getTitle();
      });
});

