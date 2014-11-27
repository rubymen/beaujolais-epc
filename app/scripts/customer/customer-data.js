angular.module('app.customerModule')
  .service(
    'customerData',
    [
      '$log',
      '$q',
      'Restangular',
      'AuthRestangular',

      function(
        $log,
        $q,
        Restangular,
        AuthRestangular
      ) {
        this.saveOne = function(model) {
          var deferred = $q.defer();

          if (typeof model.id === 'number') {
            AuthRestangular.one('manage/users', model.id).customPUT(model).then(
              function(data) {
                deferred.resolve(data);
              },
              function () {
                deferred.reject();
              }
            );
          } else {
            Restangular.all('manage/users').post(model).then(
              function(data) {
                deferred.resolve(data);
              },
              function () {
                deferred.reject();
              }
            );
          }

          return deferred.promise;
        };

        this.resetPassword = function(model) {
          var deferred = $q.defer();

          AuthRestangular.one('manage/users', model.id).one('reset').get().then(
            function(data) {
              deferred.resolve(data);
            },
            function() {
              deferred.reject();
            }
          );

          return deferred.promise;
        };
      }
    ]
  )
;
