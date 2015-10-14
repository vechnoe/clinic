angular.module('LoginController', [
  'authService',
  'ui.router'
])

.controller('LoginController',
    function LoginController(authService) {
     let vm = this;
      vm.login = function login() {
        if (!(vm.username && vm.password)) {
          return;
        }
          authService.login(vm.username, vm.password);
      };
    });
