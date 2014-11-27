angular.module('app.module', ['ui.router'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'views/login.html',
        controller: [
          '$log',
          '$scope',
          '$state',
          'localStorageService',
          'toaster',
          'AuthService',

          function(
            $log,
            $scope,
            $state,
            localStorageService,
            toaster,
            AuthService
          ) {
            var nbError = 0;

            localStorageService.clearAll();

            $scope.captcha = false;

            $scope.send = function(form) {
              if (form.$valid) {
                AuthService.login($scope.login).then(
                  function() {
                    toaster.pop('success', '', 'Vous êtes connecté');
                    $state.go('dashboard');
                  },
                  function() {
                    nbError++;

                    if (nbError >= 5) {
                      $scope.captcha = true;
                    }
                  }
                );
              }
            }
          }
        ]
      })

      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: [
          '$log',
          '$scope',

          function(
            $log,
            $scope
          ) {}
        ],
        bodyClass: 'clouds',
        protected: true
      })
    ;
  }])
;
