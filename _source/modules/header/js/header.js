/*********************************************** 
   Header
***********************************************/

(function() {

  var header = motor('.header');

  if (header.elems.length) {
    
    // Set sticky state
    var headerOffset = 0,
        scrollTop;

    motor.window.addEventListener('scroll', function() {
      scrollTop = ( motor.window.pageYOffset !== undefined ) ? motor.window.pageYOffset :  motor.html.scrollTop;

      if (scrollTop > headerOffset) {
        header.addClass('header--sticked');
      } else {
        header.removeClass('header--sticked');
      }
    })

    
  }

})();

