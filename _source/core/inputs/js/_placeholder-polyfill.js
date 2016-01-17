/*********************************************** 
    Placeholder polyfill for old browsers
***********************************************/

(function() {

  /* placeholder constructor
  ***********************************************/
  motor.placeHolder = function(elem) {
    // check placeholder support
    if ( document.createElement("input").placeholder == undefined ) {

      var inst = this;

      // initialise placeholder on target input
      inst.initPlaceholder = function(input) {
        // input.getAttribute('placeholder');

        // add placeholder class
        motor.addClass( input, 'placeholder' );

        // listen to keyup to hide or show placeholder
        input.onkeyup = function() {
          inst.updateHeight();
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

      // placeholder handling
      inst.handlePlaceholder = function(input) {
        if ( input.value.length == 0 ) {
          input.value = input.getAttribute('placeholder');
          motor.addClass( input, 'placeholder' );
        } else {
          motor.removeClass( input, 'placeholder' );
        }
      }

      // check if the element was delivered as argument
      if (!elem) {
        // create array of items
        inst.elements = document.querySelectorAll('[placeholder]');

        for ( var i = 0; i < inst.elements.length; i++ ) {
          inst.initPlaceholder(inst.elements[i]);
        }
      } else {
        inst.initPlaceholder(elem);
      }

    }

  };

})();