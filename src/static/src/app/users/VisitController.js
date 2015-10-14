angular.module('VisitController', [
  'ui.router'
])

.controller('VisitController',
    function VisitController($state, $stateParams, dataService) {
      let vm = this;
      dataService.visits.query()
        .$promise.then(function(response) {
          // success
          vm.visits = response;
        }, function(errResponse) {
            // fail
           });
    });
