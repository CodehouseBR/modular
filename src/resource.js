(function(window, $, db){
	
	function Resource( name, fields ){
		//If DB error
		if(!db) throw "Error to access DataBase";
		//Atributes
		var self = this;
		//table's name
		self.name = name;
		//data to save
		self.data = {};
		//instance of DB
		self.db = db;
		//events
		self.events = { after:{}, before:{}, on:{} };
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
			this.callEvent('after','create',this, this.data);
		},
		callEvent:function(when, name, context, args){
			var event = this.events[when][name];
			if( event && event.length > 0 ){
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
		//Get data on this 
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
		//Events: after, before or on action, callback
		event:function(when, name, action){
			//If not created, make a list
			if( !this.events[when].hasOwnProperty(name) ){
				this.events[when][name] = [];
			}
			this.events[when][name].push(action);
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
		//Search values
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
	
})(window, jQuery, new PouchDB('modular') );