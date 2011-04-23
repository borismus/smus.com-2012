(function() {
  
  // load fake JSON data
  var init = function() {
    // alert('calling updates.js init');
    // load the event data in JSON 
    $.getJSON('data/events.json', function(data) {
      var eventUpdates = data.data;
      // sort the data in recent first
      eventUpdates.sort(function(a, b) {
        return new Date(b.posted) - new Date(a.posted);
      });
      events = eventUpdates;
      // refresh the view
      redraw();
    });
  }; 
  
  var redraw = function() {
    // keep track of last date
    var lastDate = null;
    $.each(events, function(index, item) {
      var author = authors[item.authorId];
      var date = new Date(item.when);
      // if date changed, output a header
      if (!sameDay(date, lastDate)) {
       $('<li data-role="list-divider" data-dividertheme="e">' + date.toDateString() + '</li>').appendTo('#events');
      }
      var discussionString = "";
      if (item.discussionId != -1) {
        discussions.get(item.discussionId, function(discussion) {
          discussionString = "In discussion with " + discussion.comments.length + ' comments';
        });
      }
      $('<li>' +
          '<h3><a href=""></a>' + item.title + '</h3>' +
          '<p>' + discussionString + '</p>' +
          
          
          '<div class="ui-li-accordion"  data-role="none" >' + 
            '<div class="pt-event-desc">' + item.description + '</div>'+
            '<div class="pt-event-when">When: ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + '</div>'+
            '<div class="pt-event-where">Where: ' + item.where + '</div>' +
             
            '<div class="pt-nav">' + // Style of bottom banner
            
            '<button class="pt-button-4view pt-calendar">' +
            '<img src="images/icon-sync.png" />'   +
            '<div class="label">Cal Sync</div>' +
            '</button>' +           
            
            '<button class="pt-button-4view pt-email">' + 
            '<img src="images/icon-email.png"/>' +
            '<div class="label">Email</div>' +
            '</button>' +
            
            '<button class="pt-button-4view pt-sms">' +
            '<img src="images/icon-sms.png" />'   +
            '<div class="label">SMS</div>' +
            '</button>' +           
            
            '<button class="pt-button-4view pt-discuss">' + 
            '<img src="images/icon-discuss.png"/>' +
            '<div class="label">Discuss</div>' +
            '</button>' + 
          
                  '</div>' +
             
    
         	      	
          '</div>' +
          
          
          '</li>').appendTo('#events').data('item', item);
      	lastDate = date;


    });
    
    $('#events').listview('refresh');
    // Hack: remove all thumb classes
    $('.ui-page-active .ui-li-has-thumb').removeClass('ui-li-has-thumb');
    
    // Link events
    $('#events .pt-calendar').click(function() {
      var li = $(this).closest('li');
      var item = li.data('item');
      Android.addCalendar(item.title, item.description, new Date(item.when).getTime(), null, item.where);
      return false;
    });
    $('#events .pt-email').click(function() {
      var li = $(this).closest('li');
      Android.sendEmail(li.data('item').title, li.data('item').where);
      return false;
    });
    $('#events .pt-sms').click(function() {
      var li = $(this).closest('li');
      Android.sendSMS(li.data('item').title + ': ' + li.data('item').description);
      return false;
    });
    $('#events .pt-discuss').click(function() {
      var li = $(this).closest('li');
      var item = li.data('item');
      var discussionId = item.discussionId;
      if (discussionId != '-1') {
        changePage('discussions-item.html?id=' + discussionId);
      } else {
        discussions.params = {
          title: item.title,
          description: item.description
        };
        changePage('discussions-post.html');
      }
      return false;
    });
  };
  
  // whenever this page is loaded, call init
  // scriptCache.onPageLoad('item.html', refresh);
  // call init the first time it's loaded too
  init();
  // hide badge
   $('#pt-home .pt-badge-events').css("visibility", "hidden");
})();