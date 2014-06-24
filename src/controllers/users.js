var currentUser = new User();

app.controller('UserController', function($scope, $state){
	$scope.login = function(){
		currentUser.login( $scope.username, $scope.password, function(err, user){
			if( !err && user ) $state.go('home');
		});
	}
});

