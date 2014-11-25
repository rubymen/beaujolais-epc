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
            localStorageService.clearAll();

            $scope.send = function(form) {
              if (form.$valid) {
                AuthService.login($scope.login).then(function() {
                  toaster.pop('success', '', 'Vous êtes connecté');
                });
              }
            }
          }
        ]
      })
    ;
  }])
;
