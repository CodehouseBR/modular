(function(window, $, View, db){
	
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
		//instance of DB
		self.db = db;
		//the view
		self.view = new View(name);
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
		_findTypes:{
			//Here map functions
		},
		_makeId: function(){
			return ((( new Date() ).getTime() + Math.random() ) * 10000 ).toString();
		},
		//New instance
		create: function(){
			this.data = { _id: this._makeId(), $type: this.name };
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
			if(!this._validation) return true;

			var self = this,
				validation = true;
			
			this._validation.forEach(function( key, type ){
				if( key && type ){
					var value = self.data[key];
					if( value && value.constructor != type )
						validation = false;
				}
			});

			return validation;
		},
		//After events
		after: function( event, action ){
			if( this._events.after[event] ){
				(this._events.after[event]).push(action);
			} else return false;
		},
		//Before events
		before:function( event, action ){
			if( this._events.before[event] ){
				(this._events.before[event]).push(action);
			} else return false;
		},
		//To save data
		save:function( data ){
			var self = this;
			//if argument exists, extend data;
			this.data = data ? $.extend(this.data, data): this.data;
			//saving
			if( this.validate() && this.callEvent('before', 'save', self, [self.data]) ){
				console.log(self.data);
				this.db.put(self.data, function(err,resp){
					console.log('Saved!', err, resp);
					self.callEvent('after','save', self, [resp]);
				});
			}
		},
		find: function(options, callback){
			var name = this.name;
			//options.condition
			this.db.query(function(doc, emit){
				var get = true;
				if( options.condition ){
					for( key in options.condition){
						if( doc[key] != options.condition[key] )
							get = false;
					}
				}
				if( options.fields ){
					//Code here
				}
				if( get && doc.$type == name ) emit(doc);
			}, callback);
		},
		//Update
		update:function(){
			//Core here
		}
	};

	window.Resource = Resource;
	
})(window, jQuery, View, new PouchDB('modular') );