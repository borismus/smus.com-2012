// Whenever <page>.html is loaded, this cache loads <page>.js

function ScriptCache() {
  this.cache = {};
  
  var scriptCache = this;
  // Cause the external javascript to be loaded alongside the HTML
  $('[data-role=page]').live('pageshow', function(event) {
    var pageName = event.target.id;

    // pageName might have some ? parameters tagged on. If so, remove the argument
    var questionIndex = pageName.indexOf('?');
    if (questionIndex != -1) {
      pageName = pageName.substr(0, questionIndex);
    }
    if (pageName == '') {
      return;
    }
    var jsName = pageName.replace(/\.[^\.]*$/,'') + '.js';
    scriptCache.load(jsName);
  });
};

// Actually load the javascript (if not yet loaded) and cache it.
ScriptCache.prototype.load = function(src) {
  var cache = this.cache;
  if (cache[src] != undefined) {
    // the script has already been loaded. don't load it again!
    return;
  }
  $.ajax({
    dataType: 'script',
    async: false,
    cache: true,
    url: src,
    success: function() {
      cache[src] = true;
    }
  });
};

// A way of registering a callback whenever the page loads. 
// Each page has to do this for its own init method.
ScriptCache.prototype.onPageLoad = function(page, callback) {
  $('[data-role=page]').live('pageshow', function(event) {
    if (event.target.id.indexOf(page) == 0) {
      callback();
    }
  });
};