var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'public/images/sky.png');
    game.load.image('ground', 'public/images/platform.png');

    game.load.spritesheet('star', 'public/images/star.png', 24, 22);
    game.load.spritesheet('health', 'public/images/health.png', 32, 32);

    game.load.spritesheet('guy', 'public/images/guy.png', 80, 108);
    game.load.spritesheet('girl', 'public/images/girl.png', 80, 108);
}

allPlayers = [];
allItems = [];


function killZone(){
    this.top = '';
    this.bottom = '';
    this.left = '';
    this.right = '';
}

var killZone = new killZone();


function Player(persona){
    this.playerName = '';
    this.percent = 1;
    this.isLeft = false;
    this.persona = persona;
    this.avatar = "";
    this.hurt = false;
    this.hud = '';
    this.attacks = {punch: 1, kick: 1, airKick: 2, airPunch: 2, superPunch: 3, superKick: 3};
    this.attackPercent ='';
    this.jumpCount = 0;
    this.isJumping = true;
    this.isDown = false;
    this.lives = 0;
    this.lastFrame = 0;
};

function Item(name, effect, sprite, animation){
    this.name = name;
    this.effect = effect;
    this.avatar = '';
    this.animation = animation
}


var star = new Item('star', -10, '', 'flash')
var health = new Item('health', -10, '', 'health')
allItems.push(star);
allItems.push(health);

Item.prototype.buildItem = function(){
    this.avatar = game.add.sprite(300, game.world.height - 510, this.name);
    game.physics.enable(this.avatar, Phaser.Physics.ARCADE);
    this.avatar.anchor.setTo(0.5, 0.5);
    this.avatar.body.bounce.setTo(0, 0.5);
    this.avatar.body.gravity.y = 100;
    this.buildAnimations();
    this.avatar.animations.play(this.animation)
};

Item.prototype.buildAnimations = function(){
    this.avatar.animations.add(this.animation, [0, 1, 2], 15, true);
};

Item.prototype.removeItem = function(){
    this.avatar.kill();
};

Player.prototype.moveLeft = function() {
    if(this.avatar.body.touching.down){
        this.avatar.animations.play('walk');
    };

    this.isLeft = true;
    this.avatar.body.velocity.x = -150;
};

Player.prototype.moveRight = function() {
    if(this.avatar.body.touching.down){
        this.avatar.animations.play('walk');
    };
    this.isLeft = false;
    this.avatar.body.velocity.x = 150;
};

Player.prototype.punch = function() {
        this.attackPercent = this.attacks['punch'];

        this.avatar.animations.play('punch');
        var player = this;

        for(var i = 0; i < allPlayers.length; i++){

            if(player.playerName != allPlayers[i].playerName && this.touching(allPlayers[i])){
                allPlayers[i].hurt = true;
               attackPlayer(this, allPlayers[i]);
            };
        };
};

Player.prototype.kick = function() {

    if(!this.avatar.body.touching.down == true){
        this.avatar.animations.play('airKick');
        this.attackPercent = this.attacks['airKick'];

        player = this
        setTimeout(function(){
                player.avatar.animations.play('jump');
        }, 300);
    }

    else{
        this.attackPercent = this.attacks['kick'];
        this.avatar.animations.play('kick');
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
    if(this.avatar.body.touching.down){
        this.attackPercent = this.attacks['superKick'];
        this.avatar.animations.play('superKick');
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
    if(this.avatar.body.touching.down){
        this.attackPercent = this.attacks['superPunch'];
        this.avatar.animations.play('superPunch');
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
    this.avatar.body.velocity.y = -300;
    this.avatar.animations.play('jump');
};

Player.prototype.down = function() {
    if(this.avatar.body.touching.down){
        this.avatar.animations.play('down');
        this.isDown = true;
    }
    else{
        if(this.avatar.body.velocity.y > 300){
            this.avatar.body.velocity.y = 200
        }
        this.avatar.body.velocity.y += 1.5;
    }
};

Player.prototype.playerDead = function(){
    if (this.lives != 0){
        var posX = this.avatar.body.x;
        var posY = this.avatar.body.y;
        if(posX < killZone.left|| posX > killZone.right || posY > killZone.top || posY < killZone.bottom){

            this.avatar.kill();
            this.percent = 0;
            this.lives -= 1;
            this.hud.text = this.playerName + ": " + 0 + "  Lives: "  + this.lives;
            this.avatar.allowGravity = false;
            this.resetVelocity();
            this.avatar.revive();
            this.avatar.body.x = 400;
            this.avatar.body.y = game.world.height -600;
            this.avatar.allowGravity = true;
            this.avatar.animations.play('stand');

        };
        return false;
    }
    else {
        return true
    }
};

Player.prototype.allKeysUp = function (){
    if(this.keyLeft.isUp && this.keyRight.isUp && this.keyJump.isUp && this.avatar.body.touching.down && this.keyKick.isUp && this.keySuperKick.isUp && this.keyPunch.isUp && this.keySuperPunch.isUp && this.keyDown.isUp){
        return true;
    }

    else{
        return false;
    }
}

Player.prototype.resetVelocity = function (){
    if(this.hurt == false){
        this.avatar.body.velocity.x = 0;
        this.avatar.body.velocity.y = 0;
    };
};

Player.prototype.touching = function (otherplayer){

    if (this.avatar.body.x  <= (otherplayer.avatar.body.x + 64) &&  otherplayer.avatar.body.x <= (this.avatar.body.x + 64)
            && this.avatar.body.y  <= (otherplayer.avatar.body.y + 64) &&  otherplayer.avatar.body.y <= (this.avatar.body.y + 64) ) {
        return true;
    }
    else {
        return false;
    }
};

Player.prototype.touchingItem = function (item){

    if (this.avatar.body.x  <= (item.avatar.body.x + 16) &&  item.avatar.body.x <= (this.avatar.body.x + 16)
            && this.avatar.body.y  <= (item.avatar.body.y + 16) &&  item.avatar.body.y <= (this.avatar.body.y + 16) ) {
        return true;
    }
    else {
        return false;
    }
};

Player.prototype.buildAnimations = function(){
    this.avatar.animations.add('stand', [0, 1, 2], 15, true);
    this.avatar.animations.add('walk', [4, 5, 6, 7, 8, 9, 10,11], 15, true);
    this.avatar.animations.add('jump', [14, 13, 12, 13], 12, false);
    this.avatar.animations.add('down', [3], 15, true);
    this.avatar.animations.add('punch', [17, 18, 17, 0], 15, false);
    this.avatar.animations.add('airPunch', [33, 34, 35, 34, 33], 15, false);
    this.avatar.animations.add('superPunch', [19, 20, 21, 20, 19, 0], 15, false);
    this.avatar.animations.add('kick', [24, 25, 24, 0], 15, false);
    this.avatar.animations.add('airKick', [30, 31, 32, 32, 32, 32, 31, 30, ], 15, false);
    this.avatar.animations.add('superKick', [26, 27, 28, 29, 28, 27, 26, 0], 15, false);

    this.avatar.animations.add('hurt', [23, 22], 10, false);

}

Player.prototype.falling = function(){
    if (this.avatar.body.touching.down){
        this.jumpCount = 0;
    }
};


Player.prototype.checkMovement = function(){
    if (this.allKeysUp() && this.hurt == false){
        this.resetVelocity(this);
        this.avatar.frame = 0
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

Player.prototype.getItem = function(){
    for(var i = 0; i < allItems.length; i++){
        if(this.touchingItem(allItems[i])){
            allItems[i].removeItem();
        };
    };

};

var lifesPerPerson = 2;
var player1 = new Player('guy');
player1.avatar.frame = 0
player1.playerName = 'Player 1'
allPlayers.push(player1);

var player2 = new Player('girl');
player2.playerName = 'Player 2'
player2.avatar.frame = 0
allPlayers.push(player2);

var hudPosX = 16;
var hudPosY = 16;


function create() {
    buildGame();
    buildLevel();
    buildPlayers();
    buildItems();

};

function update() {

    for(var i = 0; i < allPlayers.length; i++){
        var currentPlayer = allPlayers[i];
        checkFace(currentPlayer);
        currentPlayer.getItem()

        game.physics.arcade.collide(currentPlayer.avatar, platforms);


        if (currentPlayer.hurt == false){
            currentPlayer.falling();
            currentPlayer.checkMovement();
        };

        if(currentPlayer.playerDead()){
            restartGame();
        };
    };

    for(var i = 0; i < allItems.length; i++){
        game.physics.arcade.collide(allItems[i].avatar, platforms);


    }


};

function buildItems(){
    for(var i = 0; i < allItems.length; i++){
        allItems[i].buildItem();
    };
}

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
        pice1.avatar.scale.x = -1;
    }
    else {
       pice1.avatar.scale.x = 1;
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

        hurtPlayer.avatar.allowGravity = false;

        if (attackingPlayer.isLeft){
            hurtPlayer.isLeft = false;
            hurtPlayer.avatar.body.velocity.setTo (-(hurtPlayer.percent * 1.5), -(hurtPlayer.percent * 3));
        }
        else {
            hurtPlayer.isLeft = true;
            hurtPlayer.avatar.body.velocity.setTo ((hurtPlayer.percent * 1.5), -(hurtPlayer.percent * 3));
        }

        hurtPlayer.avatar.animations.play('hurt');

        updateHud(hurtPlayer);

        setTimeout(function() {
            hurtPlayer.percent += (attackingPlayer.attackPercent/ 150)
            hurtPlayer.avatar.body.velocity.x = 0;
            hurtPlayer.avatar.body.velocity.y = 0;
            hurtPlayer.avatar.allowGravity = true;
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