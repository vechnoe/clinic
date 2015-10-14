angular.module('visitsLinkDirective', [
  'authService'
])

.directive('visitsLinkDirective',
    function visitsLinkDirective(authService) {
       return {
         restrict: 'E',
         replace: true,
         templateUrl: 'menus/visits-link/visits-link.tpl.html',
         link: function (scope) {
           scope.isLoggedIn = authService.isLoggedIn();
         }
       };
    });
