function User(fields){
	//Extends Resource
	Resource.call(this, 'user', fields);
}
User.prototype = Object.create( Resource.prototype );
User.constructor = User;
User.prototype.login = function(email, password, callback){
	var self = this;
	this.callEvent('before','login', self, [email,password]);
	self.find({
		conditions:{
			email: email,
			password:password
		}
	}, function(err, result){
		if( !err && result.total_rows > 0){
			var user = result.row[0].key;
			callback.call(self, undefined, user);
			Session.set('logged', user);
			this.callEvent('after','login', self, user);
		} else callback.call(self, "Usuário ou senha inválidos");
	});
};

User.current = User.prototype.current = function(){
	return Session.get('logged');
};
User.prototype.logout = function(){
	this.callEvent('before','logout', self, [Session.get('logged')]);
	Session.set('logged',false);
	this.callEvent('after','logout', self,[]);
};