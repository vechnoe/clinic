angular.module('authService', [
])

.service('authService',
    function authService($state, $window,
      $location, localStorageService, Notification, dataService) {
      let _setDefaultUserRoute = function(role) {
        if (role === 'doctor'){
          $location.path('/visits');
        } else if(role === 'patient'){
          $location.path('/reception');
        }
      };

      let _setToken = function(token){
        localStorageService.set('token', token);
      };

      let _setUser = function(username, role, id, fullName){
        localStorageService.set('username', username);
        localStorageService.set('role', role);
        localStorageService.set('userId', id);
        localStorageService.set('fullName', fullName);
      };

      this.isLoggedIn = function() {
        return !!localStorageService.get('token') || 0;
      };

      this.isAuthorize = function(state){
        if (!state.hasOwnProperty('data')){
          return false;
        }
        let user = this.getUser();
        let role = user.role || 'anonimus';
        return state.data.access.indexOf(role) >= 0;
      };

      this.setDefaultRout = function (){
        let user = this.getUser();
        _setDefaultUserRoute(user.role);
      };

      this.getUser = function(){
        return {
          username: localStorageService.get('username'),
          role: localStorageService.get('role'),
          patient: localStorageService.get('patient'),
          id: localStorageService.get('userId'),
          fullName: localStorageService.get('fullName')
        };
      };

      this.getToken = function(){
        return localStorageService.get('token');
      };

      this.register = function (email, firstName, lastName, patronymic) {
        dataService.register.save({
          user: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            patronymic: patronymic
          }
        })
          .$promise.then(function (response) {
            // success
            if (response.user.authToken.key) {
              _setToken(response.user.authToken.key);

              let user = response.user;
              _setUser(
                user.email,
                user.role,
                user.id,
                user.fullName
              );

              _setDefaultUserRoute('patient');
              $window.location.reload(true);
            }
          }, function (errResponse) {
            Notification.error('Ошибка регистрации');
          });
      };

      this.login = function (username, password) {
        dataService.login.save({
          username: username,
          password: password
        })
          .$promise.then(function(response) {
            // success
            if (response.key) {
              _setToken(response.key);

              let user = response.user;
              _setUser(
                user.email,
                user.role,
                user.id,
                user.fullName
              );
              _setDefaultUserRoute(user.role);
              $window.location.reload(true);
            }
          }, function (errResponse) {
            Notification.error('Ошибка входа');
          });
      };

      this.logout = function () {
        dataService.logout.save({})
          .$promise.then(function(response) {
            // success
            localStorageService.clearAll();
            $location.path('/login');
            $window.location.reload(true);
          }, function (errResponse) {
            // fail
          });
      };
    });
