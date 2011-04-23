(function() {

var init = function() {
  // activate the checkbox
  $('.ui-page-active .pt-post-checkbox').click(function() {
    $('.ui-page-active .pt-post-autocomplete').toggle();
    if ($(this).attr('checked') == false) {
      $('.ui-page-active .pt-invitees').empty();
    }
  });

  // show all author names in dropdown
  var authorNames = [];
  authors.each(function(index, author) {
    authorNames.push(author.name);
  });

  // enable autocomplete
  $(".ui-page-active .pt-post-autocomplete").autocomplete(authorNames,{width:'90.5%'}).hide();
  
  //autocomplete listener
  $("#pt-post-autocomplete").result(findValueCallback);

  //autocomplete handler
  function findValueCallback(event, data, formatted) {
    var $invitee = $('.ui-page-active .pt-invitees').append(
      '<div class="pt-invitee" data-role="fieldcontain"><div class="pt-post-added-blocks">' +
      '<img class="pt-authorpic" src="images/author/gabriela.png"/>' +
      '<div class="pt-ac-formatted">' + formatted + '<div class="pt-post-closeicon"></div>' +
      '</div></div>');

      $invitee.find('.pt-post-closeicon').click(function() {
        $(this).closest('.pt-invitee').remove();
      });
  	$('.ui-page-active .pt-post-autocomplete').val("");
	} 
  
  // catch form submissions
  $('.ui-page-active .pt-post-form').submit(function() {
    // create a new discussion
    discussions.add({
      "posted": (new Date()).toString(),
      "title": $('.ui-page-active .pt-post-title').val(),
      "body": $('.ui-page-active .pt-post-textfield').val(),
      "type": "misc",
      "authorId": currentAuthorId,
      "comments": []
    });
    if (window.redrawDiscussions) {
      redrawDiscussions();
    }
    // clear form values
    $('.ui-page-active .pt-post-title, .ui-page-active .pt-post-textfield').val('');
    $.mobile.changePage('discussions.html');
    return false;
  });

  reset();
};

var reset = function() {
  // clear the authors
  $('.ui-page-active .pt-invitees').empty();
  // uncheck the box
  $('.ui-page-active .pt-post-checkbox').attr('checked', false);
  $('.ui-page-active .ui-icon-checkbox-on').removeClass('ui-icon-checkbox-on').addClass('ui-icon-checkbox-off');
  $('.ui-page-active .ui-btn-active').removeClass('ui-btn-active');
  // hide autocomp field
  $('.ui-page-active .pt-post-autocomplete').hide();
  
  if (discussions.params) {
    $('.ui-page-active .pt-post-title').val(discussions.params.title);
    $('.ui-page-active .pt-post-textfield').val(discussions.params.description);
    
    delete discussions.params;
  } else {
    $('.ui-page-active .pt-post-title').val('');
    $('.ui-page-active .pt-post-textfield').val('');
  }
};

scriptCache.onPageLoad('discussions-post.html', reset);
init();
})();