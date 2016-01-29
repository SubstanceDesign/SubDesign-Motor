/*********************************************** 
    Router
***********************************************/

var path = require('path'),
    fs = require('fs');

function route(pathname, handle, response, data) {
  console.log('About to route a request for ' + pathname);
  
  if ( typeof handle[pathname] === 'function' ) {
    handle[pathname](response, data);
  } else {

    // handle static
    var extension = path.extname(pathname);

    if ( extension == '.css' ) {

      fs.readFile(__dirname + '/..' + pathname, function (error, data) {
        if (error) console.log(error);
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(data);
        response.end();
      });

    } else if ( extension == '.js' ) {

      fs.readFile(__dirname + '/..' + pathname, function (error, data) {
        if (error) console.log(error);
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        response.write(data);
        response.end();
      });

    } else {

      console.log('No request handler found for ' + pathname);
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.write('404 Not found');
      response.end();
    }

  }
}

exports.route = route;