(function() {
    
  var redraw = function() {
    $("#recommendations [data-role='category-filter']").siblings().remove();
    var lastType = null;
    recommendations.each(function(index, item) {
      authors.get(item.authorId, function(author) {
        var type = item.type;
        if (type != lastType) {
          $('<li data-role="list-divider">' + item.type + '</li>').appendTo('#recommendations');
        }
        $('<li data-category="' + item.category + '">' +
            '<h3><a href="recommendations-item.html?id=' + item.id + '"></a>' + item.title + '</h3>' +
            '<p>' + item.description + '</p>' +
            '<p>From ' + author.name + '</p>' +
        '</li>').appendTo('#recommendations');
        lastType = type;
      });

    });
    
    $('#recommendations').listview('refresh');
  };
  
  // expose recommendation redraw
  redrawRecommendations = redraw;
  
  // whenever this page is loaded, call init
  scriptCache.onPageLoad('recommendations.html', redraw);
  // call init the first time it's loaded too
  redraw();
  
  // hide badge
   $('#pt-home .pt-badge-recommendations').css("visibility", "hidden");
})();
