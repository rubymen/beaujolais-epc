angular.module('app.customerModule', ['ui.router'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('me', {
        abstract: true,
        url: '/me',
        template: '<div ui-view></div>',
        bodyClass: 'me',
        protected: true
      })

      .state('me.index', {
        url: '',
        templateUrl: 'views/customer/index.html',
        controller: 'CustomerIndexController'
      })
    ;
  }])
;
