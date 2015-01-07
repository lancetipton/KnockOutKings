var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'public/images/sky.png');
    game.load.image('ground', 'public/images/platform.png');
    game.load.image('star', 'public/images/star.png');
    game.load.spritesheet('guy', 'public/images/guy.png', 80, 108);
    game.load.spritesheet('girl', 'public/images/girl.png', 80, 108);

}

allPlayers = [];


function killZone(){
    this.top = '';
    this.bottom = '';
    this.left = '';
    this.right = '';
}

var killZone = new killZone();


function Player(persona){
    this.playerName = ''
    this.percent = 1;
    this.isLeft = false;
    this.persona = persona;
    this.guy = "";
    this.hurt = false;
    this.hud = '';
    this.attacks = {punch: 1, kick: 1, airKick: 3, superPunch: 2, superKick: 2};
    this.attackPercent ='';
    this.jumpCount = 0;
    this.isJumping = true;
    this.isDown = false;
    this.lives = 0;
    this.lastFrame = 0
};

Player.prototype.moveLeft = function() {
    if(this.guy.body.touching.down){
        this.guy.animations.play('walk');
    };
    this.isLeft = true;
    this.guy.body.velocity.x = -150;
};

Player.prototype.moveRight = function() {
    if(this.guy.body.touching.down){
        this.guy.animations.play('walk');
    };
    this.isLeft = false;
    this.guy.body.velocity.x = 150;
};

Player.prototype.punch = function() {
        this.attackPercent = this.attacks['punch'];

        this.guy.animations.play('punch');
        var player = this;

        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
                allPlayers[i].hurt = true;
               attackPlayer(this, allPlayers[i]);
            };
        };
};

Player.prototype.kick = function() {

    if(!this.guy.body.touching.down == true){
        this.guy.animations.play('airKick');
        this.attackPercent = this.attacks['airKick'];

        player = this
        setTimeout(function(){
                player.guy.animations.play('jump');
        }, 300);
    }

    else{
        this.attackPercent = this.attacks['kick'];
        this.guy.animations.play('kick');
    };

    var player = this;
    for(var i = 0; i < allPlayers.length; i++){

    if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
            allPlayers[i].hurt = true;
            attackPlayer(this, allPlayers[i]);
        };
    };
};


Player.prototype.superKick = function() {
    if(this.guy.body.touching.down){
        this.attackPercent = this.attacks['superKick'];
        this.guy.animations.play('superKick');
        var player = this;

        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
                allPlayers[i].hurt = true;
               attackPlayer(this, allPlayers[i]);

            };
        };
    };
};

Player.prototype.superPunch = function() {
    if(this.guy.body.touching.down){
        this.attackPercent = this.attacks['superPunch'];
        this.guy.animations.play('superPunch');
        var player = this;

        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
                allPlayers[i].hurt = true;
               attackPlayer(this, allPlayers[i]);
            };
        };
    };
};


Player.prototype.jump = function() {
    this.guy.body.velocity.y = -300;
    this.guy.animations.play('jump');
};

Player.prototype.down = function() {
    if(this.guy.body.touching.down){
        this.guy.animations.play('down');
        this.isDown = true;
    }
    else{
        if(this.guy.body.velocity.y > 300){
            this.guy.body.velocity.y = 200
        }
        this.guy.body.velocity.y += 1.5;
    }
};

Player.prototype.playerDead = function(){
    if (this.lives != 0){
        var posX = this.guy.body.x;
        var posY = this.guy.body.y;
        if(posX < killZone.left|| posX > killZone.right || posY > killZone.top || posY < killZone.bottom){

            this.guy.kill();
            this.percent = 0;
            this.lives -= 1;
            this.hud.text = this.playerName + ": " + 0 + "  Lives: "  + this.lives;
            this.guy.allowGravity = false;
            this.resetVelocity();
            this.guy.revive();
            this.guy.body.x = 400;
            this.guy.body.y = game.world.height -600;
            this.guy.allowGravity = true;
            this.guy.animations.play('stand');

        };
        return false;
    }
    else {
        return true
    }

};

Player.prototype.allKeysUp = function (){
    if(this.keyLeft.isUp && this.keyRight.isUp && this.keyJump.isUp && this.guy.body.touching.down && this.keyKick.isUp && this.keySuperKick.isUp && this.keyPunch.isUp && this.keySuperPunch.isUp && this.keyDown.isUp){
        return true;
    }

    else{
        return false;
    }
}

Player.prototype.resetVelocity = function (){
    if(this.hurt == false){
        this.guy.body.velocity.x = 0;
        this.guy.body.velocity.y = 0;
    };
};

Player.prototype.touching = function (otherPlayer){
    if (this.guy.body.x  <= (otherPlayer.guy.body.x + 64) &&  otherPlayer.guy.body.x <= (this.guy.body.x + 64)
            && this.guy.body.y  <= (otherPlayer.guy.body.y + 64) &&  otherPlayer.guy.body.y <= (this.guy.body.y + 64) ) {
        return true;
    };
};

Player.prototype.buildAnimations = function(){
    this.guy.animations.add('stand', [0], 10, true);
    this.guy.animations.add('walk', [4, 5, 6, 7, 8, 9, 10,11], 10, true);
    this.guy.animations.add('jump', [14, 13, 12, 13], 5, false);
    this.guy.animations.add('down', [3], 10, true);
    this.guy.animations.add('punch', [18], 10, true);
    this.guy.animations.add('kick', [30], 10, true);
    this.guy.animations.add('airKick', [35], 10, true);
    this.guy.animations.add('superKick', [31, 32, 33, 34], 10, true);
    this.guy.animations.add('superPunch', [19, 20, 21], 10, true);
    this.guy.animations.add('hurt', [27, 28], 10, false);
    this.guy.animations.add('die', [22, 23, 24, 25, 26], 10, true);

}

Player.prototype.falling = function(){
    if (this.guy.body.touching.down){
        this.jumpCount = 0;
    };
};


Player.prototype.checkMovement = function(){
    if (this.allKeysUp() && this.hurt == false){
        this.resetVelocity(this);
        this.guy.frame = 0
    };

    this.keyLeft.onDown.add(moveLeft.bind(this), this);
    this.keyRight.onDown.add(moveRight.bind(this), this);
    this.keyDown.onDown.add(down.bind(this), this);
    this.keySuperKick.onDown.add(superKick.bind(this), this);
    this.keySuperPunch.onDown.add(superPunch.bind(this), this);
    this.keyPunch.onDown.add(punch.bind(this), this);
    this.keyKick.onDown.add(kick.bind(this), this);

    if(this.keyJump.isDown){
        this.isJumping = true;
        this.keyJump.onDown.add(jumpCheck.bind(this), this);
    };
};

var lifesPerPerson = 2;
var player1 = new Player('guy');
player1.guy.frame = 0
player1.playerName = 'Player 1'
allPlayers.push(player1);

var player2 = new Player('girl');
player2.playerName = 'Player 2'
player2.guy.frame = 0
allPlayers.push(player2);

var hudPosX = 16
var hudPosY = 16;


function create() {

    buildGame();
    buildLevel();
    buildPlayers();

};

function update() {

    for(var i = 0; i < allPlayers.length; i++){
        var currentPlayer = allPlayers[i];
        checkFace(currentPlayer);

        game.physics.arcade.collide(currentPlayer.guy, platforms);

        if (currentPlayer.hurt == false){
            currentPlayer.falling();
            currentPlayer.checkMovement();
        };


        if(currentPlayer.playerDead()){
            restartGame();
        };

    };

};

function buildGame(){
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    killZone.top = game.world.height + 250;
    killZone.bottom = -(game.world.height - 250);
    killZone.left = -(game.world.width - 250);
    killZone.right = game.world.width + 250;
};

function buildLevel(){

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    var ground = platforms.create(200, game.world.height - 100, 'ground');

    ground.body.immovable = true;

    var ledge = platforms.create(600, 300, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 200, 'ground');
    ledge.body.immovable = true;
};

function buildPlayers(){
    for(var i = 0; i < allPlayers.length; i++){
        allPlayers[i].guy = game.add.sprite(((i + 1)* 200), game.world.height - 510, allPlayers[i].persona);
        game.physics.enable(allPlayers[i].guy, Phaser.Physics.ARCADE);
        allPlayers[i].guy.anchor.setTo(.5, 1);
        allPlayers[i].guy.body.bounce.setTo(0, 0.1);
        allPlayers[i].guy.body.gravity.y = 400;
        allPlayers[i].buildAnimations();
        allPlayers[i].lives = lifesPerPerson;

        if(i%2 != 0){
            allPlayers[i].isLeft = true;
        }

        buildHud(allPlayers[i]);
        buildPlayerControls(allPlayers[i]);
    };
};

function buildPlayerControls(player){
    if (player.playerName == 'Player 1'){
        Player.prototype.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        Player.prototype.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        Player.prototype.keyJump = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        Player.prototype.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        Player.prototype.keyPunch = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
        Player.prototype.keyKick = game.input.keyboard.addKey(Phaser.Keyboard.M);
        Player.prototype.keySuperKick = game.input.keyboard.addKey(Phaser.Keyboard.N);
        Player.prototype.keySuperPunch = game.input.keyboard.addKey(Phaser.Keyboard.L);
    }
    else {
    player.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
    player.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
    player.keyJump = game.input.keyboard.addKey(Phaser.Keyboard.W);
    player.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.S);
    player.keyPunch = game.input.keyboard.addKey(Phaser.Keyboard.F);
    player.keyKick = game.input.keyboard.addKey(Phaser.Keyboard.G);
    player.keySuperKick = game.input.keyboard.addKey(Phaser.Keyboard.R);
    player.keySuperPunch = game.input.keyboard.addKey(Phaser.Keyboard.T);
    };
};

function buildHud(player){
    player.hud = game.add.text(hudPosX, hudPosY, player.playerName + ': 0  Lives: ' + player.lives, { fontSize: '12px', fill: '#000' });
    hudPosX += 250;
}

function restartGame() {
    for(var i = 0; i< allPlayers.length; i++){
        allPlayers[i].lives = lifesPerPerson;
        game.state.start(game.state.current);
    }
};

function checkFace(pice1){
    if (pice1.isLeft){
        pice1.guy.scale.x = -1;
    }
    else {
       pice1.guy.scale.x = 1;
    };
};

jumpCheck = function(){
    if(this.isJumping){
        if (this.jumpCount < 2){
            this.jump();
            this.jumpCount ++;
            this.isJumping = false;
        };
    };

};

moveLeft = function(){
    this.moveLeft();
};
moveRight = function(){
    this.moveRight();
};

down = function(){
    this.down();
};

kick = function(){
    this.kick();
};

punch = function(){
    this.punch();
};

superKick = function(){
    this.superKick();
};
superPunch = function(){
    this.superPunch();
}

attackPlayer = function(attackingPlayer, hurtPlayer){

        checkFace(hurtPlayer)

        hurtPlayer.guy.allowGravity = false;

        if (attackingPlayer.isLeft){
            hurtPlayer.isLeft = false;
            hurtPlayer.guy.body.velocity.setTo (-(hurtPlayer.percent * 1.5), -(hurtPlayer.percent * 3));
        }
        else {
            hurtPlayer.isLeft = true;
            hurtPlayer.guy.body.velocity.setTo ((hurtPlayer.percent * 1.5), -(hurtPlayer.percent * 3));
        }

        hurtPlayer.guy.animations.play('hurt');

        updateHud(hurtPlayer);

        setTimeout(function() {
            hurtPlayer.percent += (attackingPlayer.attackPercent/ 150)
            hurtPlayer.guy.body.velocity.x = 0;
            hurtPlayer.guy.body.velocity.y = 0;
            hurtPlayer.guy.allowGravity = true;
            hurtPlayer.hurt = false;

        },hurtWaitTimeout(hurtPlayer));

};

hurtWaitTimeout = function(hurtPlayer){
    if(hurtPlayer.percent < 50 ){
        return 200
    }
    else {
        return hurtPlayer.percent * 4
    };
}

updateHud = function(player){
    player.hud.text = player.playerName + ": " + Math.round(player.percent)  + "  Lives: "  + player.lives;

}