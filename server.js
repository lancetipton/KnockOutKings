var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var playerSockets = [];
var otherPlayerIds = [];
var idCount = 0;



// Set directorys for the server to see:
app.use(express.static(__dirname + '/'));
app.use(express.static(__dirname + '/public/images/'));
app.use(express.static(__dirname + '/public/javascripts/'));
app.use(express.static(__dirname + '/public/stylesheets'));


// Rout to set your main index.html file:
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});



// Server gets messages from client:
io.on('connection', function(socket){
  console.log("New Player Connected!");
  playerSockets.push(socket);
  addAnId(socket);


  socket.on('checkForOtherPlayers', function(){
    console.log(otherPlayerIds);
    io.emit('otherPlayers', JSON.stringify(otherPlayerIds));
  });

  socket.on('addPlayer', function(){
    var playerId = findPlayerId(socket);
    io.emit('playerAdded', playerId);
  });

  socket.on('startGame', function(){
    io.emit('gameStarted', '');
  });

  socket.on('restartGame', function(){
    io.emit('restartGame', '');
  });


  // client disconnects from server
  socket.on('disconnect', function() {
    console.log("someone disconnected");
    var playerId = findPlayerId(socket);
    io.emit('removePlayer', playerId);
    removePlayer(socket);

  });



  // server call to move player:
    socket.on('movement', function(playerAndDirection){
      io.emit('movement', playerAndDirection);
    });

    socket.on('attack', function(attack){
      io.emit('attack', attack);
    });

    socket.on('hurt', function(players){
      io.emit('hurt', players)
    });



});

// the server
http.listen(8080, function(){
  console.log('listening on *:8080');
});



var removePlayer = function(socket){
  for(var i = 0; i < playerSockets.length; i++){
    if (playerSockets[i] == socket){
      playerSockets.splice(i, 1);
      otherPlayerIds.splice(i, 1);
      idCount --;
    };
  };
 };


var findPlayerId = function(socket){
    for(var i = 0; i < playerSockets.length; i++){
      if (playerSockets[i] == socket){
          return i;
      };
    };
 };

 var  addAnId = function(socket){
      otherPlayerIds.push(idCount);
      idCount ++;
 };