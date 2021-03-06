angular.module('app.services', [])
  .factory(
    'AuthRestangular',
    [
      '$log',
      '$state',
      'Restangular',
      'AuthService',
      'API_BASE_URL',

      function(
        $log,
        $state,
        Restangular,
        AuthService,
        API_BASE_URL
      ) {
        return Restangular.withConfig(function(RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl(API_BASE_URL);

          RestangularConfigurer.setDefaultHeaders({
            'X-User-Token': AuthService.currentUser().authentication_token,
            'X-User-Email': AuthService.currentUser().email
          });
        });
      }
    ]
  )

  .factory(
    'AuthService',
    [
      '$log',
      '$q',
      '$state',
      '$location',
      'localStorageService',
      'Restangular',

      function(
        $log,
        $q,
        $state,
        $location,
        localStorageService,
        Restangular
      ) {
        return {
          currentUser: function() {
            return localStorageService.get('user') || {};
          },
          isLoggedIn: function() {
            if (localStorageService.get('user')) {
              return true;
            } else {
              return false;
            }
          },
          login: function(model) {
            var deferred = $q.defer();

            Restangular.all('users/sign_in').post({ user: model }).then(
              function(data) {
                var user = data.plain();

                localStorageService.set('user', user.success);
                deferred.resolve(user);
              },
              function() {
                deferred.reject();
              }
            );

            return deferred.promise;
          }
        };
      }
    ]
  )

  .factory(
    'errorHttpInterceptor',
    [
      '$log',
      '$q',
      '$rootScope',

      function(
        $log,
        $q,
        $rootScope
      ) {
        return {
          response: function(response) {
            return response;
          },

          responseError: function(response) {
            var message = '';

            $log.info(response);

            switch (response.status) {
              case 400:
                message = 'not_created';
                break;

              case 401:
              case 0:
                message = 'not_authorized';
                break;

              case 404:
                message = 'not_found';
                break;
            }

            $rootScope.$broadcast(message);

            return $q.reject(response);
          }
        };
      }
    ]
  )
;
