function FileController($scope, $http) {

	$http.get('http://localhost:3454/file/')
		.success(function(data) {
			console.log(data);
			$scope.files = data.result;
		})
		.error(function(data) {
			console.log('Error: ' + data);
	});

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

}

module.exports = FileController;



