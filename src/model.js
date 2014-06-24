(function(window, $, db){

	// Regexp to use on model validation
	var important = /\!/g,
		increment = /\+/g;

	/**
	 * Creates a Model representation in PouchDB
	 * @constructor 
	 * @param {string} name
	 * @param {object} fields
	 */
	function Model( name, fields ){
		// If DB error
		if(!db) Error('Error to access DataBase');

		var self = this;
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

	Model.prototype = {
		
		constructor: Model,
		
		_findTypes:{
			//Here map functions
		},
		validationType:{
			string: function( data ){
				return data.constructor == String ? true: false;
			},
			number: function( data ){
				return data.constructor == Number && data !== NaN ? true:false;
			},
			list: function( data ){
				return data.constructor == Array ? true: false;
			},
			object: function( data ){
				return typeof data == 'object' ? true: false
			},
			date: function( data ){
				return data.constructor == Date ? true: false
			},
			boolean: function( data ){
				return data.constructor == Boolean ? true: false;
			}
		},
		/**
		 * Make a random id
		 * @return {String} Generated id
		 */
		_makeId: function(){
			return ((( new Date() ).getTime() + Math.random() ) * 10000 ).toString();
		},

		/**
		 * Checks the existance of a entry in the database
		 * @param  {integer} id
		 * @return {Promise}
		 */
		exists: function( id ){
			var self = this,
				id = id || this.data._id;
			return new Promise(function(resolve, reject){
				self.find({condition: {_id: id}}, function(err, result ){
					if(result.total_rows >= 1 ) resolve( resul );
					else reject( err );
				});
			});
		},

		create: function(){
			this.data = { _id: this._makeId(), $type: this.name };
			this.trigger('after', 'create', this, this.data);
			return this;
		},

		/**
		 * Oh, this is pretty cool. 
		 * 	Triggers events saved when a event occurs.  
		 * @param  {string} when
		 * @param  {string} name - Event name
		 * @param  {Model} context - Model instance to contextualize the event
		 * @param  {array} args
		 * @return {boolean}
		 */
		trigger: function(when, name, context, args){
			var event = this.events[when][name];
			if( event && event.length > 0 ){
				var toReturn = [];
				event.forEach(function(action){
					toReturn.push( action.apply(context, args) );
				});
				return toReturn.length <= 1 ? toReturn[0]: toReturn;
			} else return true;
		},

		/**
		 * Set a field of this.data
		 * @param {string} key
		 * @param {*} value
		 */
		set: function(key, value){
			if( key.constructor == Object )
				this.data = $.extend(this.data, key);
			else this.data[key] = value;
		},

		/**
		 * Get a value from a field of this.data
		 * @param  {string} key
		 * @return {*}
		 */
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

		/**
		 * Validate if this.data agree with fields especification in this._validation
		 * @return {boolean}
		 */
		validate: function(){
			if( !this.trigger('before', 'validate', this, [this.data, this._validation]) ) 
				return false;
			if( !this._validation )
				return true;

			var self = this,
				validation = true;
				
			$.each(this._validation, function( key , type ){
				if( important.test(type) ){
					type = type.replace(important,'');
					if( data[key] === undefined ) validation = false;
				}
				if( increment.test(type) ){
					type = type.replace(increment, '');
					//Code here
				}
				var typeFn = this.validationType[type];
				if( typeFn && !typeFn(type) ){
					validation = false;
				}
			});

			return validation;
		},

		/**
		 * Defines a event that will can be triggered by this.trigger
		 * @param  {string} when - after, before, during or optional.
		 * @param  {string} name
		 * @param  {function} action
		 */
		on: function(when, name, action){
			// If doesn't exist a entry, create one, man!
			if( !this.events[when].hasOwnProperty(name) ){
				this.events[when][name] = [];
			}
			this.events[when][name].push(action);
		},
		
		/**
		 * That's the important part: Save a entry to database
		 * @param  {object} data
		 */
		save: function( data ){
			if( !this.data._id ) this.create();

			var self = this;
			// If a cached data already exists, let's merge them
			this.data = data ? $.extend(this.data, data): this.data;
			
			// Tan dan
			if( this.validate() && this.trigger('before', 'save', self, [self.data]) ){
				console.log(self.data);
				this.db.put(self.data, function(err,resp){
					console.log('Saved!', err, resp);
					self.trigger('after','save', self, [resp]);
				});
			}
		},

		/**
		 * Search for pieces of data in the database
		 * @param  {object}   options
		 * @param  {Function} callback
		 */
		find: function(options, callback){
			// Get this model name to search in pouchDB
			var name = this.name;
			this.db.query(function(doc, emit){
				// Emit this doc?
				var get = true;
				if( options.condition ){
					for( key in options.condition){
						if( doc[key] != options.condition[key] )
							get = false;
					}
				}
				if( options.fields ){
					// Code here
				}
				// Emit if validation = true and this type = model.name
				if( get && doc.$type == name ) emit(doc.$type, doc);
			},{}, function(err, result){
				if( !err ){
					callback(
						result.rows.map(function(doc, index){
							return doc.value;
						})
					);
				} else Error(err);
			});
		},
		// Update
		update:function(){
			// Core here
		}
	};

	window.Model = Model;
	
})(window, jQuery, new PouchDB('modular') );