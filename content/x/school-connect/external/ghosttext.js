
/* Copyright (c) 2009 Jon Rohan (http://dinnermint.org)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.0.0
 * Written with jQuery 1.3.2
 */
(function($){$.fn.ghostText = function() {
  return this.each(function(){
    var text = $(this).attr("placeholder");
    if(text!=""&&($(this).val()==""||$(this).val()==text)) {
      $(this).addClass("disabled");
      $(this).val(text);
      $(this).focus(function(){
        $(this).removeClass("disabled");
        if($(this).val()==text) {
          $(this).val("");
        }
      });
      $(this).blur(function(){
        if($(this).val()=="") {
          $(this).val(text);
          $(this).addClass("disabled");
        }
      });
    }
  });
};})(jQuery);