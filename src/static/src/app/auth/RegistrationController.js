angular.module('RegistrationController', [
  'authService',
  'ui.router'
])

.controller('RegistrationController',
    function RegistrationController(authService) {
      let vm = this;
      vm.register = function register() {
        if (!(vm.email && vm.firstName && vm.lastName && vm.patronymic)){
          return;
        }
        authService.register(
          vm.email, vm.firstName, vm.lastName, vm.patronymic);
      };
    });
