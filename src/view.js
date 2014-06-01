(function($, Handlebars, fs){

	function View( name ){
		this.name = name;
	};
	View.prototype = {
		constructor: View,
		_getView: function( name ){

		},
	};

})( jQuery, Handlebars, require('fs') );