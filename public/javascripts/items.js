allItems = [];

function Item(name, effect, sprite, animation){
    this.name = name;
    this.effect = effect;
    this.avatar = '';
    this.animation = animation;
    this.gravity = gravity;
    this.bounceX = bounceX;
    this.bounceY = bounceY;

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
var star = {
    name: 'star',
    effect: -10,
    avatar: '',
    animation: 'star',
    velocityX: 100,
    gravityY: 100,
    bounceX: 0.5,
    bounceY: 0.5,
}

var health = {
    name: 'health',
    effect: -50,
    avatar: '',
    animation: 'health',
    velocityX: 0,
    gravityY: 100,
    bounceX: 0,
    bounceY: 0.5,
}


allItems.push(star);
allItems.push(health);

// Eventually want this to randomly generate items, at random times.
function buildNewItem(){
    newItem = allItems[Math.floor(Math.random() * allItems.length)]
    console.log(newItem);
}

