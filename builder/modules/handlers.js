/********************************************** 
    Request handlers
***********************************************/

var exec = require('child_process').exec,
    querystring = require('querystring'),
    fs = require('fs'),
    parser = require('./parser'),
    index = fs.readFileSync( 'index.html', 'utf8' ),
    config = fs.readFileSync( '../_source/config.scss', 'utf8' );

function start(response) {
  response.writeHead( 200, { 'Content-Type': 'text/html' } );
  response.end(index);
}

function getConfig(response) {
  /*response.writeHead( 200, { 'Content-Type': 'application/json' } );
  console.log( parser.scssToJson(config) );

  response.end( JSON.stringify( parser.scssToJson(config) ) );*/

  response.writeHead( 200, { 'Content-Type': 'text/xml' } );
  response.end( parser.scssToXml(config) );
}

function update(response, data) {
  console.log(data);

  response.writeHead( 200, { 'Content-Type': 'text/xml' } );

  fs.writeFileSync( '../_source/config-builded.scss', parser.jsonToScss(data) );

  response.end();
}

function compile(response) {
  console.log('Compile start');
  exec( 'grunt publish', { cwd: '../' }, function ( error, stdout, stderr ) {
    response.writeHead( 200, {'Content-Type': 'text/plain'} );
    response.write( 'Grunt compile in ' + stdout );
    response.end();
  });
}

exports.start = start;
exports.getConfig = getConfig;
exports.update = update;
exports.compile = compile;

/*
function upload(response, data) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.write('Upload:' + querystring.parse(data).text);
  response.end();
}*/