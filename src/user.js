function User(fields){
	//Extends Model
	Model.call(this, 'user', fields);
}
User.prototype = Object.create( Model.prototype );
User.constructor = User;
User.prototype.login = function(username, password, callback){
	var self = this;
	this.callEvent('before','login', self, [username,password]);
	self.find({
		conditions:{
			username: username,
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

User.isLogged = User.prototype.isLogged = function(){
	return !!Session.get('logged');
};
User.prototype.logout = function(){
	this.callEvent('before','logout', self, [Session.get('logged')]);
	Session.set('logged',false);
	this.callEvent('after','logout', self,[]);
};