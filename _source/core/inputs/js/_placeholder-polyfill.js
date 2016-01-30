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
        motor(input).addClass( 'placeholder' );

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
        if ( motor(input).parentUntil( 'form' ).length && !motor( motor(input).parentUntil( 'form' )[0] ).hasClass( 'prevent-placeholder' ) ) {
          var form = motor(input).parentUntil( 'form' )[0];

          // add class to bind handler once
          motor(form).addClass( 'prevent-placeholder' );

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
          motor(input).removeClass( 'placeholder' );
        }
      }

      // show placeholder
      inst.showPlaceholder = function(input) {
        if ( input.value == '' ) {
          input.value = input.getAttribute('placeholder');
          motor(input).addClass( 'placeholder' );
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

})();