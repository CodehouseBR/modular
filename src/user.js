function User(){
	//Extends Resource
	Resource.call(this, 'user');
}
User.prototype.login = function(email, password, callback){
	var self = this;
	self.find({
		conditions:{
			email: email,
			password:password
		}
	}, function(err, result){
		if( !err && result.total_rows > 0){
			var user = result.row[0].key;
			callback.call(self, user);
			Session.set('logged', user);
		}
	});
};