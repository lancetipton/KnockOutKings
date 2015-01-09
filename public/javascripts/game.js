//  Play game state. Where the action happends.
var play = {

    preload: function() {
        game.load.image('sky', 'public/images/sky.png');
        game.load.image('ground', 'public/images/platform.png');

        game.load.spritesheet('star', 'public/images/star.png', 24, 22);
        game.load.spritesheet('health', 'public/images/health.png', 32, 32);

        game.load.spritesheet('guy', 'public/images/guy.png', 80, 108);
        game.load.spritesheet('girl', 'public/images/girl.png', 80, 108);
    },

    // this is the very first fucntion that is run, and sets up our game:

    create: function() {
        buildGame();
        buildLevel();
        buildPlayers();
        buildItems();
    },

    // this is the game loop that will run over and over again. About 60 FPS.
    update: function() {
        // gets the current level from the levels.js

        for(var i = 0; i < allPlayers.length; i++){
            var currentPlayer = allPlayers[i];
            checkFace(currentPlayer);
            currentPlayer.getItem()

            game.physics.arcade.collide(currentPlayer.avatar, platforms);

            if (currentPlayer.hurt == false){
                currentPlayer.falling();
                currentPlayer.checkMovement();
            };

            if(currentPlayer.playerDead(currentLevel)){
                restartGame();
            };
        };

        for(var i = 0; i < allItems.length; i++){
            game.physics.arcade.collide(allItems[i].avatar, platforms);
        }
    }
};

function buildGame(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
};

// This is the start screen game state. To be implimented.
var main = {
  preload: function() {
    // load the play button into this game state:
    game.load.image('play', 'public/images/play.png');
  },

  create: function() {

    // View the play button on the screen:
    var playBtn = game.add.sprite(game.world.centerX, game.world.centerY, 'play');

    //  Enables all kind of input actions on this image (click, etc)
    play.inputEnabled = true;

    // When we click on the button, it will do the below. playGame is the function it will run when clicked.
    game.input.onDown.addOnce(playGame, this);

  },
};

// this function will run when the playBtn it clicked:
function playGame () {
    // This starts the game state play. Which is the actuall game:
    game.state.start('play');
};

var avatarSelect = {
  preload: function() {

  },

  create: function() {

  },

  update: function(){

  }
};

var levelSelect = {
  preload: function() {

  },

  create: function() {

  },

  update: function(){

  }
};

var results = {
  preload: function() {

  },

  create: function() {

  },

  update: function(){

  }
};

// State manager:
var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', 'gameDiv')

game.state.add('main', main);
game.state.add('avatarSelect', avatarSelect);
game.state.add('levelSelect', levelSelect);
game.state.add('play', play);
game.state.add('results', results);


// This is used to start a game state:
game.state.start('main');
