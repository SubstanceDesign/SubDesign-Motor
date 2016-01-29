/*********************************************** 
    Start server
***********************************************/

var http = require('http'),
    url = require('url');

function start(route, handle) {

  function onRequest( request, response ) {
    var postData = "",
        pathname = url.parse(request.url).pathname;

    console.log("Request for " + pathname + " received.");

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '"+
      postDataChunk + "'.");
    });

    request.addListener("end", function() {
      route( pathname, handle, response, postData );
    });
  }

  http.createServer(onRequest).listen(8100);
  console.log('Server has started.');
}

exports.start = start;