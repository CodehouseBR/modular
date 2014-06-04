(function( fileSystem ){
	Helper = {
		file:{
			read: function(path){
				return fileSystem.readFileSync(path, 'utf-8'); 
			}
		},
		form:{
			create: function(){
				//Code here
			},
			serialize: function(){
				//Code here
			}			
		}
	};

	window.Helper = Helper;
})( require('fs') );