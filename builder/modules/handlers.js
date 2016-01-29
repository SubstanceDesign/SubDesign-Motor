/*********************************************** 
    Request handlers
***********************************************/

var exec = require("child_process").exec,
    querystring = require("querystring"),
    fs = require('fs'),
    parser = require('./parser'),
    index = fs.readFileSync('index.html', 'utf8'),
    config = fs.readFileSync('../_source/config.scss', 'utf8');

function start(response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  console.log(parser.scssToXml(config));
  response.end( parser.scssToXml(config).toString() );
}

function upload(response, data) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write('Upload:' + querystring.parse(data).text);
  response.end();
}

function compile(response) {
  console.log('Compile start');
  exec("grunt publish", { cwd: '../' }, function (error, stdout, stderr) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write('Grunt compile in ' + stdout);
    response.end();
  });
}

exports.start = start;
exports.upload = upload;
exports.compile = compile;