(function() {
  var init = function() {
    // Horrible delay hack due to http://goo.gl/hTB16
    setTimeout(function() {
      var id = getParameterByName('id');
      if (init.isLoaded[id] == true) {
        return;
      }
      $.mobile.pageLoading();
      load(id, function() {
        $.mobile.pageLoading('false');
        init.isLoaded[id] = true;
      });
    }, 50);
  };
  init.isLoaded = {};
  
  var stripHtml = function(str) {
    var re = /<\S[^><]*>/g;
    // var re = /<\/?(^a|font)[^><]*>/g;
    return str.replace(re, "");
  };
  
  var renderComment = function(item, depth) {
    var $comments = $('.ui-page-active .comments').append(
      '<li style="padding-left: ' + depth * 4 + '%;">' +
        '<p><a href="#reply.html?id=' + item.id + '">' + stripHtml(item.comment) + '</a></p>' +
        '<p>' + item.points + ' points by <strong>' + item.postedBy + '</strong> ' + item.postedAgo + '</p>' +
      '</li>');
    $.each(item.children, function(index, subitem) {
      renderComment(subitem, depth + 1);
    });
  };
  
  var load = function(id, callback) {
    var url = HN_POST.replace('{0}', id);
    var $comments = $('.ui-page-active .comments');
    $comments.empty();
    $.getJSON(url, function(data) {
      // Set the title
      $('.ui-page-active .title').text(data.title);
      
      // Set the link to reflect the article
      $('.ui-page-active .link').attr('href', data.url);
      
      // Set the link to reflect the article
      $('.ui-page-active .submit').attr('action', 'reply.html?id=' + data.id);
      
      var content = $('.ui-page-active .info');
      var text = '<p>' + (data.text ? data.text : data.title) + '</p>';
      var attribution = '<p>' + data.points + ' points by <strong>' + data.postedBy + '</strong> ' + 
        data.postedAgo + '.</p>';
      var comments = data.commentCount ? '<p>Showing ' + data.commentCount + ' comments:</p>' : '';
      content.html(text + attribution + comments);
      
      // load comments for page
      $.each(data.comments, function(index, item) {
        renderComment(item, 0);
      });
      
      $comments.listview("refresh");
      callback();
    });
  };
  
  // whenever this page is loaded, call init
  scriptCache.onPageLoad('item.html', init);
  // call init the first time it's loaded too
  init();
})();