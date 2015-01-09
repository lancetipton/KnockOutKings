//  Play game state. Where the action happends.
var play = {

    preload: function() {
        // load images for the level:
        game.load.image(currentLevel.name, currentLevel.backgroundLoad);
        game.load.image('platform', currentLevel.groundLoad);


        // load images for the items:
        game.load.spritesheet('star', 'public/images/star.png', 24, 22);
        game.load.spritesheet('health', 'public/images/health.png', 32, 32);

        game.load.spritesheet('guy', 'public/images/guy.png', 80, 108);
        game.load.spritesheet('girl', 'public/images/girl.png', 80, 108);
    },

    // this is the very first fucntion that is run, and sets up our game:

    create: function() {

        buildGame();
        buildLevel(currentLevel);
        buildPlayers();

    },

    // this is the game loop that will run over and over again. About 60 FPS.
    update: function() {
        // gets the current level from the levels.js

        for(var i = 0; i < allPlayers.length; i++){
            currentPlayer = allPlayers[i];
            checkFace(currentPlayer);

            game.physics.arcade.collide(currentPlayer.avatar, platforms);

            if (currentPlayer.hurt == false){
                currentPlayer.falling();
                currentPlayer.checkMovement();
            };

            if(currentPlayer.playerDead(currentLevel)){
                restartGame();
            };

            for(var i = 0; i < allItems.length; i++){
                game.physics.arcade.collide(currentPlayer.avatar, allItems[i].avatar, hitItem.bind(allItems[i]), null, this);

            };


        };

        // check collision with items:
        for(var i = 0; i < allItems.length; i++){
            game.physics.arcade.collide(allItems[i].avatar, platforms);
        };

        allowItem = Math.floor(Math.random() * 100)

        if(allowItem < 2){
            buildNewItem()
        };




    }
};

function buildGame(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
};

function hitItem(playerAvatar, item){
    currentPlayer.hasItem = this;
    currentPlayer.gotItem();
    this.removeItem();
}










// This is the start screen game state. To be implimented.
var main = {
  preload: function() {
    // load the play button into this game state:
    game.load.image('play', 'public/images/gui/play.png');
  },

  create: function() {

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
    // This starts the game state play. Which is the actuall game:
    game.state.start('levelSelect');
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
    game.load.image('spaceLevel', 'public/images/gui/space.png');
    game.load.image('rooftopLevel', 'public/images/gui/rooftopBtn.png');

  },

  create: function() {
    var spaceLevelBtn = game.add.sprite(80, 50, 'spaceLevel');
    var rooftopLevelBtn = game.add.sprite(520, 50, 'rooftopLevel');

    spaceLevelBtn.inputEnabled = true;
    rooftopLevelBtn.inputEnabled = true;

    spaceLevelBtn.events.onInputDown.add(selectSpace, this);
    rooftopLevelBtn.events.onInputDown.add(selectrRooftop, this);

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


function selectSpace (){
    currentLevel = space;
    game.state.start('play');
};

function selectrRooftop (){
    currentLevel = rooftop;
    game.state.start('play');
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








