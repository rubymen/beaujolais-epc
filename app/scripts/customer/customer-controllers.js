angular.module('app.customerModule')
  .controller(
    'CustomerIndexController',
    [
      '$log',
      '$scope',
      'localStorageService',
      'toaster',
      'AuthService',
      'customerData',

      function(
        $log,
        $scope,
        localStorageService,
        toaster,
        AuthService,
        customerData
      ) {
        $scope.customer = angular.copy(AuthService.currentUser());

        $scope.save = function(form) {
          if (form.$valid) {
            customerData.saveOne($scope.customer).then(
              function(data) {
                var user = data.plain();

                localStorageService.set('user', user);

                $scope.openForm();

                toaster.pop('success', '', 'Modifications effectuées');
              }
            );
          }
        };

        $scope.openForm = function() {
          angular.element('.form-colored').slideToggle();
        };

        $scope.resetPassword = function() {
          customerData.resetPassword($scope.customer).then(
            function(data) {
              toaster.pop('success', '', 'Vous allez recevoir un email de réinitialisation du mot de passe');
            }
          );
        };
      }
    ]
  )

  .controller(
    'SignupController',
    [
      '$log',
      '$scope',
      '$state',
      'toaster',
      'AuthService',
      'customerData',

      function(
        $log,
        $scope,
        $state,
        toaster,
        AuthService,
        customerData
      ) {
        $scope.customer = {
          type: 'Customer'
        };

        $scope.save = function(form) {
          if (form.$valid) {
            customerData.saveOne({ user: $scope.customer }).then(
              function(data) {
                var user = data.plain();

                localStorageService.set('user', user);

                $scope.openForm();

                toaster.pop('success', '', 'Création du compte réussie');

                $state.go('dashboard');
              }
            );
          }
        };
      }
    ]
  )
;
