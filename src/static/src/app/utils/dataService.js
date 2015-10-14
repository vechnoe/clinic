angular.module('dataService', [
  'ngResource'
])

.factory('dataService',
    function dataService($resource, ENV) {
      return {
        register: $resource(
            `${ ENV.apiEndpoint }/api/patients/`),
        login: $resource(
            `http://localhost:8000/api/rest-auth/login/`),
        logout: $resource(
            `${ ENV.apiEndpoint }/api/rest-auth/logout/`),

        doctors: $resource(
            `${ ENV.apiEndpoint }/api/doctors/`),
        hours: $resource(
            `${ ENV.apiEndpoint }/api/doctors/:id/hours/:date`, {
            id: '@_id',
            date: '@_date'
          }),
        visitsByDoctor: $resource(
            `${ ENV.apiEndpoint }/api/doctors/:doctorId/visits/`, {
            doctorId: '@_doctorId'
          }),
        visits: $resource(
            `${ ENV.apiEndpoint }/api/visits/`)
      };
    });
