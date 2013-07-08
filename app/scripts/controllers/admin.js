'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('AdminCtrl', function ($scope, Restangular) {
/*
 *        Restangular.all('settings').getList().then(function(settings){
 *
 *        },function(err){
 *            console.error(err);
 *        });
 */
		$scope.save = function () {
			console.log("save", $scope.traktUsername, $scope.traktPassword);
		}
	});
})();
