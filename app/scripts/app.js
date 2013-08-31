'use strict';

angular.module('tvShowManagerApp', ['restangular', 'ui.bootstrap', 'ngProgress'])
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        }
    })
	.config(function ($routeProvider, RestangularProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/admin', {
				templateUrl: 'views/admin.html',
				controller: 'AdminCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
			RestangularProvider.setBaseUrl('');
	});
