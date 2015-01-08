allItems = [];

function Item(name, effect, sprite, animation){
    this.name = name;
    this.effect = effect;
    this.avatar = '';
    this.animation = animation
}

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


// how to create a new item:
var star = new Item('star', -10, '', 'flash');
var health = new Item('health', -10, '', 'health');
allItems.push(star);
allItems.push(health);


// Eventually want this to randomly generate items, at random times.
function buildItems(){
    for(var i = 0; i < allItems.length; i++){
        allItems[i].buildItem();
    };
}


