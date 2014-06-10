"use strict";

(function(){
	var app = angular.module('modular', ['ui.router']);

	app.config(function( $stateProvider, $urlRouterProvider ){
		$urlRouterProvider.otherwise('/home');

		$stateProvider
			// App routes
			.state('home', {
				url: '/home',
				templateUrl: 'view/home/home.html'
			})
			.state('settings', {
				url: '/settings',
				templateUrl: 'view/home/settings.html'
			})
			// Students routes
			.state('students', {
				url: '/students',
				templateUrl: 'view/students/layout.html'
			})
				.state('students.add', {
					url: '/add',
					templateUrl: 'view/students/add.html'
				})

				.state('students.search', {
					url: '/search',
					templateUrl: 'view/students/search.html'
				})

				.state('students.notify', {
					url: '/notify',
					templateUrl: 'view/students/notify.html'
				})

			// Teachers routes
			.state('teachers', {
				url: '/teachers',
				templateUrl: 'view/teachers/layout.html',
				controller: 'TeacherController'
			})
				.state('teachers.add', {
					url: '/add',
					templateUrl: 'view/teachers/add.html'
				})

				.state('teachers.search', {
					url: '/search',
					templateUrl: 'view/teachers/search.html'
				});
	});

	app.controller('AppController', function(){
		this.welcome = "Bem-vindo, usuário";
	});

	var Student = new Model('student',{
		name: String,
		mother: String,
		father: String,
		age: Number,
		birthdate: Date,
		actived: Boolean,
		schoolClass: Number
	});

	Student.event('before','validate', function(data){
		//Code here
	});

	var SchoolClass = new Model('schoolclass',{

	});

	var Teacher = new Model('teacher',{
		name: String
	});

	app.controller('TeacherController', function($scope){
		$scope.teacher = {};
		$scope.teachers = {};

		$scope.getTeachers = function(){
			Teacher.find({ name: '' }, function(err, response){
				$scope.teachers = response.rows;
			});
		}

		$scope.save = function( teacher ){
			Teacher.create().save( teacher );
			$scope.teacher = {};
		}
	});

	var user = new User({

	});

	var Discipline = new Model('discipline',{

	});

	var Notification = new Model('notification',{

	});
})()
