angular.module('ReceptionController', [
  'authService',
  'ui.router'
])

.controller('ReceptionController',
    function ReceptionController($scope,
      $location, moment, Notification,
      notifyingService, dataService) {
      let vm = this;

      // Initial
      dataService.doctors.query()
        .$promise.then(function(response) {
          // success
          vm.doctors = response;
        }, function(errResponse) {
            // fail
           });

      // Listening date changing
      notifyingService.subscribe($scope, function(event, date) {
        let visitDate = date.format('YYYY-MM-DD');
        vm.doctorChange = function(doctorId) {
          dataService.hours.query({
            id: doctorId,
            date: visitDate
          })
            .$promise.then(function(response) {
              // success
              vm.hours = response;
            }, function(errResponse) {
                // fail
              });
        };
         vm.send = function () {
           if (!(visitDate && vm.hourItem && vm.doctorItem)) {
             return;
           }
           dataService.visitsByDoctor.save({doctorId: vm.doctorItem},
             {
               date: visitDate,
               visitHour: {
                 id: vm.hourItem
               },
               doctor: {
                 id: vm.doctorItem
               }
             })
              .$promise.then(function(response) {
                // success
                Notification.success('Вы записались на прием');
                $location.path('/visits');
              }, function(errResponse) {
                  // fail
                });
         };
      });

    });
