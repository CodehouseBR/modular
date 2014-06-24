var Student = new Model('student', {
	name: 'string!',
	mother:'string',
	father: 'string',
	birthdate: 'date!',
	actived: 'boolean!',
	schoolClass: 'number',
	notifications: 'list!'
});

Student.on('before','validate', function(data){
	//Code here
});

var Teacher = new Model('teacher', {
	name: String,
	rg: String,
	cpf: String,
	phones: Array,
	email: String,
	birthdate: Date
});

var Subject = new Model('subject', {
	name: String,
	teachers: Array
});

var SchoolClass = new Model('schoolclass', {
	turn: Number,
	label: String,
	graduate: Number,
	subjects: Array,
	year: String
});


var Notification = new Model('notification', {
	title: String,
	type: Number,
	description: String,
	// Teacher who has made the notif
	author: String
});
