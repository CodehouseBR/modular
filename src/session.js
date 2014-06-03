(function($){
	//Regex to verify if value to save is function
	var isFx = /\.fn$/,
		//Transform string in function
		_parseToFx = function( str ){
			 return (new Function('return ' + str ) )();
		},
		//Convert value in string to save
		_parseToStr = function( value, isFunction ){
			return !isFunction ? JSON.stringify(value) : value.toString(); 
		},
		//Convert value to return in get
		_parseToReturn = function( value, isFunction ){
			var toReturn = null;
			try {
				toReturn = !isFunction ? JSON.parse(value): _parseToFx(value);
			} catch( error ){
				toReturn = value;
			}
			return toReturn;
		}

	function Session(){ this.store = window.localStorage };

	Session.prototype = {
		constructor: Session,
		//Return respective value
		get:function( key ){
			//If key exists, return data converted in object or function
			return this.has(key) ? _parseToReturn( this.store.getItem(key), isFx.test(key) ) : null;
		},
		//Get localStorage
		getAll: function(){
			var toReturn = {},
				self = this;
			$.each(this.store, function( key, value ){
				toReturn[key] = self.get(key); 
			});
			return toReturn;
		},
		//Set key and value
		set:function( key , value ){
			//Verify if is function, parse value to String and set in localStorage
			this.store.setItem( key, _parseToStr( value, isFx.test(key) ));
			return this;
		},
		//Has the key?
		has:function( key ){
			//key exists?
			return this.store.hasOwnProperty(key);
		},
		//Remove a value
		remove:function( key ){
			this.store.removeItem(key);
			return this;
		},
		//Remove all values
		reset: function(){
			var self = this;
			$.each( this.getAll(), function(key){
				self.remove(key);
			});
		}
	}
	//Access Global
	window.Session = new Session();

})( jQuery );