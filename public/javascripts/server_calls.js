var socket = io();
// look in the server.js file of the root directory to see what the server does when it recives a call:

tellServerToAddPlayer = function(){
  socket.emit('addPlayer', '');
};

checkServerForOthers = function(){
  socket.emit('checkForOtherPlayers', "")
};

tellServerToStartGame = function(){
  socket.emit('startGame', '');
};



// player Actions:
tellServerToMove = function(playerAndDirection){
  socket.emit('movement', JSON.stringify(playerAndDirection));
};

tellServerToAttack = function(playerAndAttack){
  socket.emit('attack', JSON.stringify(playerAndAttack));
};

tellServerPlayerIsHurt = function(players){
  touchingPlayers = players;
  socket.emit('hurt', JSON.stringify(touchingPlayers));
}

// returns from server:

// player Move:
socket.on('movement', function(playerAndDirection){

  var playerAndDirection = JSON.parse(playerAndDirection);
  var playerId = playerAndDirection[0];
  var direction = playerAndDirection[1];

  var player = findPlayer(playerId);


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

  if(direction == 'jump'){
    player.jump();
  };

});

// localPlayer Attack:
socket.on('attack', function(playerAndAttack){

  var playerAndAttack = JSON.parse(playerAndAttack);
  var playerId = playerAndAttack[0];
  var attack = playerAndAttack[1];

  var player = findPlayer(playerId);

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

socket.on('hurt', function(players){
  var players = JSON.parse(players);
  hurtPlayer = findPlayer(players[1]);
  hurtPlayer.hurt = true;

  attackingPlayer = findPlayer(players[0]);

  attackPlayer(attackingPlayer, hurtPlayer);

});



// Addint and removing players:

socket.on('playerAdded', function(playerId){
  if(allPlayers.length == 0){
    allPlayers.push(buildAPlayer(playerId));
    allPlayersIds.push(playerId);
  }
  else if(allPlayers.contains(playerId)){
    console.log('Already Player Created');
  }
});


socket.on('removePlayer', function(playerId){
  for(var i = 0; i < allPlayers.length; i++){
    if(playerId == allPlayers[i].id){
      removePlayer(i);
    };
  };
});


socket.on('otherPlayers', function(otherPlayerIds){
  var otherPlayerIds = JSON.parse(otherPlayerIds);

    for(var j = 0; j < otherPlayerIds.length; j++){
      if (allPlayersIds.contains(otherPlayerIds[j]) == false)
      {
         newPlayers.push(buildAPlayer(otherPlayerIds[j]));
      };
  };

  for(var i = 0; i < newPlayers.length; i++){
    allPlayers.push(newPlayers[i]);
    allPlayersIds.push(newPlayers[i].id)
  };

});

socket.on('gameStarted', function(playerName){
  game.state.start('play');
})

buildAPlayer = function(playerId){
  console.log('player built');
  player = new Player('guy');
  player.avatar.frame = 0
  player.id = playerId;

  if (playerId == 0){
    player.posX = 100;
    player.posY = 50;
  }
  else if(playerId == 1){
    player.posX = 300;
    player.posY = 50;
  }
  else if(playerId == 2){
    player.posX = 600;
    player.posY = 50;
  }
  else if(playerId == 3){
    player.posX = 900;
    player.posY = 50;
  };


  return player;
};

removePlayer = function(playerId){
  console.log(playerId);
  allPlayers.splice(playerId, 1);

}


findPlayer = function(playerId){
  for(var i = 0; i < allPlayers.length; i ++){
    if (playerId == allPlayers[i].id){
      return allPlayers[i];
    };
  };
};


Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}