function getParameterByName( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var HN_POSTS = 'http://api.ihackernews.com/page?format=jsonp&callback=?';
var HN_POST = 'http://api.ihackernews.com/post/{0}/?format=jsonp&callback=?';

var scriptCache = new ScriptCache();

function error() {
}

$(document).ready(function() {
  document.addEventListener('deviceready', function() { 
    window.plugins.webintent.getExtra(WebIntent.EXTRA_TEXT, function(url) {
      window.plugins.webintent.getExtra(WebIntent.EXTRA_SUBJECT, function(title) {
        window.location.href = 'http://news.ycombinator.com/submitlink' + 
        	'?u=' + escape(url) + '&t=' + escape(title);
      }, error);
    }, error);
      
  }, false);

  refresh();
});

function refresh() {
  $.mobile.pageLoading();
  $('#news').empty();
  // on initialization, make a JSONP call to the HN API
  $.getJSON(HN_POSTS, function(data) {
    
    // from each item, make an entry in the list
    $.each(data.items, function(index, item) {
      var url = 'item.html?id=' + item.id;
      var title = '<h3><a href="' + url + '">' + item.title + '</a></h3>';
      var subtitle = '<p>' + item.points + ' points by <strong>' + item.postedBy + '</strong> ' + item.postedAgo + '</p>';
      var count = '<p class="ui-li-count">' + item.commentCount + '</p>';
      var item = '<li>' + title + subtitle + count + '</li>';
      $('#news').append(item);
    });
    
    $('#news').listview("refresh");
    $.mobile.pageLoading('false');
  });
}

function share() {
  var extras = {};
  extras[WebIntent.EXTRA_TEXT] = 'body';
  window.plugins.webintent.startActivity({
    action: WebIntent.ACTION_SEND,
    type: 'text/plain',
    extras: extras
  }, function() {alert('yay');}, function() {alert('noo');});
}