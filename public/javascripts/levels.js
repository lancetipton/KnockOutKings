
function Level(){

};

Level.prototype.killZone = function(outOfScreen){
    this.killZone.top = game.world.height + outOfScreen;
    this.killZone.bottom = -(game.world.height - outOfScreen);
    this.killZone.left = -(game.world.width - outOfScreen);
    this.killZone.right = game.world.width + outOfScreen;
}

Level.prototype.build = function(){
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
    this.killZone(250);

};

var space = new Level();
currentLevel = space;