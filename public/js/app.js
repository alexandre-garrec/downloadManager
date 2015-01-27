'use strict';


var downloadManager = angular.module('downloadManager', ['ngMaterial' , 'ngRoute']);

downloadManager.controller('FileController', require('./controllers/fileController'));

downloadManager.factory('socket', function ($rootScope) {
  var socket = io.connect('http://localhost:4876');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});


downloadManager.config(['$routeProvider', '$locationProvider', function($routeProvider) {
    $routeProvider
        .when('/home', {templateUrl: 'partials/home.html' ,  controller: 'FileController'})
        .when('/files', {templateUrl: 'partials/files.html' , controller: 'FileController'})
        .when('/parameters', {templateUrl: 'partials/parameters.html' , controller: 'FileController'})

        .otherwise({redirectTo: '/home'});
}]);
