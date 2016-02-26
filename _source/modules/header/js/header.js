/*********************************************** 
   Header
***********************************************/

(function() {

  var m_header = motor('.header');

  if (m_header.elems.length) {
    
    /* Set sticky height
    ***********************************************/
    var headerOffset = 0,
        scrollTop;

    motor(motor.window).addListener('scroll', function() {
      scrollTop = ( motor.window.pageYOffset !== undefined ) ? motor.window.pageYOffset :  motor.html.scrollTop;

      if (scrollTop > headerOffset) {
        m_header.addClass('header--sticked');
        setMobileNavMaxHeight();
      } else {
        m_header.removeClass('header--sticked');
        setMobileNavMaxHeight();
      }
    })

    /* Set sticky height
    ***********************************************/
    var m_headerShowNav = motor(document.querySelectorAll('.header_show-nav')),
        m_headerNav = motor(document.querySelectorAll('.header_nav')),
        m_headerNavLi = motor(document.querySelectorAll('.header_nav li')),
        m_headerNavSubs = motor(document.querySelectorAll('.header_nav > ul > li ul'));

    function hideNav() {  
      m_headerShowNav.removeClass('active');
      m_headerNav.removeClass('active');
      m_headerNavSubs.removeClass('active');
      m_headerNavLi.removeClass('active')
    }

    // fix for ios vh bug
    function setMobileNavMaxHeight() {
      var wh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      m_headerNav.elems[0].style.maxHeight = motor.getWindowHeight() - m_header.elems[0].offsetTop - m_headerNav.elems[0].offsetTop + 'px';
    }

    m_headerShowNav.addListener('click', function(event) {
      event.preventDefault();

      if (m_headerShowNav.hasClass('active')) {
        hideNav();
      } else {
        m_headerShowNav.addClass('active');
        m_headerNav.addClass('active');
      }
    })

    var headerWidth = m_header.elems[0].offsetWidth;
    motor(motor.window).addListener('resize', function() {
      setMobileNavMaxHeight();

      if (headerWidth != m_header.elems[0].offsetWidth) {
        hideNav();
        headerWidth = m_header.elems[0].offsetWidth;
      }
    })

    // Mobile menu mechanic
    motor('.header_nav a').addListener('click', function(event) {
      // check if has submenu
      if ( this.parentNode.querySelectorAll('ul').length ) {

        event.preventDefault();
        event.stopPropagation();

        var m_parentLi = motor(this.parentNode);
        
        if ( m_parentLi.hasClass('active') ) {
          m_parentLi.removeClass('active');
          m_parentLi.find('li.active', true).removeClass('active');
        } else {
          m_parentLi.siblings('li.active', true).find('li.active', true).removeClass('active');
          m_parentLi.siblings('li.active', true).removeClass('active');
          m_parentLi.addClass('active');
        }
      }
    })

    // Hide menu on click outside
    motor(document).addListener('click', function(event) {
      if (!motor(event.target).parentUntil('.header').length) {
        hideNav();
      }
    });

    motor(document).addListener('touchstart', function(event) {
      if (!motor(event.target).parentUntil('.header').length) {
        hideNav();
      }
    });

  }

})();

