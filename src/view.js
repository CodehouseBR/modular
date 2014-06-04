(function($, hbs, _ ){

	//Make helper to include
	hbs.registerHelper('include', function( local, context){
		var local = local.split('\\');
		return new hbs.SafeString( View( local[0] )._getView( [local[1] ])( context ) );
	});
	
	function View( name ){
		if( this.constructor != View ){
			return new View(name);
		}
		this.resource = name;
		this.static = this.constructor;
	};
	View.prototype = {
		constructor: View,
		//Return function to compile selected file
		_getView: function( name ){
			//Get file contents and compile to Handlebars
			return hbs.compile( _.file.read('view/'+this.resource+'/'+name+'.hbs') );
		},
		//Show this view with this context on container
		show: function( name, context ){
			var compiled = this._getView(name)(context);
			this.static.current = name;
			this.static.container.html(compiled);
		}
	};
	//Current view showed
	View.current = false;
	//Container to turn view
	View.container = $('#view-container');
	//Access global
	window.View = View;

})( jQuery, Handlebars, Helper);