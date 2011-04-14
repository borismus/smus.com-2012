(function() {
  var init = function() {
    // Horrible delay hack due to http://goo.gl/hTB16
    setTimeout(function() {
      // When the page load, prepopulate the dialog with the URL
      var id = getParameterByName('id');
      $('.ui-page-active .reply').attr('src', 'http://news.ycombinator.com/reply?id=' + id);
    }, 100);
  };

  // whenever this page is loaded, call init
  scriptCache.onPageLoad('reply.html', init);
  // call init the first time it's loaded too
  init();
})();