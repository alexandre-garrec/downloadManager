
var _ = require('lodash');

function FileController($scope, $http, $mdToast , socket) {
	
	$http.get('http://localhost:3454/file/')
		.success(function(data) {
			console.log(data);
			$scope.files = data.result;
		})
		.error(function(data) {
			console.log('Error: ' + data);
	});


	socket.on('bonjour', function (data) {
	    $mdToast.show( $mdToast.simple().content(data.hello).position('top right').hideDelay(700));
	    $scope.onReset();
	});

	socket.on('download', function (data) {

        if (data.count != data.total) {
            //$( "#infos" ).text( Math.round(100*data.count /total) + " % " );
            $scope.files[$scope.files.length - data.id].status = Math.round(100*data.count /data.total) + " % ";
            $scope.files[$scope.files.length - data.id].determinateValue = 100*data.count /data.total;
        }
        else{

            $scope.files[$scope.files.length - data.id].status = "Finalisation...";
        }
	});



	$scope.download = function(){
		$scope.onReset();
		  $.ajax(
	      {
	        url : '/download/',
	        type: "POST",
	        data : "url='" + $scope.file.url + "'",

	        success : function(data)
	        {
	            $mdToast.show( $mdToast.simple().content('Done').position('top right').hideDelay(700));
	        }
	      }
	  );
	$scope.file.url = "";
	};

	$scope.onReset = function(){
		$http.get('http://localhost:3454/file/')
			.success(function(data) {
				console.log(data);
				$scope.files = data.result;
			})
			.error(function(data) {
				console.log('Error: ' + data);
		});

	};

	$scope.openToast = function($event) {
       $mdToast.show(
	      $mdToast.simple()
	        .content('Simple Toast !')
	        .position('top right')
	        .hideDelay(700)
	    );
	  };

}

module.exports = FileController;



