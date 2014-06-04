(function($, Handlebars, fs){

	//Make helper to include
	Handlebars.registerHelper('include', function( local, context){
		var local = local.split('\\');
		return new Handlebars.SafeString( View( local[0] )._getView( [local[1] ])( context ) );
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
			var content = fs.readFileSync('view/'+this.resource+'/'+name+'.hbs', 'utf-8');
			return Handlebars.compile(content);
		},

		//Show this view with this context on container
		show: function( name, context ){
			var compiled = this._getView(name)(context);
			this.static.now = name;
			this.static.container.html(compiled);
		}
	};
	//Current view
	View.now = false;
	//Container to turn view
	View.container = $('#view-container');
	//Access global
	window.View = View;

})( jQuery, Handlebars, require('fs'));