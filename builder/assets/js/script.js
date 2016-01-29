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
    data = data.replace(/<root>(.*)<\/root>/g, '<form id="config_form" method="post" action="">$1<input class="button" type="submit" id="config_submit" value="Save"></form>');

    // rename to tags
    data = data.replace(/<var><name>(.*?)<\/name><value>(.*?)<\/value><\/var>/g, '<div class="variable"><div class="variable-name">$1</div><div class="input-wrap"><input type="text" name="$1" value="$2"></div></div>');
    data = data.replace(/<map-var><name>(.*?)<\/name><value>(.*?)<\/value><\/map-var>/g, '<div class="variable"><div class="variable-name">$1</div><div class="input-wrap"><input type="text" name="$1" value="$2"></div></div>');
    data = data.replace(/<map><map-name>(.*?)<\/map-name><map-array>(.*?)<\/map-array><\/map>/g, '<div class="map"><div class="map-name">$1</div><div class="map-array">$2</div></div>');

    // paste html for form
    parent.innerHTML = data;

    // set array name for map variables
    $('.map-array input[name]').each( function( index, element ) {
      var mapName = $(element).closest('.map').find('.map-name').text();

      element.name = element.name.replace( /(.*)/, mapName + '[$1]' );
    });

    // bind post for form
    $('#config_form').on('submit', function(event) {
      event.preventDefault();

      var formData = $('#config_form').serializeArray();
      console.log(formData);

      $.ajax({
        type: 'POST',
        url: '/update',
        dataType: 'json',
        data: formData, 
        success: function(response) {
          console.log('Updated succesfully');
        }
      });
    });
  }
}