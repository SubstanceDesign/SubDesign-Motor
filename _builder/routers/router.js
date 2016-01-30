/*********************************************** 
    Router
***********************************************/

var path = require('path'),
    fs = require('fs'),
    url = require('url');

function route( handle, request, response, data) {
  var pathname = url.parse(request.url).pathname;

  console.log('About to route a request for ' + pathname);
  
  if ( typeof handle[pathname] === 'function' ) {
    handle[pathname](response, data);
  } else {

    // handle static
    var extension = path.extname(pathname),
        filePath = '.' + request.url.split('?')[0],
        contentType = 'text/html';
    switch (extension) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;      
      case '.jpg':
        contentType = 'image/jpg';
        break;
    }

    fs.readFile( filePath, function( error, data ) {
      console.log('Receiving static file: ' + filePath);
      if (error) {

        if( error.code == 'ENOENT' ){
          response.writeHead( 404, { 'Content-Type': contentType } );
          console.log( 'File does not exist on: ' + filePath );
          response.end('404 Not found');
        } else {
          response.writeHead(500);
          response.end( 'Sorry, check with the site admin for error: ' + error.code + ' ..\n' );
        }
      } else {
        response.writeHead( 200, { 'Content-Type': contentType } );
        response.end( data, 'utf-8' );
      }
    });

  }
}

exports.route = route;