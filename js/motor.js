/*********************************************** 
    Base framework object with functions and usefull properties
***********************************************/

(function() {

  /* Default function that create instance for an array of elements
   ***********************************************/
  window.motor = function(elems) {

    // return if elems undefined
    if (!elems)
      return;

    // call query selector method if transfered selector
    if (elems.constructor === String)
      elems = document.querySelectorAll(elems);

    // transform node list to array
    var isNodeList = typeof(StaticNodeList) === 'undefined' ? elems.constructor === NodeList : elems.constructor === NodeList || elems.constructor === StaticNodeList;

    if (isNodeList) {
      var nodeArray = [];
      for (var i = 0; i < elems.length; i++) {
        nodeArray.push(elems[i]);
      }
      elems = nodeArray;
    }

    // create elems array if transfered single element
    if (elems.constructor !== Array)
      elems = [elems];

    // create instance
    return new motor.Element(elems);
  }


  /* Global namespace properties,
  /* caching often usable nodes
  ***********************************************/

  motor.window = window,
    motor.windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    motor.windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    motor.body = document.body,
    motor.html = document.documentElement;


  /* Non element based functions
   ***********************************************/

  //  get crossbrowser window width
  motor.getWindowWidth = function() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  };

  // get crossbrowser window height
  motor.getWindowHeight = function() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  };

  // fix event object
  motor.fixEvent = function(event) {
    event = event || window.event;

    // check already fixed flag
    if (event.isFixed) {
      return event;
    }
    event.isFixed = true;

    // add preventDefault an stopPropagation methods
    event.preventDefault = event.preventDefault || function() {
      this.returnValue = false
    };
    event.stopPropagation = event.stopPropagaton || function() {
      this.cancelBubble = true
    };

    // add event.target property
    if (!event.target) {
      event.target = event.srcElement;
    }

    // add relatedTarget property
    if (!event.relatedTarget && event.fromElement) {
      event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;
    }

    // add pageX and pageY properties
    if (event.pageX == null && event.clientX != null) {
      event.pageX = event.clientX + (motor.html && motor.html.scrollLeft || motor.body && motor.body.scrollLeft || 0) - (motor.html.clientLeft || 0);
      event.pageY = event.clientY + (motor.html && motor.html.scrollTop || motor.body && motor.body.scrollTop || 0) - (motor.html.clientTop || 0);
    }

    // add which property
    if (!event.which && event.button) {
      event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
    }

    return event;
  };

  // normalize handler function
  motor.commonHandle = function(event) {
    // return if window resize event fired without actial window resize
    if (event.type == 'resize' && motor.getWindowWidth() == motor.windowWidth && motor.getWindowHeight() == motor.windowHeight)
      return;
    else {
      motor.windowWidth = motor.getWindowWidth();
      motor.windowHeight = motor.getWindowHeight();
    }

    // fix event object
    event = motor.fixEvent(event);

    // get handlers of current type
    var handlers = this.events[event.type];

    for (var i in handlers) {
      var handler = handlers[i],
        returned = handler.call(this, event); // cal handler in this context

      if (returned === false) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  // create custom event
  motor.createCustomEvent = function(eventName) {
    var event = false;

    // check feature support
    if (typeof Event === 'function') {
      event = new Event(eventName);
    } else if (!!document.createEvent) {
      event = document.createEvent('Event');
      event.initEvent(eventName, true, true);
    }

    return event;
  };

  // debounce function decorator
  motor.debounce = function(fn, timeout) {
    var prevent = false;

    return function() {
      if (prevent)
        return;

      fn.apply(this, arguments);
      prevent = true;

      setTimeout(function() {
        prevent = false
      }, timeout);
    }
  };

  // throttle function decorator
  motor.throttle = function(fn, timeout) {
    var call,
      timer = 0,
      latestArgs,
      latestCtx;

    function caller() {
      if (call) {
        fn.apply(latestCtx, latestArgs);
        call = false;
        timer = setTimeout(caller, timeout);
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
  };

  /* Constructor for elemental based usage
   ***********************************************/

  motor.Element = function(elems) {
    var inst = this;

    // elements
    inst.elems = elems;

    // events handler list
    inst.handlerList = 0;
  }

  // Elemental based functions
  motor.Element.prototype = {

    // add class to node
    addClass: function(className) {
      this.elems.forEach(function(elem) {

        if (elem.className.search(className) == '-1') {
          elem.className = elem.className ? elem.className + ' ' + className : className;
        }

      });

      return this;
    },

    // remove class from node
    removeClass: function(className) {
      this.elems.forEach(function(elem) {

        var classPattern = '(^|\\s)' + className,
          re = new RegExp(classPattern, 'g');
        elem.className = elem.className.replace(re, '');

      });

      return this;
    },

    // check if node has a class
    hasClass: function(className) {
      var indicator = true;

      this.elems.forEach(function(elem) {

        var classes = elem.className.split(' ');
        for (var i = 0; i < classes.length; i++) {
          if (classes[i] == className)
            return;
        }

        indicator = false;

      });

      return indicator;
    },

    // get computed style crossbrowser
    getComputedStyle: function(prop) {
      var returnValue = [];

      this.elems.forEach(function(elem) {
        returnValue.push(window.getComputedStyle ? getComputedStyle(elem)[prop] : elem.currentStyle[prop]);
      });

      return returnValue.length > 1 ? returnValue : returnValue[0];
    },

    // get parent until
    parentUntil: function(selector, motorElement) {
      var returnValue = [];

      this.elems.forEach(function(elem) {

        var current = elem.parentNode;
        while (current && !current.querySelectorAll(selector)) {
          current = current.parentNode;
        }

        returnValue.push(current.querySelectorAll(selector));

      });

      returnValue = returnValue.length > 1 ? returnValue : returnValue[0];

      if (motorElement === true)
        returnValue = motor(returnValue);

      return returnValue;
    },

    // add event listener
    addListener: function(eventName, eventHandler) {
      this.elems.forEach(function(elem) {

        // check if elem is actually window
        if (elem.setInterval && (elem != window && !elem.frameElement)) {
          elem = window;
        }

        // register handler id
        if (!eventHandler.handlerId) {
          eventHandler.handlerId = ++this.handlerList;
        }

        // create event property and write in fixed handler
        if (!elem.events) {
          elem.events = {};
          elem.handle = function(event) {
            if (typeof Event !== 'undefined') {
              return motor.commonHandle.call(elem, event)
            }
          }
        }

        // bind event if haven't bind yet
        if (!elem.events[eventName]) {
          elem.events[eventName] = {}

          if (elem.addEventListener)
            elem.addEventListener(eventName, elem.handle, false);
          else if (elem.attachEvent)
            elem.attachEvent('on' + eventName, elem.handle);
        }

        // add handler to corresponding event
        elem.events[eventName][eventHandler.handlerId] = eventHandler;

      });

      return this;
    },

    removeListener: function(eventName, eventHandler) {
      this.elems.forEach(function(elem) {

        // get if event handlers added
        var handlers = elem.events && elem.events[eventName];

        if (!handlers) return;

        delete handlers[eventHandler.handlerId];

        for (var any in handlers) return;

        if (elem.removeEventListener)
          elem.removeEventListener(eventName, elem.handle, false);
        else if (elem.detachEvent)
          elem.detachEvent("on" + eventName, elem.handle);

        delete elem.events[eventName];

        for (var any in elem.events) return;

        try {
          delete elem.handle;
          delete elem.events;
        } catch (e) { // IE
          elem.removeAttribute('handle');
          elem.removeAttribute('events');
        }

      });

      return this;
    },

    // add custom event listener
    addCustomEventListener: function(eventName, eventHandler) {
      this.elems.forEach(function(elem) {

        // check feature support
        if (!elem.addEventListener) {
          // create event property if not exist
          if (!elem[eventName]) {
            elem[eventName] = 0;
          }

          // call handler if corresponing property changed
          elem.attachEvent('onpropertychange', function(event) {
            if (event.propertyName == eventName) {
              eventHandler(event);
            }
          });
        } else {
          elem.addEventListener(eventName, eventHandler);
        }

      });

      return this;
    },

    // dispatch custom event
    dispatchCustomEvent: function(event, eventName, bubble) {
      this.elems.forEach(function(elem) {

        // check feature support
        if (!elem.dispatchEvent) {
          bubble = !bubble ? false : true; // check if bubble defined and set default value

          if (elem.nodeType === 1 && elem[eventName] >= 0) {
            elem[eventName]++;
          }

          if (bubble && elem !== document) {
            motor(elem.parentNode).dispatchCustomEvent(event, eventName, bubble);
          }
        } else {
          elem.dispatchEvent(event);
        }

      });

      return this;
    },

    // extend data attributes into object
    extendDataOptions: function(options, prefix) {
      var elem = this.elems[0];

      for (var option in options) {

        var optionHyphen = option.split(/(?=[A-Z])/).join('-'),
          optionInData = elem.getAttribute(prefix + optionHyphen);

        if (!!optionInData)
          options[option] = optionInData;
      }

      return options;
    }
  };

  /* Polyfills
   ***********************************************/

  // forEach polyfill
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function(callback, thisArg) {

      var T, k;

      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }

      // Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);

      // Let lenValue be the result of calling the Get internal method of O with the argument "length".
      // Let len be ToUint32(lenValue).
      var len = O.length >>> 0;

      // If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      // If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (arguments.length > 1) {
        T = thisArg;
      }

      // Let k be 0
      k = 0;

      // Repeat, while k < len
      while (k < len) {

        var kValue;

        // Let Pk be ToString(k).
        // This is implicit for LHS operands of the in operator
        // Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        // This step can be combined with c
        // If kPresent is true, then
        if (k in O) {

          // Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[k];

          // Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // Increase k by 1.
        k++;
      }
      // return undefined
    };
  }


})();

/*********************************************** 
    Placeholder polyfill for old browsers
***********************************************/

(function() {

  /* placeholder constructor
   ***********************************************/
  motor.placeHolder = function(elem) {
    // check placeholder support
    if (document.createElement('input').placeholder == undefined) {

      var inst = this;

      // initialise placeholder on target input
      inst.initPlaceholder = function(input) {
        // input.getAttribute('placeholder');

        // add placeholder class
        motor(input).addClass('placeholder');

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
        if (motor(input).parentUntil('form').length && !motor(motor(input).parentUntil('form')[0]).hasClass('prevent-placeholder')) {
          var form = motor(input).parentUntil('form')[0];

          // add class to bind handler once
          motor(form).addClass('prevent-placeholder');

          // bind on submit event
          form.onsubmit = function() {
            var placeholdered = form.querySelectorAll('.placeholder'),
              // return placeholders after request was sent
              submitReturnTimeout = setTimeout(function() {
                placeholdered = form.querySelectorAll('.placeholder');
                for (var i = 0; i < placeholdered.length; i++) {
                  placeholdered[i].value = input.getAttribute('placeholder');
                }
              }, 100);

            for (var j = 0; j < placeholdered.length; j++) {
              placeholdered[j].value = '';
            }
          };
        }
      }

      // hide placeholder
      inst.hidePlaceholder = function(input) {
        if (input.value == input.getAttribute('placeholder')) {
          input.value = '';
          motor(input).removeClass('placeholder');
        }
      }

      // show placeholder
      inst.showPlaceholder = function(input) {
        if (input.value == '') {
          input.value = input.getAttribute('placeholder');
          motor(input).addClass('placeholder');
        }
      }

      // check if the element was delivered as argument
      if (!elem) {
        // create array of items
        inst.elements = document.querySelectorAll('input[placeholder], textarea[placeholder]');

        for (var i = 0; i < inst.elements.length; i++) {
          inst.initPlaceholder(inst.elements[i]);
        }
      } else {
        inst.initPlaceholder(elem);
      }

    }

  };

})();

/*********************************************** 
    Autoresize plugin for textarea
***********************************************/

(function() {

  /* textarea with autoresize constructor
   ***********************************************/
  motor.Element.prototype.TextareaAutoresize = function(options) {

    this.elems.forEach(function(elem) {
      var inst = {};

      inst.textarea = elem,
        inst.opts = {
          maxHeight: false, // height limit
          updateOnResize: true // update textarea height on windows resize
        },
        inst.limited = false; // reach height limit flag

      // set autoresize state style
      motor(inst.textarea).addClass('autoresize');

      // integrate custom options
      for (var option in options) {
        inst.opts[option] = options[option];
      }

      // extend data attribute options
      inst.opts = motor(inst.textarea).extendDataOptions(inst.opts, 'data-textarea-autoresize-');

      // create events
      var eventInit = motor.createCustomEvent('textarea-autoresize-init'),
        eventResize = motor.createCustomEvent('textarea-autoresize-resize');

      // get outer height difference
      inst.getOuterDiff = function() {
        var outerDiff = {};

        // check box sizing setting and calculate outer difference
        if (motor(inst.textarea).getComputedStyle('boxSizing') == 'border-box') {
          outerDiff.vertical = parseFloat(motor(inst.textarea).getComputedStyle('borderTopWidth'), 10) + parseFloat(motor(inst.textarea).getComputedStyle('borderBottomWidth'), 10);
          outerDiff.horizontal = parseFloat(motor(inst.textarea).getComputedStyle('borderLeftWidth'), 10) + parseFloat(motor(inst.textarea).getComputedStyle('borderRightWidth'), 10);
        } else {
          outerDiff.vertical = -(parseFloat(motor(inst.textarea).getComputedStyle('paddingTop'), 10) + parseFloat(motor(inst.textarea).getComputedStyle('paddingBottom'), 10));
          outerDiff.horizontal = -(parseFloat(motor(inst.textarea).getComputedStyle('paddingLeft'), 10) + parseFloat(motor(inst.textarea).getComputedStyle('paddingRight'), 10));
        }

        return outerDiff;
      }

      inst.updateHeight = function() {

        // duplicate content and width to clone
        inst.shadowTextarea.value = inst.textarea.value;
        inst.shadowTextarea.style.width = inst.textarea.clientWidth + inst.outerDiff.horizontal + 'px';

        // check if overflowen
        if (inst.textarea.clientHeight < inst.textarea.scrollHeight) {

          if (!inst.limited) {
            var newHeight = inst.shadowTextarea.scrollHeight + inst.outerDiff.vertical;

            // check if reaches height limit
            if (newHeight > inst.opts.maxHeight) {
              inst.limited = true;
              motor(inst.textarea).addClass('limited');
            } else {
              // increase size
              inst.textarea.style.height = newHeight + 'px';

              // dispatch plugin resize event
              motor(inst.textarea).dispatchCustomEvent(eventResize, 'textarea-autoresize-resize', true);
            }
          }

        } else {

          // check if greater than initial height
          if (inst.textarea.clientHeight > inst.shadowTextarea.clientHeight + inst.outerDiff.vertical) {

            var newHeight = inst.shadowTextarea.scrollHeight + inst.outerDiff.vertical < inst.shadowTextarea.clientHeight + inst.outerDiff.vertical ? inst.shadowTextarea.clientHeight + inst.outerDiff.vertical : inst.shadowTextarea.scrollHeight + inst.outerDiff.vertical;

            // decrease size
            inst.textarea.style.height = newHeight + 'px';

            // remove limited state
            inst.limited = false;
            motor(inst.textarea).removeClass('limited');

            // dispatch plugin resize event
            motor(inst.textarea).dispatchCustomEvent(eventResize, 'textarea-autoresize-resize', true);
          }

        }
      }

      // create clone of textarea to check overlow
      inst.shadowTextarea = inst.textarea.cloneNode();
      inst.shadowTextarea.style.transition = 'none';
      inst.shadowTextarea.style.WebkitTransition = 'none';
      inst.shadowTextarea.style.MozTransition = 'none';
      inst.shadowTextarea.setAttribute('style', 'position: absolute; bottom: 0; z-index: -1; visibility: hidden;');
      motor(inst.shadowTextarea).addClass('clone');
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
      if (inst.opts.updateOnResize) {
        inst.updateHeightThrottled = motor.throttle(inst.updateHeight, 10);

        motor(window).addListener('resize', function() {
          inst.updateHeightThrottled();
        });
      }

      // dispatch plugin init event
      motor(inst.textarea).dispatchCustomEvent(eventInit, 'textarea-autoresize-init', true);

      // return instance
      return inst;

    });
  };

  // auto init for [data-textarea-autoresize]
  var autoinitElements = document.querySelectorAll('[data-textarea-autoresize]');

  for (var i = 0; i < autoinitElements.length; i++) {
    motor(autoinitElements[i]).TextareaAutoresize();
  }

})();

/*********************************************** 
    Layout scripts
***********************************************/

(function() {

  // remove no-js class from html and set js
  motor(motor.html).removeClass('no-js');
  motor(motor.html).addClass('js');
})();
