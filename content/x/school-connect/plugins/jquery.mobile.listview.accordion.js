/*
* jQuery Mobile Framework : listview accordion extension
* Copyright (c) Boris Smus
* Note: Code is in draft form and is subject to change 
*/
(function($, undefined ) {

$( "[data-role='listview']" ).live( "listviewcreate", function() {
	var list = $( this ),
		listview = list.data( "listview" );
	
  var accordionDecorator = function() {
  	list.find('.ui-li-accordion').each(function(index, accordion) {
  		// Format the accordion accordingly:
  		// <li>...normal stuff in a jQM li
  		//   <div class="ui-li-accordion">...contents of this</div>
  		// </li>
  		// If we find an accordion element, make the li action be to open the accordion element
      // console.log('accordion found ' + accordion);
  		// Get the li 
  		var $accordion = $(accordion);
  		$li = $accordion.closest('li');
  		// Move the contents of the accordion element to the end of the <li>
  		$li.append($accordion.clone());
  		$accordion.remove();
  		// Unbind all click events
  		$li.unbind('click');
  		// Remove all a elements
  		$li.find('a').remove();
  		// Bind click handler to show the accordion
  		$li.bind('click', function() {
  			// Check that the current flap isn't already open
  			var $accordion = $(this).find('.ui-li-accordion');
  			if ($accordion.css('display') != 'none') {
  				$accordion.slideUp();
  				$(this).removeClass('ui-li-accordion-open');
  				return true;
  			}
  			// Close all other accordion flaps
  			list.find('.ui-li-accordion').slideUp();
  			// Open this flap 
  			$accordion.slideToggle();
  			$(this).toggleClass('ui-li-accordion-open');
  		});
  	});
	};
	
	accordionDecorator();
	
	// Make sure that the decorator gets called on listview refresh too
  var orig = listview.refresh;
  listview.refresh = function() {
    orig.apply(listview, arguments[0]);
    accordionDecorator();
  };
});

})( jQuery );
