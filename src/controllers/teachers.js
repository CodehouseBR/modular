app.controller('TeacherController', function($scope){
	$scope.teacher = {};
	$scope.teachers = {};

	$scope.save = function( teacher ){
		teacher.phones = teacher.phones.replace(/\s{1,}/g, '').split(',');
		teacher.birthdate = new Date(teacher.birthdate);

		Teacher.create().save( teacher );
		
		Teacher.on('after', 'save', function(){
			console.log(arguments);
		});

		$scope.teacher = {};
	}
});