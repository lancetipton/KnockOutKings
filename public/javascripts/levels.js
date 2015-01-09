// Levels
// array
var space = {
    name: 'space',
    background: 'space',
    outOfScreen: '250',
    groundLoad: 'public/images/space/platform.png',
    backgroundLoad: 'public/images/space/space.png',
    platforms: 3,
    platformsWidth: 390,
    platformsHeight: 32,
    platformCoordinates: [200, 500, 600, 300, -150, 200]
};

var rooftop = {
    name: 'rooftop',
    background: 'rooftop',
    outOfScreen: '250',
    groundLoad: 'public/images/rooftop/building1.png',
    backgroundLoad: 'public/images/rooftop/rooftop.png',
    platforms: 4,
    platformsWidth: 300,
    platformsHeight: 500,
    platformCoordinates: [-260, -200, -150, 200, 260, 500, 670, 400]
};

function Level(currentLevel){
    this.name = currentLevel['name'];
    this.background = currentLevel['background'];
    this.outOfScreen = currentLevel['outOfScreen'];
    this.platforms = currentLevel['platforms'];
    this.platformsWidth = currentLevel['platformsWidth'];
    this.platformsHeight = currentLevel['platformsHeight'];
    this.platformCoordinates = currentLevel['platformCoordinates'];
};

Level.prototype.killZone = function(outOfScreen){
    this.killZone.top = game.world.height + outOfScreen;
    this.killZone.bottom = -(game.world.height - outOfScreen);
    this.killZone.left = -(game.world.width - outOfScreen);
    this.killZone.right = game.world.width + outOfScreen;
}


Level.prototype.build = function(){

    this.killZone(250);

    game.add.sprite(0, 0, this.background);
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    for(var i = 0; i< currentLevel.platforms; i++){

        var platform = platforms.create(currentLevel.platformCoordinates.shift(), currentLevel.platformCoordinates.shift(), 'platform');
        platform.body.immovable = true;
        platform.body.width = currentLevel.platformsWidth;
        platform.body.height = currentLevel.platformsHeight;

    };


};




function buildLevel(selectedLevel){
    currentLevel = new Level(selectedLevel);
    currentLevel.build();
};

