angular.module('dateInputDirective', [
  'ui.bootstrap'
])

.directive('dateInputDirective',
    function dateInputDirective(
      $state, $location, moment,
        menuSettingsService, notifyingService) {
       return {
         restrict: 'E',
         replace: true,
         templateUrl: 'menus/date-input/date-input.tpl.html',
         link: function (scope) {
           const settings = menuSettingsService['day'];
           scope.settings = settings;

           scope.minDate = moment().format('YYYY-MM-DD');
           scope.currentText = settings.currentText;
           scope.clearText = 'Очистить';
           scope.closeText = 'Закрыть';

           scope.disabled = function(date, mode) {
             return (
               mode==='day' && (
               date.getDay()===0 || date.getDay()===6));
           };

           scope.openCalendar = function ($event) {
             $event.preventDefault ();
             $event.stopPropagation ();
             scope.opened = true;
           };

           scope.$watch('selectedDate', function (value) {
             notifyingService.notify(moment(value));
           }, true);

         }
       };
    });
