/********************************************** 
    Request handlers
***********************************************/

var exec = require('child_process').exec,
    querystring = require('querystring'),
    fs = require('fs'),
    parser = require('./parser'),
    latestSuccesfullData = false;

function start(response) {
  response.writeHead( 200, { 'Content-Type': 'text/html' } );
  response.end( fs.readFileSync( '_builder/index.html', 'utf8' ) );
}

function getConfig(response) {
  response.writeHead( 200, { 'Content-Type': 'text/xml' } );
  response.end( parser.scssToXml( fs.readFileSync( '_source/config.scss', 'utf8' ) ) );
}

function update( response, data ) {
  response.writeHead( 200, { 'Content-Type': 'text/xml' } );
  
  updateConfig( response, data );
}

function updateConfig( response, data ) {
  fs.writeFile( '_source/config.scss', parser.xmlToScss(data), function(error) {
    if (error) {
      console.log(error);
      response.end(error);
    } else {
      exec( 'grunt styles', function ( error, stdout, stderr ) {
        if (error) {
          console.log(error);

          // return to previous state on error
          if (latestSuccesfullData) {
            updateConfig( response, latestSuccesfullData );
          } else {
            console.log('Please check config on errors');
            response.end('Please check config on errors');
          }

        } else {
          console.log( 'Grunt compile in ' + stdout );
          latestSuccesfullData = data;
          response.end('Updated succesfully');
        }
      });
    }
  });
}

exports.start = start;
exports.getConfig = getConfig;
exports.update = update;