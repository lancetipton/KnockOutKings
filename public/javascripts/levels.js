// Levels
// array
var space = {
    name: 'space',
    background: 'sky',
    outOfScreen: '250',
    groundLoad: 'public/images/space/platform.png',
    backgroundLoad: 'public/images/space/space.png',
    ledges: 1
};

var rooftop = {
    name: 'rooftop',
    background: 'rooftop',
    outOfScreen: '250',
    groundLoad: 'public/images/rooftop/building1.png',
    backgroundLoad: 'public/images/rooftop/rooftop.png',
    ledges: 1
};

function Level(currentLevel){
    this.name = currentLevel['name'];
    this.background = currentLevel['background'];
    this.outOfScreen = currentLevel['outOfScreen'];
    this.ledges = currentLevel['ledges'];
};

Level.prototype.killZone = function(outOfScreen){
    this.killZone.top = game.world.height + outOfScreen;
    this.killZone.bottom = -(game.world.height - outOfScreen);
    this.killZone.left = -(game.world.width - outOfScreen);
    this.killZone.right = game.world.width + outOfScreen;
}


Level.prototype.build = function(){

    game.add.sprite(0, 0, this.background);
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    for(var i = 0; i< currentLevel.ledges; i++){

        var ledge = platforms.create(200, game.world.height - 100, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(600, 300, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 200, 'ground');
        ledge.body.immovable = true;
        this.killZone(250);
    };

};




function buildLevel(selectedLevel){
    currentLevel = new Level(selectedLevel);
    currentLevel.build();
};

