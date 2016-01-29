/*********************************************** 
    Parsers
***********************************************/

var ObjTree = require('xml-objtree'),
    objTree = new ObjTree();

function scssToHtml(fileString) {
  // replace comments with titles
  fileString = fileString.replace(/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\n\/\/  (.*)\n\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//g, '\n<h2>$1</h2>\n');
  fileString = fileString.replace(/\/\/  (.*)\n\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//g, '\n<h3>$1</h3>\n');
  fileString = fileString.replace(/\n\/\/\s*(.*)\n/g, '\n<h4>$1</h4>\n');
  fileString = fileString.replace(/\n(.*)\s*\/\/(.*)\n/g, '\n<h5>$2</h5>\n$1\n');
  fileString = fileString.replace(/\n(.*)\s*\/\/(.*)\n/g, '\n<h5>$2</h5>\n$1\n');

  // parse variables
  fileString = fileString.replace(/\$(.*):\s*(.*);/g, '\n<div class="group"><div class="name">$1</div><div class="value">$2</div></div>\n');

  // parse maps
  fileString = fileString.replace(/\n  (.*):\s*(.*),\s*\n/g, '\n<div class="map-group"><div class="name">$1</div><div class="value">$2</div></div>\n');
  fileString = fileString.replace(/\n  (.*):\s*(.*),\s*\n/g, '\n<div class="map-group"><div class="name">$1</div><div class="value">$2</div></div>\n');
  fileString = fileString.replace(/\n  (.*):\s*(.*)\n/g, '\n<div class="map-group"><div class="name">$1</div><div class="value">$2</div></div>\n');
  fileString = fileString.replace(/\n\$(.*): \(\n/g, '\n<div class="map">\n<div class="map-name">$1</div>\n');
  fileString = fileString.replace(/\n\);\n/g, '\n</div>\n');

  return fileString;
}

function scssToXml(fileString) {
  // replace comments with titles
  fileString = fileString.replace(/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\n\/\/  (.*)\n\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//g, '\n<h1>$1</h1>\n');
  fileString = fileString.replace(/\/\/  (.*)\n\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//g, '\n<h2>$1</h2>\n');
  fileString = fileString.replace(/\n\/\/\s*(.*)\n/g, '\n<h3>$1</h3>\n');
  fileString = fileString.replace(/\n(.*)\s*\/\/(.*)\n/g, '\n<h4>$2</h4>\n$1\n');
  fileString = fileString.replace(/\n(.*)\s*\/\/(.*)\n/g, '\n<h5>$2</h5>\n$1\n');

  // parse variables
  fileString = fileString.replace(/\$(.*):\s*(.*);/g, '\n<var><name>$1</name><value>$2</value></var>\n');

  // parse maps
  fileString = fileString.replace(/\n  (.*):\s*(.*),\s*\n/g, '\n<map-var><name>$1</name><value>$2</value></map-var>\n');
  fileString = fileString.replace(/\n  (.*):\s*(.*),\s*\n/g, '\n<map-var><name>$1</name><value>$2</value></map-var>\n');
  fileString = fileString.replace(/\n  (.*):\s*(.*)\n/g, '\n<map-var><name>$1</name><value>$2</value></map-var>\n');
  fileString = fileString.replace(/\n\$(.*): \(\n/g, '\n<map>\n<map-name>$1</map-name>\n<map-array>\n');
  fileString = fileString.replace(/\n\);\n/g, '\n</map-array>\n</map>\n');

  // remove line breaks
  fileString = fileString.replace(/\n/g, '');

  // wrap into root
  fileString = fileString.replace(/(.*)/, '<root>$1</root>');

  fileString = objTree.parseXML( fileString );

  return fileString;
}

exports.scssToHtml = scssToHtml;
exports.scssToXml = scssToXml;