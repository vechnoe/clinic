angular.module('authInterceptor', [
  'authService'
])

.factory('authInterceptor',
  function authInterceptor($injector) {
    return {
     request: function (config) {
        let Auth = $injector.get('authService');
        let token = Auth.getToken();
        if (token) {
          config.headers['Authorization'] = `Token ${ token }`;
        }
        return config;
      },

      responseError: function (response) {
        let Notify = $injector.get('Notification');
        let Auth = $injector.get('authService');
        if (response.status === 401 || response.status === 403) {
          Notify.error('Доступ запрещен');
          Auth.logout();
        }
        return response;
      }
   };
});