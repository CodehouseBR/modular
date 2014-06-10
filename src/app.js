"use strict;"

(function(){
	var app = angular.module('modular', ['ui.router']);

	app.config(function( $stateProvider, $routeProvider ){
		$routeProvider.otherwise('/');
	});
	
	app.controller('AppController', function(){
		this.welcome = "Bem-vindo, usuário";
	});

	Student = new Resource('student',{
		name: String,
		years: Number,
		birthdate: Date
	});

	SchoolClass = new Resource('schoolclass',{

	});

	Teacher = new Resource('teacher',{

	});

	User = new User({

	});

	Discipline = new Resource('discipline',{

	});

	Notification = new Resource('notification',{

	});
})()
