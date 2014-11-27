angular.module('app', [
  'ngAnimate',
  'LocalStorageModule',
  'restangular',
  'ui.router',
  'toaster',

  'app.module',
  'app.constants',
  'app.services',

  'app.customerModule'
])
  .config(
    [
      '$httpProvider',
      '$urlRouterProvider',
      '$locationProvider',
      'localStorageServiceProvider',
      'RestangularProvider',
      'API_BASE_URL',

      function(
        $httpProvider,
        $urlRouterProvider,
        $locationProvider,
        localStorageServiceProvider,
        RestangularProvider,
        API_BASE_URL
      ) {
        $httpProvider.interceptors.push('errorHttpInterceptor');

        $urlRouterProvider.otherwise('/');

        $locationProvider.html5Mode(true);

        localStorageServiceProvider.setPrefix('epc-v1.0.0');

        RestangularProvider.setBaseUrl(API_BASE_URL);
        RestangularProvider.setRequestSuffix('.json');
      }
    ]
  )

  .run(
    [
      '$log',
      '$rootScope',
      '$state',
      'toaster',
      'AuthService',

      function(
        $log,
        $rootScope,
        $state,
        toaster,
        AuthService
      ) {
        $rootScope.$on('not_created', function() {
          toaster.pop('warning', '', 'La modification n\'a pas été effectuée');
        });

        $rootScope.$on('not_authorized', function() {
          toaster.pop('error', '', 'Cette page ne vous est pas autorisée');
          $state.go('login');
        });

        $rootScope.$on('not_found', function() {
          toaster.pop('error', '', 'La ressource n\'a pas été trouvée');
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
          var bodyClass = '', state, tmpState;

          state = toState.name.split('.');

          for (var i = state.length; i > 0; i--) {
            tmpState = state.slice(0, i).join('.');

            if ($state.get(tmpState)) {
              if ($state.get(tmpState).bodyClass) {
                bodyClass += ' ' + $state.get(tmpState).bodyClass;
              }

              if ($state.get(tmpState).protected && !AuthService.isLoggedIn()) {
                $rootScope.$broadcast('not_authorized');
              }
            }
          }

          $rootScope.bodyClass = bodyClass;
        });
      }
    ]
  )
;
