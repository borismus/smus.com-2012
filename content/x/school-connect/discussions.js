(function() {
  
  var redraw = function() {
    $("#discussions [data-role='category-filter']").siblings().remove();
    discussions.each(function(index, item) {
      authors.get(item.authorId, function(author) {
        $('<li data-category="' + item.type + '">' +
            '<img src="' + author.image + '" />' +
            '<h3><a href="discussions-item.html?id=' + item.id + '"></a>' + item.title + '</h3>' +
            '<p>Started by ' + author.name  + ' - ' + item.comments.length + ' comments</p>' +
        '</li>').appendTo('#discussions');
      });
    });
    
    $('#discussions').listview('refresh');
  };
  
  // expose discussion redraw
  redrawDiscussions = redraw;
  
  // whenever this page is loaded, call init
  scriptCache.onPageLoad('discussions.html', redraw);
  // call init the first time it's loaded too
  // setTimeout(redraw, 500);
  redraw();
  // hide badge
   $('#pt-home .pt-badge-discussions').css("visibility", "hidden");
})();