'use strict';

(function() {
	var app = angular.module('tvShowManagerApp');
	app.controller('AdminCtrl', function ($scope, Restangular) {
		var settings;


/*
 *        settings.getList().then(function(settingsList){
 *            if (settingsList.length <= 0) {
 *                $scope.settings = {
 *                    traktUsername: "foo",
 *                    traktPassword: "bar"
 *                };
 *                settings.post({
 *                    traktUsername: "foo",
 *                    traktPassword: "bar"
 *                });
 *            } else {
 *                $scope.settings = settingsList[0];
 *            }
 *
 *        },function(err){
 *            console.error(err);
 *        });
 *
 */
		$scope.save = function () {
			console.log("save", $scope.traktUsername, $scope.traktPassword);
			$scope.settings.put();
		}
	});
})();
