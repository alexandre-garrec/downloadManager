'use strict';


var downloadManager = angular.module('downloadManager', ['ngMaterial']);

downloadManager.controller('FileController', require('./controller/fileController'));

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
