"use strict";

(function(){
	var app = angular.module('modular', ['ui.router']);

	app.config(function( $stateProvider, $urlRouterProvider ){
		
		$urlRouterProvider
			.otherwise('/home');

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
				})
			// Users routes
			.state('users',{
				url: '/users',
				templateUrl: 'view/users/layout.html',
			})
				.state('users.add', {
					url: '/add',
					templateUrl: 'view/users/add.html'
				})

				.state('users.login', {
					url: '/login',
					templateUrl: 'view/users/login.html'
				})
				.state('users.logout', {
					url: '/logout',
					templateUrl: 'view/users/logout.html'
				});

	}).run(function ($rootScope, $state){
		//Before render views
		$rootScope.$on('$stateChangeStart', function (event, nextState){
			if( !User.isLogged() && nextState.name != 'users.login' ){
				event.preventDefault();
				$state.go('users.login');
			}
		});
	});

	app.controller('AppController', function(){
		this.welcome = "Bem-vindo, usuário";
	});

	/*- Users -*/
	var currentUser = new User();

	app.controller('UserController', function($scope, $state){
		$scope.login = function(){
			currentUser.login( $scope.username, $scope.password, function(err, user){
				if( !err && user ) $state.go('home');
			});
		}
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
		
		$scope.save = function( teacher ){
			Teacher.save( teacher );
			$scope.teacher = {};
		}
	});

	var Discipline = new Model('discipline',{

	});

	var Notification = new Model('notification',{

	});
})()
