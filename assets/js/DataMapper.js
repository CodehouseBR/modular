(function(){

	//REGEXP
	var notNull = /\!/,
		HasSize = /\[/,
		getSize = /\[(\d+)\]/,
		incremt = /[+]/;

	var DB = {
		database: openDatabase("DB", "1.0", "Database to DataMapper", 10 * 1024 * 1024),
		exe: function(sql, list, success, error){
			this.database.transaction(function(transaction){
				transaction.executeSql(sql, list, success, error);
			});
		},
		fieldType: {
			string: 'VARCHAR',
			text: 'LONGTEXT',
			int: 'INT',
			bigint: 'BIGINT',
			number:'INT',
			float: 'FLOAT',
			date: 'DATETIME'
		},
		//Transform key on field of table on SQL
		_parseField: function( key, value ){	
				var options = '';

				if( HasSize.test(value) ){
					var size = '';
					value = value.replace(getSize,function(a, b){
						size = b;
						return '';
					});
					options = '(' + (size || 5) + ')';
				}
				if( incremt.test(value) ){
					value = value.replace(incremt, '');
					options += ' AUTO_INCREMENT';
				}
				if( notNull.test(value) ){
					value = value.replace(notNull,'');
					options += ' NOT NULL';
				}
				
				return key +' '+ this.fieldType[value] + options;
		},
		//Trasform object in SQL
		_parserCreate: function( fields ){
			var output = [];
			for( field in fields ){
				output.push( this._parseField( field,(fields[field]).replace(/\s/g,'') ) );
			}
			return '( '+ output.join(', ') +' );';
		},
		//Helper to create table
		create: function(name, fields, callback){
			this.exe('CREATE TABLE IF NOT EXISTS ' + name + this._parserCreate( fields), [[]], callback); 
		}
	};
	
	function Model( name, fields ){
		//If DB error
		if(!DB) throw "Error to access DataBase";
		//Auto instance
		if( this.constructor != Model ){
			return new this.constructor(name, fields);
		}
		var self = this;
		//table's name
		self.name = name;
		//fields to validate input of data
		self._validate = fields;
		//queue of functions to execute
		self._queue = [];
		//data to save
		self.data = {};	
		self._set= function(key, value){ self.[key] = value };
		self._goQueue = function(){
			var that = this,
				args = arguments;
			self._queue.forEach(function( fn ){
				if( fn ){
					fn.apply(that, args);
				}
			});
		//Execute
		DB.create(name, fields, self._goQueue);
	};

	Model.prototype = {
		constructor: Model,
		//New instance
		create: function(){
			//Code here
		},
		//Get an Set data to save
		set: function(){
			//Code here
		},
		get: function(){
			//Code here
		},
		//Validate data
		validate:function(){
			//Core here
		},
		beforeValidate:function(){
			//Core here
		},
		//To save data
		beforeSave:function(){
			//Core here
		},
		save:function(){
			//Core here
		},
		afterSave:function(){
			//Core here
		},
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

})();