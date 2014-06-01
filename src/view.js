(function($, Handlebars, fs){

	function View( name ){
		this.resource = name;
	};
	View.prototype = {
		constructor: View,
		_getView: function( name ){
			var content = fs.openSync('view/'+this.resource+'/'+name+'.hbs');
			return Handlebars.compile(content);
		},
		show: function( name, context ){
			var compiled = this._getView(name)(context);
			View.now = name;
			View.container.html(compiled);
		}
	};
	View.now = false;
	View.container = $('#container-content');

})( jQuery, Handlebars, require('fs') );