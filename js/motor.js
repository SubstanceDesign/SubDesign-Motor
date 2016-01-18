/*********************************************** 
    Base scripts
***********************************************/

(function() {

  /* Base framework object with functions and usefull properties
  ***********************************************/
  window.motor = {
    // caching often usable nodes
    window: window,
    windowWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    windowHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    body: document.body,
    html: document.documentElement,

    // add class to node
    addClass: function( elem, className ) {
      if ( elem.className.search(className) == '-1' ) {
        elem.className = elem.className ? elem.className + ' ' + className : className;
      }
    },

    // remove class from node
    removeClass: function( elem, className ) {
      var classPattern = '(^|\\s)' + className,
          re = new RegExp( classPattern, 'g' );
      elem.className = elem.className.replace( re, '' );
    },

    // check if node has a class
    hasClass: function( elem, className ) {
      var classes = elem.className.split(' ');
      for ( var i = 0; i < classes.length; i++ ) {
        if ( classes[i] == className )
          return true
      }
      return false
    },

    // get crossbrowser window width
    getWindowWidth: function() {
      return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    },

    // get crossbrowser window height
    getWindowHeight: function() {
      return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    },

    // get computed style crossbrowser
    getComputedStyle: function( elem, prop ) {
      return window.getComputedStyle ? getComputedStyle(elem)[prop] : elem.currentStyle[prop];
    },

    // get parent until
    parentUntil: function( elem, selector ) {
      var current = elem.parentNode;
      while( current && !current.querySelectorAll(selector) ) {
        current = current.parentNode;
      }
      return current.querySelectorAll(selector);
    },

    // Event feature methods
    Event: (function() {
      var handlerList = 0
        
      // fix event object
      function fixEvent(event) {
        event = event || window.event;
      
        // check already fixed flag
        if (event.isFixed) {
          return event;
        }
        event.isFixed = true;
      
        // add preventDefault an stopPropagation methods
        event.preventDefault = event.preventDefault || function() { this.returnValue = false };
        event.stopPropagation = event.stopPropagaton || function() { this.cancelBubble = true };
        
        // add event.target property
        if (!event.target) {
          event.target = event.srcElement;
        }
      
        // add relatedTarget property
        if ( !event.relatedTarget && event.fromElement ) {
          event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
        }
      
        // add pageX and pageY properties
        if ( event.pageX == null && event.clientX != null ) {
          event.pageX = event.clientX + (motor.html && motor.html.scrollLeft || motor.body && motor.body.scrollLeft || 0) - (motor.html.clientLeft || 0);
          event.pageY = event.clientY + (motor.html && motor.html.scrollTop || motor.body && motor.body.scrollTop || 0) - (motor.html.clientTop || 0);
        }
      
        // add which property
        if ( !event.which && event.button ) {
          event.which = ( event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ) );
        }
      
        return event;
      }; 
      
      // normalize handler function
      function commonHandle(event) {
        // return if window resize event fired without actial window resize
        if ( event.type == 'resize' && motor.getWindowWidth() == motor.windowWidth && motor.getWindowHeight() == motor.windowHeight )
          return;
        else {
          motor.windowWidth = motor.getWindowWidth();
          motor.windowHeight = motor.getWindowHeight();
        }

        // fix event object
        event = fixEvent(event);
        
        // get handlers of current type
        var handlers = this.events[event.type];

        for ( var i in handlers ) {
          var handler = handlers[i],
              returned = handler.call( this, event ); // cal handler in this context

          if ( returned === false ) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      };
      
      return {
        // add event listener
        addListener: function( elem, eventName, eventHandler ) {

          // check if elem is actually window
          if ( elem.setInterval && ( elem != window && !elem.frameElement ) ) {
            elem = window;
          }
          
          // register handler id
          if (!eventHandler.handlerId) {
            eventHandler.handlerId = ++handlerList;
          }
          
          // create event property and write in fixed handler
          if (!elem.events) {
            elem.events = {}
            elem.handle = function(event) {
              if ( typeof Event !== 'undefined' ) {
                return commonHandle.call( elem, event )
              }
            }
          }
        
          // bind event if haven't bind yet
          if (!elem.events[eventName]) {
            elem.events[eventName] = {}        
          
            if (elem.addEventListener)
              elem.addEventListener( eventName, elem.handle, false );
            else if (elem.attachEvent)
              elem.attachEvent( 'on' + eventName, elem.handle );
          }
          
          // add handler to corresponding event
          elem.events[eventName][eventHandler.handlerId] = eventHandler;
        },
        
        removeListener: function(elem, eventName, eventHandler) {
          // get if event handlers added
          var handlers = elem.events && elem.events[eventName];
          
          if (!handlers) return;
          
          delete handlers[eventHandler.handlerId];
          
          for( var any in handlers ) return;

          if (elem.removeEventListener)
            elem.removeEventListener(eventName, elem.handle, false);
          else if (elem.detachEvent)
            elem.detachEvent("on" + eventName, elem.handle);
          
          delete elem.events[eventName];
        
          for ( var any in elem.events ) return;
          
          try {
            delete elem.handle;
            delete elem.events;
          } catch(e) { // IE
            elem.removeAttribute('handle');
            elem.removeAttribute('events');
          }
        } 
      }
    }()),

    // create event
    createCustomEvent: function( eventName ) {
      var event = false;

      // check feature support
      if (typeof Event === 'function') {
        event = new Event(eventName);
      } else if ( !!document.createEvent ) {
        event = document.createEvent('Event');
        event.initEvent( eventName, true, true );
      }
        
      return event;
    },

    // add custom event listener
    addCustomEventListener: function( elem, eventName, eventHandler ) {
      // check feature support
      if (!elem.addEventListener) {
        // create event property if not exist
        if (!elem[eventName]) {
          elem[eventName] = 0;
        }

        // call handler if corresponing property changed
        elem.attachEvent( 'onpropertychange', function (event) {
          if ( event.propertyName == eventName ) {
            eventHandler(event);
          }
        });
      } else {
        elem.addEventListener( eventName, eventHandler );
      }
    },

    // dispatch custom event
    dispatchCustomEvent: function( elem, event, eventName, bubble ) {
      // check feature support
      if (!elem.dispatchEvent) {
        bubble = !bubble ? false : true; // check if bubble defined and set default value

        if ( elem.nodeType === 1 && elem[eventName] >= 0 ) {
          elem[eventName]++;
        }

        if ( bubble && elem !== document ) {
          motor.dispatchCustomEvent( elem.parentNode, event, eventName, bubble );
        }
      } else {
        elem.dispatchEvent(event);
      }
    },

    // extend data attributes into object
    extendDataOptions: function( elem, options, prefix ) {
      for ( var option in options ) {

        var optionHyphen = option.split(/(?=[A-Z])/).join('-'),
            optionInData = elem.getAttribute( prefix + optionHyphen );

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

/*********************************************** 
    Placeholder polyfill for old browsers
***********************************************/

(function() {

  /* placeholder constructor
  ***********************************************/
  motor.placeHolder = function(elem) {
    // check placeholder support
    if ( document.createElement('input').placeholder == undefined ) {

      var inst = this;

      // initialise placeholder on target input
      inst.initPlaceholder = function(input) {
        // input.getAttribute('placeholder');

        // add placeholder class
        motor.addClass( input, 'placeholder' );

        // check if placeholder is needed
        inst.showPlaceholder(input);

        // listen to keyup to hide or show placeholder
        input.onfocus = function() {
          inst.hidePlaceholder(input);
        };
        input.onblur = function() {
          inst.showPlaceholder(input);
        };

        // prevent submiting placeholder value
        if ( motor.parentUntil( input, 'form' ).length && !motor.hasClass( motor.parentUntil( input, 'form' )[0], 'prevent-placeholder' ) ) {
          var form = motor.parentUntil( input, 'form' )[0];

          // add class to bind handler once
          motor.addClass( form, 'prevent-placeholder' );

          // bind on submit event
          form.onsubmit = function() {
            var placeholdered = form.querySelectorAll('.placeholder'),
              // return placeholders after request was sent
              submitReturnTimeout = setTimeout( function() {
                placeholdered = form.querySelectorAll('.placeholder');
                for ( var i = 0; i < placeholdered.length; i++ ) {
                  placeholdered[i].value = input.getAttribute('placeholder');
                }
              }, 100);

            for ( var j = 0; j < placeholdered.length; j++ ) {
              placeholdered[j].value = '';
            }
          };
        }
      }

      // hide placeholder
      inst.hidePlaceholder = function(input) {
        if ( input.value == input.getAttribute('placeholder') ) {
          input.value = '';
          motor.removeClass( input, 'placeholder' );
        }
      }

      // show placeholder
      inst.showPlaceholder = function(input) {
        if ( input.value == '' ) {
          input.value = input.getAttribute('placeholder');
          motor.addClass( input, 'placeholder' );
        }
      }

      // check if the element was delivered as argument
      if (!elem) {
        // create array of items
        inst.elements = document.querySelectorAll('input[placeholder], textarea[placeholder]');

        for ( var i = 0; i < inst.elements.length; i++ ) {
          inst.initPlaceholder(inst.elements[i]);
        }
      } else {
        inst.initPlaceholder(elem);
      }

    }

  };

  // call placeholder polyfill
  motor.placeHolder();

})();

/*********************************************** 
    Autoresize plugin for textarea
***********************************************/

(function() {

  /* textarea with autoresize constructor
  ***********************************************/
  motor.TextareaAutoresize = function( elem, options ) {
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
    var eventInit = motor.createCustomEvent( 'textarea-autoresize-init' ),
        eventResize = motor.createCustomEvent( 'textarea-autoresize-resize' );

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

    inst.updateHeight = function() {

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
            motor.dispatchCustomEvent( inst.textarea, eventResize, 'textarea-autoresize-resize', true );
          }
        }

      } else {

        // check if greater than initial height
        if ( inst.textarea.clientHeight > inst.shadowTextarea.clientHeight + inst.outerDiff.vertical ) {

          var newHeight = inst.shadowTextarea.scrollHeight + inst.outerDiff.vertical < inst.shadowTextarea.clientHeight + inst.outerDiff.vertical ? inst.shadowTextarea.clientHeight + inst.outerDiff.vertical : inst.shadowTextarea.scrollHeight + inst.outerDiff.vertical;

          // decrease size
          inst.textarea.style.height = newHeight + 'px';

          // remove limited state
          inst.limited = false;
          motor.removeClass( inst.textarea, 'limited' );

          // dispatch plugin resize event
          motor.dispatchCustomEvent( inst.textarea, eventResize, 'textarea-autoresize-resize', true );
        }
      
      }
    }

    // create clone of textarea to check overlow
    inst.shadowTextarea = inst.textarea.cloneNode();
    inst.shadowTextarea.style.transition = 'none';
    inst.shadowTextarea.style.WebkitTransition = 'none';
    inst.shadowTextarea.style.MozTransition = 'none';
    inst.shadowTextarea.setAttribute( 'style', 'position: absolute; bottom: 0; z-index: -1; visibility: hidden;');
    motor.addClass( inst.shadowTextarea, 'clone' );
    document.body.appendChild(inst.shadowTextarea);

    // save outer height difference
    inst.outerDiff = inst.getOuterDiff();

    // update height in case of cache content
    inst.updateHeight();

    // listen to keyup event that can change textarea size
    inst.textarea.onkeyup = function() {
      inst.updateHeight();
    }

    // update on window resize
    if ( inst.opts.updateOnResize ) {
      inst.updateHeightThrottled = motor.throttle( inst.updateHeight, 10 );

      motor.Event.addListener( window, 'resize', function() {
        inst.updateHeightThrottled();
      } );
    }

    // dispatch plugin init event
    motor.dispatchCustomEvent( inst.textarea, eventInit, 'textarea-autoresize-init', true );
  };



  // auto init for [data-textarea-autoresize]
  var autoinitElements = document.querySelectorAll('[data-textarea-autoresize]');

  for ( var i = 0; i < autoinitElements.length; i++ ) {
    new motor.TextareaAutoresize(autoinitElements[i]);
  }

})();

/*********************************************** 
    Layout scripts
***********************************************/

(function() {

  // remove no-js class from html and set js
  motor.removeClass( motor.html, 'no-js' );
  motor.addClass( motor.html, 'js' );
})();