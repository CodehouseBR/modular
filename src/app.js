(function(){
	var modular = angular.module("modular", ["ngRoute"]);

	modular.controller("StudentsController", function(){
		this.students = [
			{
				name: "Gabriel Rubens"
			},

			{
				name: "Judson Barroso"
			}
		];
	});

	modular.controller("TeachersController", function(){

	});

	modular.controller("ClassesController", function(){

	});	
})()