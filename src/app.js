"use strict";

(function(){
	var app = angular.module('modular', ['ui.router']);

	app.config(function( $stateProvider, $urlRouterProvider ){
		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'view/home/home.html'
			})

			.state('students', {
				url: '/students',
				templateUrl: 'view/students/index.html'
			});
	});

	app.controller('AppController', function(){
		this.welcome = "Bem-vindo, usuário";
	});

	var Student = new Resource('student',{
		name: String,
		years: Number,
		birthdate: Date
	});

	var SchoolClass = new Resource('schoolclass',{

	});

	var Teacher = new Resource('teacher',{

	});

	var user = new User({

	});

	var Discipline = new Resource('discipline',{

	});

	var Notification = new Resource('notification',{

	});
})()
