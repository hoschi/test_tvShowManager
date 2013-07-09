'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('AdminCtrl', function ($scope, Restangular) {

		Restangular.one('settings', 1).get().then(function(settings){
			$scope.settings = settings;
		},function(err){
			console.error(err);
		});

		$scope.save = function () {
			$scope.settings.put();
		}
	});
})();
