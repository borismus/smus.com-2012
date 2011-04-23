(function() {
  
  // display the specified recommendation
  var refresh = function() {
    // Brief timeout necessary to avoid jQM bug: 
    // https://github.com/jquery/jquery-mobile/issues#issue/450
    setTimeout(function() {
      var id = getParameterByName('id');
      // Get the discussion and author
      discussions.get(id, function(discussion) {
        authors.get(discussion.authorId, function(author) {
          var $p = $('.ui-page-active');
          $p.find('.pt-title').text(discussion.title);
          $p.find('.pt-author-image').attr('src', author.image);
          $p.find('.pt-author').text(author.name);
          $p.find('.pt-date').text(discussion.posted);
          $p.find('.pt-discuss-title').text(discussion.title);
          $p.find('.pt-discuss-body').text(discussion.body);

          $p.find('.pt-discuss-comment-header').hide();
          // Clear list
          $('.ui-page-active #pt-discuss-listview').empty();
          // Populate the listview with comments for the given discussion
          $.each(discussion.comments, function(index, comment) {
            authors.get(comment.authorId, function(author) {
              $('<li>' +
                  '<img class="pt-authorpic" src="' + author.image + '" />' +
                  '<h3><a href="">' + author.name + '</a></h3>' +
                  '<p>' + comment.comment + ' <br/>Posted ' + comment.posted + '</p>' +
                '</li>').appendTo('.ui-page-active #pt-discuss-listview');
              $p.find('.pt-discuss-comment-header').show();
            });
          });
          $('.ui-page-active #pt-discuss-listview').listview('refresh');

          // Make it possible to comment in the textarea
          $p.find('.pt-discuss-comment').unbind('submit').submit(function() {
            // Get the comment body
            var body = $(this).find('textarea').val();
            // Clear the comment field
            $(this).find('textarea').val('');
            postComment(body, discussion);
            return false;
          });
        });
      });
    }, 50);
  };
  
  var postComment = function(body, discussion) {
    discussion.comments.push({
      authorId: currentAuthorId,
      comment: body,
      posted: (new Date()).toString()
    });
    refresh();
  };
  
  // whenever this page is loaded, call init
  scriptCache.onPageLoad('discussions-item.html', refresh);
  // call init the first time it's loaded too
  refresh();
})();