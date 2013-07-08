'use strict';

angular.module('tvShowManagerApp', ['restangular'])
  .config(function ($routeProvider, RestangularProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      RestangularProvider.setBaseUrl('');
  });
