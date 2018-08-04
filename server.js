var express = require('express');
var app = express();
var fs = require('fs');
var options = {
  key: fs.readFileSync('./fake-keys/privatekey.pem'),
  cert: fs.readFileSync('./fake-keys/certificate.pem')
};
var serverPort = (process.env.PORT  || 4443);
var https = require('https');
var http = require('http');
var server;
var viewers;
var newUser;
server = http.createServer(app);

 io = require('socket.io')(server);

var roomList = {};

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

function socketIdsInRoom(name) {
  var socketIds = io.nsps['/'].adapter.rooms[name];
  if (socketIds) {
    var collection = [];
    for (var key in socketIds) {
      collection.push(key);
    }
    return collection;
  } else {
    return [];
  }
}

io.on('connection', function(socket){
  console.log('new user connected with ID:' , socket.id);
  socket.on('disconnect', function(){
    console.log('user disconnected with ID: ', socket.id);
    if (socket.room) {
      var room = socket.room;
      io.to(room).emit('leave', socket.id);
      socket.leave(room);
    }
  });

  socket.on('join', function(name, callback){
    console.log('join', name);
    var socketIds = socketIdsInRoom(name);
    console.log('socket Ids in this room are', socketIds);
    socket.join(name);
    socket.room = name;
    callback(socketIds);
  });
  socket.on('leave', function(name, callback){
    console.log('leave', name);
    var socketId = socket.id;
    console.log('Socked Id: ', socketId);
    var socketIds = socketIdsInRoom(name);
    console.log('SocketIds in this room:', socketIds);
    const room = socket.room;
    console.log('Leaving ROOM: ', room);
    callback(socketIds);
    io.in(room).emit('Leave: ', socketId);
    socket.leave(room);
    console.log('leaving complete');
  });

  socket.on('leave2', function(){
    if (socket.room){
     var room = socket.room;
     io.to(room).emit('leaveEveryone', socket.id);
     socket.leave(room);
     console.log('leavingEveryone complete');
  }
  }); 

  socket.on('log', function(message) {
    console.log("MSG:", message);
  });

  socket.on('counter', function(name){
    console.log('adding a viewer');
    console.log('room: ', name);
    var socketIds = socketIdsInRoom(name);
    viewers = socketIds.length;
    var room = socket.room;
    console.log('room', room);
    io.in(room).emit('viewers', viewers);

  });

   socket.on('sendMessage', function(message){
    console.log('got a message:' , message);
    var room = socket.room;
    console.log('room2: ' , room);

    io.in(room).emit('message', message);

  })

  socket.on('matchUser', function(userID){
    console.log('got user name:' , userID);
    var room = socket.room;
    io.in(room).emit('displayUser', userID);
    

  });

  socket.on('getUser', function(name) {
    console.log('just got a new user');
    console.log('the user is in room' , name);
    var socketIds = socketIdsInRoom(name);
    newUser = socketIds; 

  });


  socket.on('exchange', function(data){
    //console.log('exchange', data);
    data.from = socket.id;
    var to = io.sockets.connected[data.to];
    to.emit('exchange', data);
  });
});


// app.get('/', function(req, res){
//   console.log('get /');
//   res.sendFile(__dirname + '/index.html');
// });

// app.get('/chat', function(req, res){
//   console.log('get /chat');
//   res.sendFile(__dirname + '/chat/chat.html');
// });

// server.listen(serverPort, function(){
//   console.log('server up and running at %s port', serverPort);
  
// });






// app.use(express.static((__dirname, './')));

