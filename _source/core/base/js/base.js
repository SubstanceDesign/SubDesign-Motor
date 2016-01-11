/*********************************************** 
    Base scripts
***********************************************/

(function() {

  /* Base framework object with functions and usefull properties
  ***********************************************/
  window.motor = {
    // caching often usable nodes
    window: window,
    body: document.body,
    html: document.documentElement,

    // add Class to node
    addClass: function( elem, className ) {
      if (elem.className.search(className) == '-1') {
        elem.className = elem.className ? elem.className + ' ' + className : className;
      }
    },

    // remove Class from node
    removeClass: function( elem, className ) {
      var classPattern = '(^|\\s)' + className,
          re = new RegExp( classPattern, 'g' );
      elem.className = elem.className.replace( re, '' );
    },

    // get computed style crossbrowser
    getComputedStyle: function( elem, prop ) {
      return window.getComputedStyle ? getComputedStyle(elem)[prop] : elem.currentStyle[prop];
    },

    // extend data attributes into object
    extendDataOptions: function( elem, options, prefix ) {
      for ( var option in options ) {

        var optionHyphen = option.split(/(?=[A-Z])/).join('-'),
            optionInData = elem.getAttribute(prefix + optionHyphen);

        if ( !!optionInData )
          options[option] = optionInData;
      }

      return options;
    },

    // debounce function decorator
    debounce : function( fn, timeout ) {
      var prevent = false;  

      return function() {
        if (prevent) 
          return;

        fn.apply( this, arguments );
        prevent = true;

        setTimeout( function() { 
          prevent = false 
        }, timeout );
      }
    },

    // throttle function decorator
    throttle : function( fn, timeout ) {
      var call, 
          timer = 0,
          latestArgs,
          latestCtx;  

      function caller() {
        if (call) {
          fn.apply( latestCtx, latestArgs );
          call = false;
          timer = setTimeout( caller, timeout );
        } else {
          timer = 0;
        } 
      }

      return function() {
        call = true,
        latestArgs = arguments,
        latestCtx = this;

        if (!timer) {
          caller();
        }
      }
    }

  };

})();