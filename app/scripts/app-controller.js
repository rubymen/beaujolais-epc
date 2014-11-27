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
        $scope.$watch(AuthService.currentUser, function(currentUser) {
          $scope.isLoggedIn   = AuthService.isLoggedIn();
          $scope.currentUser  = currentUser;
        }, true);
      }
    ]
  )
;
