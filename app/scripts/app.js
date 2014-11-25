angular.module('app', [
  'ngAnimate',
  'LocalStorageModule',
  'restangular',
  'ui.router',
  'toaster',

  'app.module',
  'app.constants',
  'app.services'
])
  .config(
    [
      '$httpProvider',
      '$urlRouterProvider',
      '$locationProvider',
      'localStorageServiceProvider',
      'API_BASE_URL',

      function(
        $httpProvider,
        $urlRouterProvider,
        $locationProvider,
        localStorageServiceProvider,
        API_BASE_URL
      ) {
        $httpProvider.interceptors.push('errorHttpInterceptor');

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);

        localStorageServiceProvider.setPrefix('epc-v1.0.0');
      }
    ]
  )

  .run(
    [
      '$log',
      '$rootScope',
      'toaster',

      function(
        $log,
        $rootScope,
        toaster
      ) {
        $rootScope.$on('not_authorized', function() {
          toaster.pop('error', '', 'Cette page ne vous est pas autorisée');
          $state.go('login');
        });

        $rootScope.$on('not_found', function() {
          toaster.pop('error', '', 'La ressource n\'a pas été trouvée');
        });
      }
    ]
  )
;
