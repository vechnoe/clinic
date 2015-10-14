angular.module('receptionButtonDirective', [
  'authService',
  'ui.bootstrap'
])

.directive('receptionButtonDirective',
    function receptionButtonDirective($state,
      $location, authService) {
       return {
         restrict: 'E',
         replace: true,
         templateUrl: 'menus/reception-button/reception-button.tpl.html',
         link: function (scope) {
           let user = authService.getUser();
           scope.isPatient = user.role === 'patient' &&
             authService.isLoggedIn();
         }
       };
    });
