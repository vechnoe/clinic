angular.module('authorizationHandler', [
  'authService'
])

.service('authorizationHandler',
    function authorizationHandler(
      $rootScope, $location, $state, authService) {
      this.check = function() {
        $rootScope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState, fromParams){
            if (!authService.isAuthorize(toState)) {
                event.preventDefault();
              if (fromState.url === '^') {
                if (authService.isLoggedIn()) {
                  authService.setDefaultRout();
                } else {
                    $state.go('registration');
                }
              }
            }
        });
      };

});
