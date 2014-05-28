(function(window, db){
	
	function Resource( name, fields ){
		//If DB error
		if(!db) throw "Error to access DataBase";
		//Auto instance
		if( this.constructor != Resource ){
			return new Resource(name, fields);
		}
		var self = this;
		//table's name
		self.name = name;
		//data to save
		self.data = {};	
		//events 
		self._events = {
			after:{
				save:[],
				find:[],
				remove:[]
			},
			before:{
				save:[], 
				find:[],
				remove:[]
			}
		};
		//fields to validate input of data
		self._validation = fields || false;
	};

	Resource.prototype = {
		constructor: Resource,
		//New instance
		create: function(){
			this.data = {};
		},
		callEvent:function(type, name, context, args){
			var event = this._events[type][name];
			if( event.length > 0 ){
				event.forEach(function(action){
					action.apply(context, args);
				});
			} else return true;
		},
		//Get an Set data to save
		set: function(key, value){
			if( key.constructor == Object )
				this.data = $.extend(this.data, key);
			else this.data[key] = value;
		},
		get: function(key){
			if( key.constructor == Array ){
				var toReturn = {},
					self = this;
				key.forEach(function( value ){
					toReturn[ value ] = self.data[value]; 
				});
				return toReturn;
			} else return this.data[key];
		},
		//Validate data
		validate:function(){
			var self = this,
				validation = true;
			this._validate.forEach(function( field, type ){
				//Field not null
				if( notNull.test(type) ){
					if( !self.data.hasOwnProperty(field) || self.data[field] === null || self.data[field] === undefined )
						validation = false;
				}
				//If field has a size
				if( HasSize.test( type ) ){
					var size = Number( type.match(getSize)[1] );
					if( self.data[field].length > size )
						validation = false;
				}
				//Clean field type
				type = type.replace(cleaner, '');
				if( (type == 'string' || type == 'text') && !(self.data[field].constructor == String) )
					validation = false;
				if( (type == 'int' || type == 'float' || type == 'number') && !(self.data[field].constructor == Number) )
					validation = false;
			});

			return validation;
		},
		//After events
		after: function( event, action ){
			if( this.events.after[event] ){
				(this.events.after[event]).push(action);
			} else return false;
		},
		//Before events
		before:function( event, action ){
			if( this.events.before[event] ){
				(this.events.before[event]).push(action);
			} else return false;
		},
		//To save data
		save:function( data ){
			var self = this;
			//if argument exists, extend data;
			this.data = data ? $.extend(this.data, data): this.data;
			//saving
			if( this.validate() && this.callEvent('before', 'save') ){
				db.put(this.data, function(){
					self.callEvent('after','save', arguments);
				});
			}
		},
		//Update
		update:function(){
			//Core here
		}
	};
	
})(window, new PouchDB('modular') );