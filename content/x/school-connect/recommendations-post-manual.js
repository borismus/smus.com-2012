(function() {

var init = function() {
  // activate the checkbox
  $('.ui-page-active .pt-post-checkbox').click(function() {
    $('.ui-page-active .pt-post-autocomplete').toggle();
    $('.ui-page-active .pt-post-added-blocks').toggle();
  });

  // show all author names in dropdown
  var authorNames = [];
  authors.each(function(index, author) {
    authorNames.push(author.name);
  });

  // enable autocomplete
  $(".ui-page-active .pt-post-autocomplete").autocomplete(authorNames,{width:'90.5%'}).hide();
  
  //autocomplete listener
  $("#pt-post-autocomplete").result(findValueCallback).next().click(function() {
	$(this).prev().search();
   });

  //autocomplete handler
  function findValueCallback(event, data, formatted) {
	$(".ui-page-active .pt-invitees").append('<div data-role="fieldcontain"><div class="pt-post-added-blocks">'+'<img class=pt-authorpic src="images/author/gabriela.png"></img>'+'<div class="pt-ac-formatted">'+formatted+'<div class="pt-post-closeicon"><div><div><div><div>');
	$('.ui-page-active .pt-post-autocomplete').val("");
	} 
	
  // catch form submissions
  $('.ui-page-active .pt-post-form').submit(function() {
  
    // create a new recommendation
    recommendations.add({
    	"posted": (new Date()).toString(),
    	"type": $('.ui-page-active .pt-recpost-manual-categoryselect').val(), //get from the picker
    	"category": "Science",
    	"lesson": "Oceans",
    	"title": $('.ui-page-active .pt-post-title').val(),
    	"description": $('.ui-page-active .pt-post-textfield').val(),
    	"url": "kids.nationalgeographic.com/", 
    	"image": "images/recomm/00.png", 
    	"authorId": currentAuthorId,
    	"discussionId": "-1" 
    });
    
    //TODO in recommendations.html page redraw
    if (window.redrawRecommendations) {
      redrawRecommendations();
    }
    
    // clear form values
    $('.ui-page-active .pt-post-title, .ui-page-active .pt-post-textfield').val('');
    $.mobile.changePage('recommendations.html');
    return false;
  });

  setTimeout(function() {
    var title = getParameterByName('title');
    var description = getParameterByName('description');

    $('.ui-page-active .pt-post-title').val(title);
    $('.ui-page-active .pt-post-textfield').val(description);
  }, 50);
};

scriptCache.onPageLoad('recommendation-post-manual.html', init);
init();

})();