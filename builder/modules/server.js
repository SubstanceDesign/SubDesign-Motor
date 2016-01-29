/*********************************************** 
    Start server
***********************************************/

var http = require('http'),
    url = require('url');

function start( route, handle ) {

  function onRequest( request, response ) {
    var postData = '',
        pathname = url.parse(request.url).pathname;

    console.log( 'Request for ' + pathname + ' received.' );

    // set utf-8 encoding
    request.setEncoding('utf8');

    // listen to request data was sent
    request.addListener( 'data', function(postDataChunk) {
      postData += postDataChunk;
      console.log( 'Received POST data chunk "'+
      postDataChunk + '".' );
    });

    // listen to request end
    request.addListener( 'end', function() {
      route( pathname, handle, response, postData );
    });
  }

  // create server on certain port
  http.createServer(onRequest).listen(8100);
  console.log( 'Server running at http://localhost:8100/' );
}

exports.start = start;