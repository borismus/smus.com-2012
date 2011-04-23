(function() {

  // display the specified recommendation
  var refresh = function() {
    // Brief timeout necessary to avoid jQM bug: 
    // https://github.com/jquery/jquery-mobile/issues#issue/450
    setTimeout(function() {
      var id = getParameterByName('id');
      // Get the recommendation
      recommendations.get(id, function(rec) {
	authors.get(rec.authorId, function(author) {
	  // Populate the view with data from it
	  $('.pt-authorpic').attr('src', author.image);
	  $('.pt-author').text(author.name);
	});
	$('.pt-date').text();
	$('.pt-rec-details h3').text(rec.title);
	
	if (rec.discussionId > -1) {
	  discussions.get(rec.discussionId, function(discussion) {
	    $('.pt-rec-disc').text('in discussion, ' + discussion.comments.length + ' comments');
	  });
	}
	$('.pt-rec-image').attr('src', rec.image);
	$('.pt-rec-address').text(rec.address ? rec.address : "");
	$('.pt-rec-url').text(rec.url ? rec.url : "").attr('href', rec.url ? rec.url : "");
	$('.pt-rec-more').text(rec.description);
	$('.pt-rec-title').text(rec.title);
	
	// Send email on Android
	$('.pt-rec-button-email').click(function() {
	  Android.sendEmail(rec.title, rec.description);
	  return false;
	});
	$('.pt-rec-button-map').click(function() {
	  if (rec.address) {
  	  Android.showMap(rec.address);
	  } else {
	    alert('No map found for this recommendation.');
	  }
	  return false;
	});
	$('.pt-rec-button-sms').click(function() {
	  Android.sendSMS(rec.title + ': ' + rec.description);
	  return false;
	});
	$('.pt-rec-button-discuss').click(function() {
	  if (rec.discussionId != '-1') {
	    changePage('discussions-item.html?id=' + rec.discussionId);
	  } else {
	    discussions.params = {
        title: rec.title,
        description: rec.description
      };
	    changePage('discussions-post.html');
	  }
	  return false;
	});
      });
        
    }, 50);
  };
  // whenever this page is loaded, call init
  scriptCache.onPageLoad('recommendations-item.html', refresh);
  // call init the first time it's loaded too
  refresh();
})();
