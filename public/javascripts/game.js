var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'public/images/sky.png');
    game.load.image('ground', 'public/images/platform.png');

    game.load.spritesheet('star', 'public/images/star.png', 24, 22);
    game.load.spritesheet('health', 'public/images/health.png', 32, 32);

    game.load.spritesheet('guy', 'public/images/guy.png', 80, 108);
    game.load.spritesheet('girl', 'public/images/girl.png', 80, 108);
}

// this is the very first fucntion that is run, and sets up our game:

function create() {
    buildGame();
    buildLevel(space);
    buildPlayers();
    buildItems();

};

// this is the game loop that will run over and over again. About every 1 second.

function update() {
    // gets the current level from the levels.js
    var level = currentLevel;

    for(var i = 0; i < allPlayers.length; i++){
        var currentPlayer = allPlayers[i];
        checkFace(currentPlayer);
        currentPlayer.getItem()

        game.physics.arcade.collide(currentPlayer.avatar, platforms);


        if (currentPlayer.hurt == false){
            currentPlayer.falling();
            currentPlayer.checkMovement();
        };

        if(currentPlayer.playerDead(level)){
            restartGame();
        };
    };

    for(var i = 0; i < allItems.length; i++){
        game.physics.arcade.collide(allItems[i].avatar, platforms);


    }
};


function buildLevel(level){
    level.build();
};


function buildGame(){

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');
};

function buildPlayers(){
    for(var i = 0; i < allPlayers.length; i++){
        allPlayers[i].avatar = game.add.sprite(((i + 1)* 200), game.world.height - 510, allPlayers[i].persona);
        game.physics.enable(allPlayers[i].avatar, Phaser.Physics.ARCADE);
        allPlayers[i].avatar.anchor.setTo(.5, 1);
        allPlayers[i].avatar.body.bounce.setTo(0, 0.1);
        allPlayers[i].avatar.body.gravity.y = 400;
        // allPlayers[i].avatar.health = 0;
        allPlayers[i].buildAnimations();
        allPlayers[i].lives = lifesPerPerson;

        if(i%2 != 0){
            allPlayers[i].isLeft = true;
        }

        buildHud(allPlayers[i]);
        buildPlayerControls(allPlayers[i]);
    };
};

function restartGame() {
    for(var i = 0; i< allPlayers.length; i++){
        allPlayers[i].lives = lifesPerPerson;
        game.state.start(game.state.current);
    }
};

