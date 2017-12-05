var express = require('express');
var app = express();
var fs = require('fs');
var open = require('open');


var serverPort = (process.env.PORT  || 3000);
var http = require('http');
var server;


server = http.createServer(app);


io = require('socket.io')(server);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

server.listen(serverPort, function(){
  console.log('server up and running at %s port', serverPort);
  
});