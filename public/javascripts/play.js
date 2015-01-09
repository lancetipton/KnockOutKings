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
        buildLevel(space);
        buildPlayers();
        buildItems();

    },

    // this is the game loop that will run over and over again. About every 1 second.

    update: function() {
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
    }
};

function buildGame(){
    game.physics.startSystem(Phaser.Physics.ARCADE);
};

