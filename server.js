var express = require('express');
var app = express();
var fs = require('fs');
var open = require('open');
var path = __dirname + '/views/';
var serverPort = (process.env.PORT  || 3000);
var http = require('http');
var server;


server = http.createServer(app);

app.get('/', function(req, res){
  console.log('get /');
  res.sendFile(__dirname + '/views/index.html');
});

server.listen(serverPort, function(){
  console.log('server up and running at %s port', serverPort);
  
});




app.use(express.static((__dirname, 'views')));

