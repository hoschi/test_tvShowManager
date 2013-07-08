'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('MainCtrl', function ($scope, Restangular) {
		$scope.apiKey = 'dfb795ca8c3d1c8e3e432cc54e567deb';
		$scope.userName = 'hoschi';
		$scope.passwordSha = '36a8381f81d956f8bba27ed600c0c9ead4b8cbc4';
		Restangular.all('awesomethings').getList().then(function(things){
			$scope.awesomeThings = things;
		},function(err){
			console.error(err);
		});
	});
})();
