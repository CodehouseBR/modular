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
			number:'INT',
			float: 'FLOAT',
			date: 'DATETIME'
		},
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
		_parserCreate: function( fields ){
			var output = [];
			for( field in fields ){
				output.push(
					this._parseField( field,(fields[field]).replace(/\s/g,'') ) );
			}
			return '( '+ output.join(', ') +' );';
		},
		create: function(name, fields, callback){
			this.exe('CREATE TABLE IF NOT EXISTS ' + name + this._parserCreate( fields), [[]], callback); 
		}
	};
	
	function Model( name, fields ){
		//If DB error
		if(!DB) throw "Error to access DataBase";
		//Auto instance
		if( this.constructor != App.base ){
			return new App.base(singular, plural);
		}
		//Make table
		DB.create(name, fields);

		var self = this;
		self.name = name;
		self._validate = fields;
		self._queue = [];	
		self._set= function(key, value){ self.[key] = value };
		self._goQueue = function(){	self._queue.shift.apply(this, arguments) };
	}
	

})();