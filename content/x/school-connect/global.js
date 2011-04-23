var recentFirst = function(array) {
  array.sort(function(a, b) {
    return new Date(b.posted) - new Date(a.posted);
  });
  return array;
};

var byType = function(array) {
  var types = {};
  $.each(array, function(index, item) {
    if (types[item.type] == undefined) {
      types[item.type] = [];
    }
    types[item.type].push(item);
  });

  var output = []
  $.each(types, function(type, typeArray) {
    typeArray.sort(function(a, b) {
      return b.posted - a.posted;
    });
    output = output.concat(typeArray);
  });
  return output;
}

// Initialize globals
var events = [], reports = [];
var authors = new StorageManager('data/authors.json');
var discussions = new StorageManager('data/discussions.json', recentFirst);
var recommendations = new StorageManager('data/recommendations.json', byType);

// Set current author to Gabriela
var currentAuthorId = 6;

// Initialize scriptCache
var scriptCache = new ScriptCache();

// Utility method for parsing GET-style parameters
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

var Android = {};
Android.sendEmail = function(subject, body) {
  if (!window.plugins || !window.plugins.webintent) {
    alert('Unable to find webintent plugin');
    return false;
  }
  var extras = {};
  extras[WebIntent.EXTRA_SUBJECT] = subject;
  extras[WebIntent.EXTRA_TEXT] = body;
  window.plugins.webintent.startActivity({
    action: WebIntent.ACTION_SEND,
    type: 'text/plain',
    extras: extras
  }, function() {}, function() {alert('Failed to send email via Android Intent');});
};

Android.sendSMS = function(message) {
  if (!window.plugins || !window.plugins.webintent) {
    alert('Unable to find webintent plugin');
    return false;
  }
  var extras = {};
  extras['sms_body'] = message;
  window.plugins.webintent.startActivity({
    action: WebIntent.ACTION_VIEW,
    type: 'vnd.android-dir/mms-sms',
    extras: extras
  }, function() {}, function() {alert('Failed to send SMS via Android Intent');});
};

Android.addCalendar = function(title, description, beginTime, endTime, location) {
  if (!window.plugins || !window.plugins.webintent) {
    alert('Unable to find webintent plugin');
    return false;
  }
  var extras = {};
  extras['title'] = title;
  extras['description'] = description;
  extras['beginTime'] = beginTime;
  extras['endTime'] = endTime;
  extras['location'] = location;
  window.plugins.webintent.startActivity({
    action: WebIntent.ACTION_EDIT,
    type: 'vnd.android.cursor.item/event',
    extras: extras
  }, function() {}, function() {alert('Failed to add to calendar via Android Intent');});
};

Android.openUrl = function(url) {
  if (!window.plugins || !window.plugins.webintent) {
    alert('Unable to find webintent plugin');
    return false;
  }
  var extras = {};
  extras[WebIntent.EXTRA_SUBJECT] = 'body';
  extras[WebIntent.EXTRA_TEXT] = 'body';
  window.plugins.webintent.startActivity({
    action: WebIntent.ACTION_SEND,
    type: 'text/plain',
    extras: extras
  }, function() {}, function() {alert('Failed to open URL via Android Intent');});
};

Android.showMap = function(address) {
  if (!window.plugins || !window.plugins.webintent) {
    alert('Unable to find webintent plugin');
    return false;
  }
  // geo:0,0?q=my+street+address
  window.plugins.webintent.startActivity({
    action: WebIntent.ACTION_VIEW,
    url: 'geo:0,0?q=' + address,
  }, function() {}, function() {alert('Failed to open URL via Android Intent');});
};

// $.mobile.changePage doesn't like arguments
var changePage = function(page) {
  // Remove everything after index.html# and append page.
  var url = window.location.href;
  var hashIndex = url.indexOf('#');
  if (hashIndex != -1) {
    // If there's a hash in the URL, remove everything after it
    url = url.substr(0, hashIndex + 1);
  }
  window.location.href = url + page;
};

var sameDay = function(date1, date2) {
  if (date1 == null || date2 == null) { 
    return false;
  }
  return date1.getYear() == date2.getYear() && 
         date1.getMonth() == date2.getMonth() && 
         date1.getDate() == date2.getDate();
};
