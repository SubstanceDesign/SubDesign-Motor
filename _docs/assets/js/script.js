!function ($) {
  "use strict";

  // single page nav
  $('#docs_page-nav').singlePageNav({
    filter: ':not(.external)',
    currentClass: 'active',
    offset: 75
  });

  // show / hide menu
  $('.docs_page-nav_button').on('click', function() {
    if (!$('.docs_wrapper--nav-showed').length) {
      $('.docs_wrapper').addClass('docs_wrapper--nav-showed');
    } else {
      $('.docs_wrapper').removeClass('docs_wrapper--nav-showed');
    }
  })

  $(window).on('load', function() {
    // pretty print initialization
    window.prettyPrint() && prettyPrint();
  })

}(jQuery);