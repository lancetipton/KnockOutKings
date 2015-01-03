var game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'public/images/sky.png');
    game.load.image('ground', 'public/images/platform.png');
    game.load.image('star', 'public/images/star.png');
    game.load.spritesheet('guy', 'public/images/guy.png', 80, 108);

}





function Player(){
    this.playerName = ''
    this.percent = 1;
    this.isLeft = false;
    this.guy = "";
    this.controls = "";
    this.hurt = false;
    this.hud = '';
    this.attacks = {punch: 20, kick: 30, superPuch: 15, superKick: 15};
    this.attackPercent ='';
    this.jumpOne = false;
    this.jumpTwo = false;
    this.lastFrame = 0;
};

var player1 = new Player();
player1.playerName = 'Player 1'

var player2 = new Player();
player2.playerName = 'Player 2'


function create() {



    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 32, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // The player1 and its settings
    player1.guy = game.add.sprite(128, game.world.height - 200, 'guy');
    player1.guy.anchor.setTo(.5, 1);

    player2.guy = game.add.sprite(32, game.world.height - 200, 'guy');
    player2.guy.anchor.setTo(.5, 1);
    //  We need to enable physics on the player1
    game.physics.arcade.enable(player1.guy);
    game.physics.arcade.enable(player2.guy);

    //  Player1 physics properties. Give the little guy a slight bounce.
    player1.guy.body.bounce.y = 0.1;
    player1.guy.body.gravity.y = 200;
    player1.guy.body.collideWorldBounds = true;

    player2.guy.body.bounce.y = 0.1;
    player2.guy.body.gravity.y = 200;
    player2.guy.body.collideWorldBounds = true;

    //  Our two animations, walking left and right, next number is frames per second


    player1.guy.animations.add('p1walk', [4, 5, 6, 7, 8, 9, 10,11], 10, true);
    player1.guy.animations.add('p1Punch', [18], 10, true);
    player1.guy.animations.add('p1Kick', [30], 10, true);
    player1.guy.animations.add('hurt', [27, 28], 10, true);
    player1.guy.animations.add('die', [22, 23, 24, 25, 26], 10, true);

    player2.guy.animations.add('p2Walk', [4, 5, 6, 7, 8, 9, 10,11], 10, true);
    player2.guy.animations.add('p2Punch', [18], 10, true);
    player2.guy.animations.add('p2Kick', [30], 10, true);
    player2.guy.animations.add('hurt', [27, 28], 10, true);
    player2.guy.animations.add('die', [22, 23, 24, 25, 26], 10, true);



    player1.hud = game.add.text(16, 16, 'Player1: 0', { fontSize: '10px', fill: '#000' });
    player2.hud = game.add.text(430, 16, 'Player2: 0', { fontSize: '10px', fill: '#000' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    p1Punch = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
    p1Kick = game.input.keyboard.addKey(Phaser.Keyboard.M);

    p2Left = game.input.keyboard.addKey(Phaser.Keyboard.A);
    p2Right = game.input.keyboard.addKey(Phaser.Keyboard.D);
    p2Jump = game.input.keyboard.addKey(Phaser.Keyboard.W);
    p2Punch = game.input.keyboard.addKey(Phaser.Keyboard.F);
    p2Kick = game.input.keyboard.addKey(Phaser.Keyboard.G);

}

function update() {



    //  Collide the player1 and the stars with the platforms
    game.physics.arcade.collide(player1.guy, platforms);
    game.physics.arcade.collide(player2.guy, platforms);

    if (!player1.guy.body.touching.down){
        player1.guy.frame = player1.lastFrame;
    };
    if (!player2.guy.body.touching.down){
        player2.guy.frame = player2.lastFrame;
    };

    resetVelocity(player1);
    resetVelocity(player2);


    if (cursors.left.isDown)
    {
        player1.isLeft = true;


        player1.guy.scale.x = -1;
        player1.guy.body.velocity.x = -150;
        player1.guy.animations.play('p1walk');

    }
    else if (cursors.right.isDown)
    {

        player1.isLeft = false;

        player1.guy.scale.x = 1;
        player1.guy.body.velocity.x = 150;
        player1.guy.animations.play('p1walk');
    }
    else
    {

        player1.guy.animations.stop();

        if (player1.isLeft == true){
            player1.guy.scale.x = -1;
            player1.guy.frame = player1.lastFrame;
        }
        else {
            player1.guy.scale.x = 1;
            player1.guy.frame = player1.lastFrame;
        };

    };

    if (p1Punch.isDown){

        player1.attackPercent = player1.attacks['punch'];

        if (player1.isLeft == true){
            player1.guy.scale.x = -1;
        }
        else {
            player1.guy.scale.x = 1;
        };

        player1.guy.animations.play('p1Punch');

        if(touching(player1.guy, player2.guy)){
            player2.hurt = true;
        };
    };


    if (cursors.up.isDown){
        if(!player1.jumpOne){
            player1.guy.frame = 12;
            player1.guy.body.velocity.y = -300;
            player1.lastFrame = 12;
            player1.jumpOne = true;
        }
        else if(player1.jumpOne && !player1.jumpTwo){
            player1.guy.frame = 12;
            player1.guy.body.velocity.y = -300;
            player1.lastFrame = 12;
            player1.jumpTwo = true;
        };

    };


    if (p1Kick.isDown){

        player1.attackPercent = player1.attacks['kick'];

        if (player1.isLeft == true){
            player1.guy.scale.x = -1;
        }
        else {
            player1.guy.scale.x = 1;
        };

        player1.guy.animations.play('p1Kick');

        if(touching(player1.guy, player2.guy)){
            player2.hurt = true;
        };
    };



    if (player1.guy.body.touching.down){
        player1.jumpOne = false;
        player1.jumpTwo = false;
        player1.lastFrame = 0;
    };


// Player 2 movement:

    if (p2Left.isDown)
    {
        player2.isLeft = true;
        player2.guy.scale.x = -1;
        player2.guy.body.velocity.x = -150;
        player2.guy.animations.play('p2Walk');

    }
    else if (p2Right.isDown)
    {

        player2.isLeft = false;
        player2.guy.scale.x = 1;
        player2.guy.body.velocity.x = 150;
        player2.guy.animations.play('p2Walk');
    }
    else
    {
        //  Stand still
        player2.guy.animations.stop();
        if (player2.isLeft == true){
            player2.guy.scale.x = -1;
            player2.guy.frame = player2.lastFrame;
        }
        else{
            player2.guy.scale.x = 1;
            player2.guy.frame = player2.lastFrame;
        }

    };

    if (p2Punch.isDown){

        player2.attackPercent = player2.attacks['punch'];

        if (player2.isLeft == true){
            player2.guy.scale.x = -1;
        }
        else {
            player2.guy.scale.x = 1;
        };

        player2.guy.animations.play('p2Punch');

        if(touching(player2.guy, player1.guy)){
            player1.hurt = true;
        };


    };

    if (p2Jump.isDown){
        if(!player2.jumpOne){
            player2.guy.frame = 12;
            player2.guy.body.velocity.y = -300;
            player2.lastFrame = 12;
            player2.jumpOne = true;
        }
        else if(player2.jumpOne && !player2.jumpTwo){
            player2.guy.frame = 12;
            player2.guy.body.velocity.y = -300;
            player2.lastFrame = 12;
            player2.jumpTwo = true;
        };
    };

    if (p2Kick.isDown){

        player2.attackPercent = player2.attacks['kick'];

        if (player2.isLeft == true){
            player2.guy.scale.x = -1;
        }
        else {
            player2.guy.scale.x = 1;
        };

        player2.guy.animations.play('p2Kick');

        if(touching(player2.guy, player1.guy)){
            player1.hurt = true;
        };
    };


    if (player2.guy.body.touching.down){
        player2.jumpOne = false;
        player2.jumpTwo = false;
        player2.lastFrame = 0;
    };


    if (player1.dead || player2.dead){
        gameEnd();
    }
    else{
        playerHurt(player2, player1);
        playerHurt(player1, player2);

    };

};

function resetVelocity(player){
        player.guy.body.velocity.x = 0
}

function touching(pice1, pice2){
    if (pice1.body.x  <= (pice2.body.x + 64) &&  pice2.body.x <= (pice1.body.x + 64)
            && pice1.body.y  <= (pice2.body.y + 64) &&  pice2.body.y <= (pice1.body.y + 64) ) {
        return true;
    };
};

function playerHurt(pice1, pice2){


    if (pice1.hurt){
        pice1.percent += 1
        if (pice2.isLeft){
            pice1.guy.scale.x = 1;
            pice1.guy.body.velocity.y = -(pice1.percent * 1.9)
            pice1.guy.body.velocity.x = -(pice1.percent * pice2.attackPercent);
            pice1.lastFrame = 28;

        }
        else{
            pice1.guy.scale.x = -1;
            pice1.guy.body.velocity.y = -(pice1.percent * 1.9)
            pice1.guy.body.velocity.x = (pice1.percent * pice2.attackPercent);
            pice1.lastFrame = 28;

        };


        pice1.hud.text = pice1.playerName + ": " + pice1.percent;
        pice1.guy.animations.play('hurt');
        pice1.hurt = false;

    };
};

function hitFly(pice1){
    pice1.guy.frame = 25;
};
