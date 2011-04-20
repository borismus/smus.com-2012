$(function() {

  // Enable navbar funkiness
  $('nav .icons img').mouseover(function() {
    var className = $(this).attr('class');
    console.log('hover on img. className ' + className);
    // Hide all messages, only show the one corresponding to the className
    $('nav .message > *').hide();
    $('nav .message .' + className).show();
  });

  // Make the navbar persist if we scroll far enough
  offsetTop = 325;
  $(window).scroll(function() {
    if ($(this).scrollTop() > offsetTop) {
      $('nav').addClass('fix');
    } else {
      $('nav').removeClass('fix');
    }
  });

  // Format relative dates
  $('.date .relative').timeago();

  // Highlight code
  hljs.tabReplace = '    ';
  hljs.initHighlightingOnLoad();
});
