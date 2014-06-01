(function($){

	function Session(){
		this.store = window.localStorage;
	}

	Session.prototype = {
		constructor: Session,
		get:function( key ){
			if((/#/).test(key)){
				 return (new Function('return ' + this.store.getItem(key)) )();
			} 
			else return JSON.parse( this.store.getItem(key) );
		},
		set:function( key , value ){
			if((/#/).test(key)) this.store.setItem(key, value.toString() );
			else this.store.setItem(key, JSON.stringify(value));
			return this;
		},
		has:function( key ){
			return this.store.hasOwnProperty(key);
		},
		indexOf:function( value ){
			var index = null,
				value = JSON.stringify(value);
			$.each(this.store, function( key, val ){
				if( val == value ) index = key;
			});
			return index;
		},
		remove:function( key ){
			this.store.removeItem(key);
			return this;
		}
	}

	window.Session = new Session();

})( jQuery );