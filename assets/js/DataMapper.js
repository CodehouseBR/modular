(function(){

	//REGEXP
	var notNull = /\!/,
		HasSize = /\[/,
		getSize = /\[(\d+)\]/,
		incremt = /[+]/;

	var DB = {
		//Open dataBase
		database: openDatabase("DB", "1.0", "Database to DataMapper", 10 * 1024 * 1024),
		//init transaction
		exe: function(sql, list, success, error){
			this.database.transaction(function(transaction){
				transaction.executeSql(sql, list, success, error);
			});
		},
		//Type of fields
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
					options = '(' + (size || 10) + ')';
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
			this.exe('CREATE TABLE IF NOT EXISTS ' + name + this._parserCreate( fields ), [[]], callback); 
		},
		insert: function(name, fields, callback){
			code
		}
	};


	
	function Model( name, fields ){
		//If DB error
		if(!DB) throw "Error to access DataBase";
		//Auto instance
		if( this.constructor != Model ){
			return new Model(name, fields);
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
			this.data = {};
		},
		//Get an Set data to save
		set: function(key, value){
			this.data[key] = value;
		},
		get: function(key){
			return this.data[key];
		},
		//Validate data
		validate:function(){
			this._validate.forEach(function(){

			});this.data
		},
		beforeValidate:function(){
			//Core here
		},
		//To save data
		beforeSave:undefined,
		save:function( data ){
			//Se tiver parâmetro data mescla com o que já tem
			this.data = data ? $.extend(this.data, data): this.data;
			//Antes de validar
			if( this.beforeValidate && this.beforeValidate() && this.validate() ){
				DB.
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

})();