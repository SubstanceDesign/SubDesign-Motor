/*********************************************** 
    Index
***********************************************/

var server = require('./modules/server'),
    router = require('./routers/router'),
    requestHandler = require('./modules/handlers');

var handle = {
  '/': requestHandler.start,
  '/start': requestHandler.start,
  '/compile': requestHandler.compile,
  '/upload': requestHandler.upload
}

server.start(router.route, handle);