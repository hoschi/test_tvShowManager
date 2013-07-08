'use strict';

angular.module('tvShowManagerApp')
  .controller('MainCtrl', function ($scope, Restangular) {
    Restangular.all('awesomethings').getList().then(function(things){
    	$scope.awesomeThings = things;
    },function(err){
    	console.error(err);
    });
  
  });
