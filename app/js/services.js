'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('data/basic_construction_rule.json', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  }]);

/*
var User = $resource('/user/:userId', {userId:'@id'});
User.get({userId:123})
    .$promise.then(function(user) {
        $scope.user = user;
    });
    */