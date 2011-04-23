(function() {
  
  // load fake JSON data
  var init = function() {
    // alert('calling updates.js init');
    // load the report data in JSON 
    $.getJSON('data/reports.json', function(data) {
      var reportUpdates = data.data;
      // sort the data in recent first
      reportUpdates.sort(function(a, b) {
        return new Date(b.posted) - new Date(a.posted);
      });
      reports = reportUpdates;
      // refresh the view
      redraw();
    });
  };
  
  var redraw = function() {
    var ACCORDION_FOOTER = '<div class="pt-nav" data-role="none">' +
      '<button class="pt-button pt-email"><img src="images/icon-email.png" /><div class="label">Email</div></button>' +
      '<button class="pt-button pt-sms"><img src="images/icon-sms.png"/><div class="label">SMS</div></button>' +
    '</div>';
    $.each(reports, function(index, item) {
      switch(item.type) {
        // For the case of a behaviour update
        case "behavior":
          authors.get(item.authorId, function(author){
          $('<li data-category="' + item.type + '">' +
              '<img style="padding-top: 19px; padding-left:12px;" src="images/' + (item.behavior_type == 'True' ? 'acad-behaviour-good.png' : 'acad-behaviour-bad.png') +'"/>' +
              '<div class="pt-report-title"><a href=""></a>' + item.title + '</div class="pt-report-title">' +
              '<div class="pt-report-date">' + new Date(item.posted).toDateString() + '</div>' +
              '<div class="ui-li-accordion">' + // Start of accordion
                '<div class="pt-report-postedby">Posted by: ' + author.name + '</div>' +
                '<div class="pt-report-description">' + item.description + '</div>' +
                ACCORDION_FOOTER +
              '</div>' + // End of accoridan
            '</li>').appendTo('#reports').data('item', item);
            });
          break;
        // For the case of a attendance update
        case "attendance":
          $('<li data-category="' + item.type + '">' +
              '<img style="padding-top: 19px; padding-left:12px;" src="images/acad-absence.png" />' +
              '<div class="pt-report-title"><a href=""></a> Unauthorized absence </div>' +
              '<dic class="pt-report-date">' + new Date(item.missed).toDateString() + '</div>' +
              '<div class="ui-li-accordion">' + // Start of accordion
                '<div class="pt-report-description">Details: The school does not have parental authorization for this absence.</div>' +
                ACCORDION_FOOTER +
              '</div>' + // End of accoridan
            '</li>').appendTo('#reports').data('item', item);
          break;
      // For the case of a gradeupdate
        case "grade":
          authors.get(item.authorId, function(author){
            $('<li class="ui-li-has-thumb" data-category="' + item.type + '">' +
            '<div class="pt-report-subject">' + item.subject + '</div>' +
            '<div class="pt-report-grade">' + item.grade + '</div>' +			  
            '<div class="pt-report-title"><a href=""></a>' + item.title + '</div>' +
            '<div class="pt-report-date">' + new Date(item.posted).toDateString() + '</div>' +
            '<div class="ui-li-accordion">' + // Start of accordion
              '<div class="pt-report-postedby">Posted by: ' + author.name + '</div>' +
              '<div class="pt-report-description">' + item.description + '</div>' +
              ACCORDION_FOOTER +
            '</div>' + // End of accoridan
            '</li>').appendTo('#reports').data('item', item);
          });
          break;
        default:
      }
    });
    
    $('<li style="text-align: center;" data-category="grade" data-theme="e"><a href="graph.html">Grade History</a></li>').appendTo('#reports');
    $('#reports').listview('refresh');
    
    // Connect SMS and email buttons
    $('#reports .pt-sms').click(function() {
      var li = $(this).closest('li');
      Android.sendSMS(li.data('item').title + ': ' + li.data('item').description);
      return false;
    });
    $('#reports .pt-email').click(function() {
      var li = $(this).closest('li');
      Android.sendEmail(li.data('item').title, li.data('item').description);
      return false;
    });
  };
  
  // whenever this page is loaded, call init
  // scriptCache.onPageLoad('item.html', refresh);
  // call init the first time it's loaded too
  init();
  // hide badge
   $('#pt-home .pt-badge-reports').css("visibility", "hidden");
})();