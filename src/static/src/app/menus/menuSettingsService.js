angular.module('menuSettingsService', [
])

.constant('menuSettingsService',
    {
      day: {
        mode: 'day',
        dateFormat: 'dd.MM.yyyy',
        currentText: 'Сегодня',
        inputPlaceholder: 'Выберите дату:'
       }
    });
