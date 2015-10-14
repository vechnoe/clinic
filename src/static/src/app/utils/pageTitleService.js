angular.module('pageTitleService', [
])

.service('pageTitleService',
    function pageTitleService($location, $state) {
      this.getTitle = function() {

        if (!$state.current.hasOwnProperty('data')){
          return;
        }
        let data = $state.current.data;
        let titles = {
          simpleTitle: {
            pageTitle: data.title.simpleTitle
          },
          complexTitle: {
            pageTitle: `${ data.title.complexTitle }: ${ $state.params.query }`
          }
        };

        let key = Object.keys(data.title)[0];
        return `${ titles[key].pageTitle } | Поликлиника`;
      };
    });
