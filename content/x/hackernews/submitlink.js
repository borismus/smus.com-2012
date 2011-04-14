(function() {
  var init = function() {
    // Horrible delay hack due to http://goo.gl/hTB16
    setTimeout(function() {
      // When the page load, prepopulate the dialog with the URL
      var url = getParameterByName('url');
      var title = getParameterByName('title');
      $('.ui-page-active .submitlink').attr('src', 'http://news.ycombinator.com/submitlink' + 
        '?u=' + escape(url) + '&t=' + escape(title));
    }, 100);
  };

  // whenever this page is loaded, call init
  scriptCache.onPageLoad('submitlink.html', init);
  // call init the first time it's loaded too
  init();
})();