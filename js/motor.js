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

})();;/*********************************************** 
    Autoresize plugin for textarea
***********************************************/

(function() {

  /* textarea with autoresize constructor
  ***********************************************/
  motor.textareaAutoresize = function( elem, options ) {
    var inst = this;

        inst.textarea = elem,
        inst.opts = {
          maxHeight: false, // height limit
          updateOnResize: true // update textarea height on windows resize
        },
        inst.limited = false; // reach height limit flag

    // set autoresize state style
    motor.addClass( inst.textarea, 'autoresize' );
     
    // integrate custom options
    for ( var option in options ) {
      inst.opts[option] = options[option];
    }

    // extend data attribute options
    inst.opts = motor.extendDataOptions( inst.textarea, inst.opts, 'data-textarea-autoresize-' );

    // create events
    var eventInit = document.createEvent('Event'),
        eventResize = document.createEvent('Event');

    eventInit.initEvent('textarea-autoresize-init', true, true);
    eventResize.initEvent('textarea-autoresize-resize', true, true);

    // get outer height difference
    inst.getOuterDiff = function() {
      var outerDiff = {};
      
      // check box sizing setting and calculate outer difference
      if (motor.getComputedStyle( inst.textarea, 'boxSizing' ) == 'border-box') {
        outerDiff.vertical = parseFloat( motor.getComputedStyle( inst.textarea, 'borderTopWidth' ), 10 ) + parseFloat( motor.getComputedStyle( inst.textarea, 'borderBottomWidth' ), 10);
        outerDiff.horizontal = parseFloat( motor.getComputedStyle( inst.textarea, 'borderLeftWidth' ), 10 ) + parseFloat( motor.getComputedStyle( inst.textarea, 'borderRightWidth' ), 10);
      } else {
        outerDiff.vertical = - ( parseFloat( motor.getComputedStyle( inst.textarea, 'paddingTop' ), 10 ) + parseFloat( motor.getComputedStyle( inst.textarea, 'paddingBottom' ), 10 ) );
        outerDiff.horizontal = - ( parseFloat( motor.getComputedStyle( inst.textarea, 'paddingLeft' ), 10 ) + parseFloat( motor.getComputedStyle( inst.textarea, 'paddingRight' ), 10 ) );
      }

      return outerDiff;
    }

    inst.updateHeight = function(test) {

      // duplicate content and width to clone
      inst.shadowTextarea.value = inst.textarea.value;
      inst.shadowTextarea.style.width = inst.textarea.clientWidth + inst.outerDiff.horizontal + 'px';

      // check if overflowen
      if ( inst.textarea.clientHeight < inst.textarea.scrollHeight ) {

        if (!inst.limited) {
          var newHeight = inst.shadowTextarea.scrollHeight + inst.outerDiff.vertical;

          // check if reaches height limit
          if ( newHeight > inst.opts.maxHeight ) {
            inst.limited = true;
            motor.addClass( inst.textarea, 'limited' );
          } else {
            // increase size
            inst.textarea.style.height = newHeight + 'px';
            
            // dispatch plugin resize event
            inst.textarea.dispatchEvent(eventResize);
          }
        }

      } else {

        // check if greater than initial height
        if ( inst.textarea.clientHeight > inst.shadowTextarea.scrollHeight + inst.outerDiff.vertical ) {

          // decrease size
          inst.textarea.style.height = inst.shadowTextarea.scrollHeight + inst.outerDiff.vertical + 'px';

          // remove limited state
          inst.limited = false;
          motor.removeClass( inst.textarea, 'limited' );

          // dispatch plugin resize event
          inst.textarea.dispatchEvent(eventResize);
        }
      
      }
    }

    // create clone of textarea to check overlow
    inst.shadowTextarea = inst.textarea.cloneNode();
    inst.shadowTextarea.style.transition = 'none';
    inst.shadowTextarea.style.WebkitTransition = 'none';
    inst.shadowTextarea.style.MozTransition = 'none';
    inst.shadowTextarea.setAttribute( 'style', 'position: absolute; bottom: 0; z-index: -1; visibility: hidden;');
    document.body.appendChild(inst.shadowTextarea);

    // save outer height difference
    inst.outerDiff = inst.getOuterDiff();

    // listen to keyup event that can change textarea size
    inst.textarea.addEventListener( 'keyup', function() {
      inst.updateHeight();
    });

    // update on window resize
    if ( inst.opts.updateOnResize ) {
      inst.updateHeightThrottled = motor.throttle( inst.updateHeight, 10 );
      window.addEventListener( 'resize', function() {
        inst.updateHeightThrottled();
      });
    }

    // dispatch plugin init event
    inst.textarea.dispatchEvent(eventInit);
  };

  // auto init for [data-textarea-autoresize]
  var autoinitElements = document.querySelectorAll('[data-textarea-autoresize]');

  for ( var i = 0; i < autoinitElements.length; i++ ) {
    new motor.textareaAutoresize(autoinitElements[i]);
  }

})();;/*********************************************** 
    Layout scripts
***********************************************/

(function() {

  // remove no-js class from html and set js
  motor.removeClass( motor.html, 'no-js' );
  motor.addClass( motor.html, 'js' );
})();