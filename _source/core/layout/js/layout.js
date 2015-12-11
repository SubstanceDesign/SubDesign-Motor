/*********************************************** 
    Layout scripts
***********************************************/

(function() {

  /* Base framework object with functions and usefull properties
  ***********************************************/
  window.framework = {
    // caching often usable nodes
    'window': window,
    'body': document.body,
    'html': document.documentElement,

    // add Class to node
    'addClass': function( elem, className ) {
      if (elem.className.search(className) == '-1') {
        elem.className = elem.className ? elem.className + ' ' + className : className;
      }
    },

    // remove Class from node
    'removeClass': function( elem, className ) {
      var classPattern = '(^|\\s)' + className,
        re = new RegExp(classPattern, 'g');
      elem.className = elem.className.replace(re, '');
    }
  };

  // remove no-js class from html and set js
  framework.removeClass(framework.html, 'no-js');
  framework.addClass(framework.html, 'js');
})();