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
		//fields to validate input of data
		self._validate = fields;
		//queue of functions to execute
		self._queue = [];
		self._set= function(key, value){ self[key] = value };
		self._goQueue = function(){
			var that = this,
				args = arguments;
			self._queue.forEach(function( fn ){
				if( fn ){
					fn.apply(that, args);
				}
			});
		}
		//Execute
		DB.create(name, fields, self._goQueue);
	};

	Resource.prototype = {
		constructor: Resource,
		//New instance
		create: function(){
			this.data = {};
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
		beforeValidate:function(){
			//Core here
		},
		after: function( event, action ){
			//Here
		},
		//To save data
		beforeSave:undefined,
		save:function( data ){
			//Se tiver parâmetro data mescla com o que já tem
			this.data = data ? $.extend(this.data, data): this.data;
			//Antes de validar
			if( this.beforeValidate ) this.beforeValidate();
			if( this.validate() ){
				if( this.beforeSave ) this.afterSave();
				var self = this;
				DB.insert(this.name, this.data, function( saved ){
					this.data = saved;
					if( self.afterSave ) self.afterSave();
				});
			}
		},
		afterSave:undefined,
		//To Find
		beforeFind:function(){
			//Core here
		},
		find:function(){
			//Core here
		},
		afterFind:function(){
			//Core here
		},
		//to Remove
		beforeRemove:function(){
			//Core here
		},
		remove:function(){
			//Core here
		},
		afterRemove:function(){
			//Core here
		},
		//Update
		update:function(){
			//Core here
		}
	};
})(window, new PouchDB('modular') );