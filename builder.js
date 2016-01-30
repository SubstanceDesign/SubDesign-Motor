/*********************************************** 
    Index
***********************************************/

var server = require('./_builder/modules/server'),
    router = require('./_builder/routers/router'),
    requestHandler = require('./_builder/modules/handlers');

var handle = {
  '/': requestHandler.start,
  '/start': requestHandler.start,
  '/get-config': requestHandler.getConfig,
  '/update': requestHandler.update
}

server.start(router.route, handle);