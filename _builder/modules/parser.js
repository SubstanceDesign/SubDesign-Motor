/*********************************************** 
    Parsers
***********************************************/

var ObjTree = require('xml-objtree'),
    objTree = new ObjTree();

function scssToXml(fileString) {
  // replace comments with titles
  fileString = fileString.replace(/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\n\/\/  (.*)\n\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//g, '\n<h1>$1</h1>\n');
  fileString = fileString.replace(/\/\/  (.*)\n\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\//g, '\n<h2>$1</h2>\n');
  fileString = fileString.replace(/\n\/\/\s*(.*)\n/g, '\n<h3>$1</h3>\n');
  fileString = fileString.replace(/\n(.*)\s*\/\/(.*)\n/g, '\n<h4>$2</h4>\n$1\n');
  fileString = fileString.replace(/\n(.*)\s*\/\/(.*)\n/g, '\n<h4>$2</h4>\n$1\n');

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

  return fileString;
}

function scssToJson(fileString) {
  fileString = scssToXml(fileString);
  fileString = objTree.parseXML( fileString );

  return fileString;
}

function xmlToScss(xmlCode) {
  // unwrap root
  xmlCode = xmlCode.replace(/<root>(.*)<\/root>/, '$1');

  // recreate comments
  xmlCode = xmlCode.replace(/<h1>(.*?)<\/h1>/g, '/////////////////////////////////////////////////\n//  $1\n/////////////////////////////////////////////////');
  xmlCode = xmlCode.replace(/<h2>(.*?)<\/h2>/g, '\n\n//  $1\n/////////////////////////////////////////////////');
  xmlCode = xmlCode.replace(/<h3>(.*?)<\/h3>/g, '\n\n//  $1');
  xmlCode = xmlCode.replace(/<h4>(.*?)<\/h4>(<var>.*?<\/var>)/g, '$2 //$1'); // recreate h4 comments will be later

  // recreate variables
  xmlCode = xmlCode.replace(/<var><name>(.*?)<\/name><value>(.*?)<\/value><\/var>/g, '\n$$$1: $2;');

  // recreate maps
  xmlCode = xmlCode.replace(/<map-var><name>(.*?)<\/name><value>(.*?)<\/value><\/map-var>/g, '\n  $1: $2,');
  xmlCode = xmlCode.replace(/<map-var><name>(.*?)<\/name><value>(.*?)<\/value><\/map-var>/g, '\n  $1: $2,');
  xmlCode = xmlCode.replace(/<map><map-name>(.*?)<\/map-name><map-array>/g, '\n$$$1: (');
  xmlCode = xmlCode.replace(/,<\/map-array><\/map>/g, '\n);');

  return xmlCode;
}

exports.scssToXml = scssToXml;
exports.scssToJson = scssToJson;
exports.xmlToScss = xmlToScss;