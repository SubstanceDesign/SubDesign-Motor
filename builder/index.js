/*********************************************** 
    Index
***********************************************/

var server = require('./modules/server'),
    router = require('./routers/router'),
    requestHandler = require('./modules/handlers');

var handle = {
  '/': requestHandler.start,
  '/start': requestHandler.start,
  '/get-config': requestHandler.getConfig,
  '/update': requestHandler.update,
  '/compile': requestHandler.compile
}

server.start(router.route, handle);