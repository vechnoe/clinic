angular.module('loginMenuDirective', [
  'authService',
  'ui.bootstrap'
])

.directive('loginMenuDirective',
    function loginMenuDirective($state,
      $location, authService) {
       return {
         restrict: 'E',
         replace: true,
         templateUrl: 'menus/login-menu/login-menu.tpl.html',
         link: function (scope) {
           scope.isLoggedIn = authService.isLoggedIn();
           scope.state = $state;

           scope.login = function(){
               $location.path('/login');
           };

           scope.register = function(){
               $location.path('/registration');
           };

           if (scope.isLoggedIn){
             let user = authService.getUser();
             scope.currentUser = user.username;
             scope.logout = function(){
               authService.logout();
             };
           }

         }
       };
    });
