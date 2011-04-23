/*
* jQuery Mobile Framework : "listview" filter extension
* Copyright (c) jQuery Project
* Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
* Note: Code is in draft form and is subject to change 
*/
(function($, undefined ) {

$.mobile.listview.prototype.options.category = false;

$( "[data-role='listview']" ).live( "listviewcreate", function() {
	var list = $( this );
	var category = list.find("[data-role='category-filter']");
	if (!category.length) {
		return;
	}
	
	category.find('select').change(function() {
		var val = $(this).val();
		list.children().show();
		if ( val ) {
			list.children('li[data-category]').filter(function() {
				return $( this ).attr('data-category') != val;
			}).hide();
		}
	});
});

})( jQuery );
