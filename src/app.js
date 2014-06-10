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

	});

	var user = new User({

	});

	var Discipline = new Model('discipline',{

	});

	var Notification = new Model('notification',{

	});
})()
