/**
 * User Model
 * @constructor
 * @param {object} fields
 */
function User(fields){
	// Extends Model
	Model.call(this, 'user', fields);
}
//Extends Model
User.prototype = Object.create( Model.prototype );
/**
 * To login in system
 * @param {string} userName
 * @param {string} password
 * @param {function} callback
 */
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
/**
 * User status now 
 * @return {boolean} isLogged?
 */
User.isLogged = User.prototype.isLogged = function(){
	return !!Session.get('logged');
};
/**
 * To logout of system
 */
User.prototype.logout = function(){
	this.callEvent('before','logout', self, [Session.get('logged')]);
	Session.set('logged',false);
	this.callEvent('after','logout', self,[]);
};