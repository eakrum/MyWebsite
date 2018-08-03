var express = require('express');
var app = express();
var fs = require('fs');
var path = __dirname + '/';
var serverPort = 3000;
var http = require('http');
var server;


server = http.createServer(app);

app.get('/', function(req, res){
  console.log('get /');
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function(req, res){
  console.log('get /chat');
  res.sendFile(__dirname + '/chat/chat.html');
});

server.listen(serverPort, function(){
  console.log('server up and running at %s port', serverPort);
  
});




app.use(express.static((__dirname, './')));

