!function ($) {
  'use strict';

  $(window).on('load', function() {
    
    onLoadActions();
  })

}(jQuery);

function onLoadActions() {

  $.ajax({
    type: 'GET',
    url: '/get-config',
    dataType: 'text',
    success: function(data) {
      console.log('Received data: ' + data);

      builder.createFormFromXml( document.getElementById('config'), data );
    }
  });
}

var builder = {
  createFormFromXml: function( parent, data ) {
    // unwrap root
    data = data.replace(/<root>(.*)<\/root>/g, '$1');

    // rename to tags
    data = data.replace(/<var><name>(.*?)<\/name><value>(.*?)<\/value><\/var>/g, '<div class="variable"><div class="variable-name">$1</div><div class="input-wrap"><input type="text" name="$1" value="$2"></div></div>');
    data = data.replace(/<map-var><name>(.*?)<\/name><value>(.*?)<\/value><\/map-var>/g, '<div class="map-variable"><div class="variable-name">$1</div><div class="input-wrap"><input type="text" name="$1" value="$2"></div></div>');
    data = data.replace(/<map><map-name>(.*?)<\/map-name><map-array>(.*?)<\/map-array><\/map>/g, '<div class="map"><div class="map-name">$1</div><div class="map-array">$2</div></div>');

    // paste html for form
    parent.innerHTML = data;

    // bind post for form
    $('#config_form').on('submit', function(event) {
      event.preventDefault();

      var formData = builder.prepareFormData(parent);
      console.log('Prepared data: ' + formData);

      builder.showLoader();

      $.ajax({
        type: 'POST',
        url: '/update',
        dataType: 'text',
        data: formData, 
        success: function(data) {
          $('.config_loader').remove();
          builder.showAlert(data);

          if ( data == 'Updated succesfully' ) {
            builder.reloadStylesheets(document.getElementById('config_iframe').contentDocument);
          }
        }
      });
    });

    // init colorpicker
    var colorInputs = $('#config input[name*=color]');
    $('.map-name').each(function() {
      if ( $(this).text().indexOf('palette') > -1 )
        colorInputs = colorInputs.add( $(this).siblings('.map-array').find('input[name]') );
    });

    colorInputs.each( function(index) {
      $(this).after( '<span id="color-preview-' + index + '" class="color-preview"></span>' );
      $(this).colorpicker({
        colorFormat: '#HEX',
        altField: '#color-preview-' + index
      });
    });
    /*$('#config input[name*=color]').each(function() {
      this.setAttribute( 'type', 'color');
    })
    */
  },

  prepareFormData: function(parent) {
    var data;

    // set values to inputs' html
    $(parent).find('.variable input, .map-variable input').each(function() {
      this.setAttribute( 'value', this.value );
    });

    
    $('.color-preview')

    // receive data
    data = parent.innerHTML;

    // remove color previews
    data = data.replace(/<span.*?class="color-preview".*?><\/span>/g, '');

    // parse data to xml
    data = data.replace(/<div class="variable"><div class="variable-name">(.*?)<\/div><div class="input-wrap"><input.*?name=".*?".*?value="(.*?)".*?><\/div><\/div>/g, '<var><name>$1</name><value>$2</value></var>');
    data = data.replace(/<div class="map-variable"><div class="variable-name">(.*?)<\/div><div class="input-wrap"><input.*?name=".*?".*?value="(.*?)".*?><\/div><\/div>/g, '<map-var><name>$1</name><value>$2</value></map-var>');
    data = data.replace(/<div class="map"><div class="map-name">(.*?)<\/div><div class="map-array">(.*?)<\/div><\/div>/g, '<map><map-name>$1</map-name><map-array>$2</map-array></map>');

    // wrap root
    data = data.replace(/(.*)/, '<root>$1</root>');

    return data;
  },

  showAlert: function( data, type ) {
    var alert = document.createElement('div'),
        $alert = $(alert);
    alert.innerHTML = data;
    alert.className = 'config_alert';
    document.body.appendChild(alert);
    setTimeout(function() {
      $alert.addClass('show');
    }, 1);
    setTimeout(function() {
      $alert.fadeOut( 1000, function() {
        $alert.remove();
      });
    }, 1000);
  },

  showLoader: function() {
    var alert = document.createElement('div'),
        $alert = $(alert);
    alert.innerHTML = 'Loading';
    alert.className = 'config_loader';
    document.body.appendChild(alert);
    setTimeout(function() {
      $alert.addClass('show');
    }, 1);
  },

  reloadStylesheets: function(document) {
    var queryString = '?reload=' + new Date().getTime();
    //queryString = '';
    $(document).find('link[rel="stylesheet"]').each(function () {
      this.href = this.href.replace(/\?.*|$/, queryString);
    });
  }
}










