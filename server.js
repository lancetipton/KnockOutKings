var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var playerList = ['player1', 'player2', 'player3', 'player4'];
var playerNumber = 0;


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

  // server call to move player:
    socket.on('movement', function(direction){
      io.emit('movement', direction);
    });

    socket.on('attack', function(attack){
      io.emit('attack', attack);
    });


    socket.on('addPlayer', function(){
      playerName = playerList[playerNumber];
      io.emit('playerAdded', playerName);
      playerNumber ++;
    });

    socket.on('startGame', function(){
      io.emit('gameStarted', '');
    });






    // client disconnects from server
    socket.on('disconnect', function() {
      playerNumber -= 1;
      console.log(playerNumber);
      checkNegitive();
    });

});

// the server
http.listen(8080, function(){
  console.log('listening on *:8080');
});


checkNegitive = function(){
  if (playerNumber < 0){
    playerNumber = 0;
    console.log('Resetting number of players to 0!')
  };
};