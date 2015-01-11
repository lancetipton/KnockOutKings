//  Play game state. Where the action happends.
var play = {

    preload: function() {
        // we will change this in the future to change the levels:
        currentLevel = space;

        // load images for the level:
        game.load.image(currentLevel.name, currentLevel.backgroundLoad);
        game.load.image('platform', currentLevel.groundLoad);

        game.load.spritesheet('guy', 'public/images/guy.png', 80, 108);
        game.load.spritesheet('girl', 'public/images/girl.png', 80, 108);
    },

    // this is the very first fucntion that is run, and sets up our game:
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        buildLevel(space);
        buildPlayers(player);

        // this will go into out start screen when we have one:
    },

    // this is the game loop that will run over and over again. About 60 FPS.
    update: function() {
            checkFace(player);
            game.physics.arcade.collide(player.avatar, platforms);

            if (player.hurt == false){
                player.checkMovement();
            };

            if(player.playerDead(currentLevel)){
                restartGame();
            };
    }

};

// This is the start screen game state. To be implimented.
var main = {
  preload: function() {
    // load the play button into this game state:
    game.load.image('play', 'public/images/gui/play.png');
  },

  create: function() {
    tellServerToAddPlayer();

    // View the play button on the screen:
    var playBtn = game.add.sprite(300, game.world.centerY, 'play');


    //  Enables all kind of input actions on this image (click, etc)
    playBtn.inputEnabled = true;

    // When we click on the button, it will do the below. playGame is the function it will run when clicked.
    // game.input.onDown.addOnce(playGame, this);
    playBtn.events.onInputDown.add(playGame, this);
  },
};

// this function will run when the playBtn it clicked:
function playGame () {

tellServerToStartGame();

};



// this creates out new Game:
var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', 'gameDiv')


// State manager:
// here we will add new states ass we create them:

game.state.add('main', main);
// game.state.add('avatarSelect', avatarSelect);
// game.state.add('levelSelect', levelSelect);
// game.state.add('results', results);

game.state.add('play', play);

// This is used to start a game state:
game.state.start('main');
