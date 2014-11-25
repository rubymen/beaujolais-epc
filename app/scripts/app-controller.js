angular.module('app')
  .controller(
    'AppController',
    [
      '$log',
      '$scope',
      'localStorageService',
      'AuthService',

      function(
        $log,
        $scope,
        localStorageService,
        AuthService
      ) {
        $scope.$watch(AuthService.isLoggedIn, function(isLoggedIn) {
          $scope.isLoggedIn   = isLoggedIn;
          $scope.currentUser  = AuthService.currentUser();
        });
      }
    ]
  )
;
