allPersonas = ['mike', 'tara', 'mario', 'fatty']

allPlayers = [];
newPlayers = [];
allPlayersIds = [];

// set huds for the players. this needs to be done better.
// this sets the default posision, then uses it to set the posisiton of the hud for the player.
var hudPosX = 16;
var hudPosY = 16;

function Player(persona, posX, posY){
    this.id = '';
    this.percent = 1;
    this.isLeft = false;
    this.persona = persona;
    this.avatar = "";
    this.hurt = false;
    this.hud = '';
    this.attacks = {punch: 1, kick: 1, airKick: 2, airPunch: 2, superPunch: 3, superKick: 3, special1: 4, special2: 4 };
    this.attackPercent ='';
    this.jumpCount = 0;
    this.isJumping = true;
    this.isDown = false;
    this.lives = 0;
    this.lastFrame = 0;
    this.hasItem = '';
    this.posX = 0;
    this.posY = 0;
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
    if(!this.avatar.body.touching.down == true){
        this.avatar.animations.play('airPunch');
        this.attackPercent = this.attacks['airPunch'];

        player = this
        setTimeout(function(){
                player.avatar.animations.play('jump');
        }, 300);
    }
    else{
        this.attackPercent = this.attacks['punch'];
        this.avatar.animations.play('punch');
    }

    var player = this;
    checkIfPlayerIsHurt(player);
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
    checkIfPlayerIsHurt(player);
};


Player.prototype.superKick = function() {
    if(this.avatar.body.touching.down){
        this.attackPercent = this.attacks['superKick'];
        this.avatar.animations.play('superKick');
        var player = this;
        checkIfPlayerIsHurt(player);
    };
};


Player.prototype.superPunch = function() {
    if(this.avatar.body.touching.down){
        this.attackPercent = this.attacks['superPunch'];
        this.avatar.animations.play('superPunch');
        var player = this;
        checkIfPlayerIsHurt(player);
    };
};

Player.prototype.special1 = function() {
    if(this.avatar.body.touching.down){
        this.resetVelocity();
        this.attackPercent = this.attacks['special1'];
        this.avatar.animations.play('special1');
        var player = this;
        setTimeout(function() {
            checkIfPlayerIsHurt(player);
        },500);

    };
};

Player.prototype.special2 = function() {
    if(this.avatar.body.touching.down){
        this.resetVelocity();
        this.attackPercent = this.attacks['special2'];
        this.avatar.animations.play('special2');
        var player = this;
        setTimeout(function() {
            checkIfPlayerIsHurt(player);
        },500);
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

Player.prototype.playerDead = function(level){
    if (this.lives != 0){
        var posX = this.avatar.body.x;
        var posY = this.avatar.body.y;
        if(posX < level.killZone.left|| posX > level.killZone.right || posY > level.killZone.top || posY < level.killZone.bottom){

            this.avatar.kill();
            this.percent = 0;
            this.lives -= 1;
            this.hud.text = this.id + ": " + 0 + "  Lives: "  + this.lives;
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


Player.prototype.buildAnimations = function(){
    this.avatar.animations.add('stand', [0, 1, 2], 15, true);
    this.avatar.animations.add('walk', [4, 5, 6, 7, 8, 9, 10,11], 15, true);
    this.avatar.animations.add('jump', [14, 13, 12, 13], 12, false);
    this.avatar.animations.add('down', [3], 15, true);
    this.avatar.animations.add('punch', [17, 18, 17, 0], 15, false);
    this.avatar.animations.add('airPunch', [33, 34, 35, 35, 35, 35, 34, 33], 15, false);
    this.avatar.animations.add('superPunch', [19, 20, 21, 20, 19, 0], 15, false);
    this.avatar.animations.add('kick', [24, 25, 24, 0], 15, false);
    this.avatar.animations.add('airKick', [30, 31, 32, 32, 32, 32, 31, 30, ], 15, false);
    this.avatar.animations.add('superKick', [26, 27, 28, 29, 28, 27, 26, 0], 15, false);
    this.avatar.animations.add('special1', [36, 36, 36, 36, 37, 38, 39, 40], 15, false);
    this.avatar.animations.add('special2', [41, 42,43,43,43,42,41], 15, false);
    this.avatar.animations.add('hurt', [23, 22], 10, false);
};

Player.prototype.falling = function(){
    if (this.avatar.body.touching.down){
        this.jumpCount = 0;
    }
};

Player.prototype.checkMovement = function(){

    this.falling();

    if (this.allKeysUp() && this.hurt == false){
        this.resetVelocity(this);
        this.avatar.frame = 0
    };

    if(this.keyLeft.isDown && this.keyPunch.isDown || this.keyRight.isDown && this.keyPunch.isDown){
        this.special1();
    }
    else if(this.keyLeft.isDown && this.keyKick.isDown || this.keyRight.isDown && this.keyKick.isDown){
        this.special2();
    }
    else{
        this.keyLeft.onDown.addOnce(moveLeft.bind(this), this);
        this.keyRight.onDown.addOnce(moveRight.bind(this), this);
        this.keyDown.onDown.addOnce(down.bind(this), this);
        this.keySuperKick.onDown.addOnce(superKick.bind(this), this);
        this.keySuperPunch.onDown.addOnce(superPunch.bind(this), this);
        this.keyPunch.onDown.addOnce(punch.bind(this), this);
        this.keyKick.onDown.addOnce(kick.bind(this), this);
    };

    if(this.keyJump.isDown){
        this.isJumping = true;
        this.keyJump.onDown.addOnce(jumpCheck.bind(this), this);
    };
};

Player.prototype.gotItem = function(){
    // add code to determin what happends when a player gets an item.
    console.log("got it");
};


function buildPlayerControls(player){
      Player.prototype.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      Player.prototype.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      Player.prototype.keyJump = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      Player.prototype.keyDown = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      Player.prototype.keyPunch = game.input.keyboard.addKey(Phaser.Keyboard.ALT);
      Player.prototype.keyKick = game.input.keyboard.addKey(Phaser.Keyboard.M);
      Player.prototype.keySuperKick = game.input.keyboard.addKey(Phaser.Keyboard.N);
      Player.prototype.keySuperPunch = game.input.keyboard.addKey(Phaser.Keyboard.L);
};

function buildHud(player){
    player.hud = game.add.text(hudPosX, hudPosY, player.id + ': 0  Lives: ' + player.lives, { fontSize: '12px', fill: '#000' });
    hudPosX += 250;
}


function checkFace(player){
    if (player.isLeft){
        player.avatar.scale.x = -1;
    }
    else {
       player.avatar.scale.x = 1;
    };
};

jumpCheck = function(){
    if(this.isJumping){
        if (this.jumpCount < 2){
            tellServerToMove([this.id, 'jump']);
            // this.jump();
            this.jumpCount ++;
            this.isJumping = false;
        };
    };

};

checkIfPlayerIsHurt = function(player){
    for(var i = 0; i < allPlayers.length; i++){
        if(player.id != allPlayers[i].id && player.touching(allPlayers[i])){
            tellServerPlayerIsHurt([player.id, allPlayers[i].id])
        };
    };
};

// These are called from the update function in game.js
// this. is bound to the fucntion call, to make it the current player:

moveLeft = function(){
    tellServerToMove([this.id, 'left']);
};
moveRight = function(){
    tellServerToMove([this.id, 'right']);
};

down = function(){
    tellServerToMove([this.id, 'down']);
};

kick = function(){
    tellServerToAttack([this.id, 'kick']);
};

punch = function(){
    tellServerToAttack([this.id, 'punch']);
};

superKick = function(){
  tellServerToAttack([this.id, 'superKick']);
};
superPunch = function(){
    tellServerToAttack([this.id, 'superPunch']);
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
    player.hud.text = player.id + ": " + Math.round(player.percent)  + "  Lives: "  + player.lives;

}

// temp to posisiton the players:
x = 200

function buildPlayers(){

    for(var i = 0; i < allPlayers.length; i++ ){
        player = allPlayers[i];
        player.avatar = game.add.sprite(player.posX, player.posY, player.persona);
        x += 200;
        game.physics.enable(player.avatar, Phaser.Physics.ARCADE);
        player.avatar.anchor.setTo(.5, 1);
        player.avatar.body.bounce.setTo(0, 0.1);
        player.avatar.body.gravity.y = 400;
        player.avatar.body.width = 50;
        player.avatar.body.height = 100;
        player.buildAnimations();
        player.lives = lifesPerPerson;
        buildHud(player);
        buildPlayerControls(player);
    };

};




// how to setup  players:
lifesPerPerson = 2;
