var socket = io();

// look in the server.js file of the rot directory to see what the server does when it recives a call:




tellServerToAddPlayer = function(){
  socket.emit('addPlayer', '');
};

tellServerToStartGame = function(){
  socket.emit('startGame', '');
};

// player Actions:
tellServerToMove = function(direction){
  socket.emit('movement', direction);
};

tellServerToAttack = function(attack){
  socket.emit('attack', attack);
};

// returns from server:

// player Move:
socket.on('movement', function(direction){
  if (direction == 'left'){
    player.moveLeft();
  }
  else if (direction == 'right'){
    player.moveRight();

  }
  else if (direction == 'up'){
    player.jump();

  }
  else if (direction == 'down'){
    player.down();
  };

});

// player Attack:
socket.on('attack', function(attack){
  if (attack == 'punch'){
    player.punch();
  }
  else if (attack == 'kick'){
    player.kick();

  }
  else if (attack == 'superKick'){
    player.superKick();

  }
  else if (attack == 'superPunch'){
    player.superPunch();
  };

});

socket.on('playerAdded', function(playerName){
  console.log(playerName);
    player.playerName = playerName;
});



socket.on('gameStarted', function(){
 // This starts the game state play.
  game.state.start('play');
})


