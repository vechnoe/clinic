angular.module('notifyingService', [
])

.factory('notifyingService', function($rootScope) {
    return {
        subscribe: function(scope, callback) {
            let handler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', handler);
        },

        notify: function(data) {
            $rootScope.$emit('notifying-service-event', data);
        }
    };
});
