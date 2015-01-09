allItems = [];
dropItems = [];

function Item(item){
    this.name = item['name'];
    this.effect = item['effect'];
    this.avatar = item['avatar'];
    this.animation = item['animation'];
    this.gravity = item['gravity'];
    this.bounceX = item['bounceX'];
    this.bounceY = item['bounceY'];

}

Item.prototype.build = function(){
    this.posX = (Math.floor(Math.random() * 1000));
    this.avatar = game.add.sprite(this.posX, this.posY, this.name);
    game.physics.enable(this.avatar, Phaser.Physics.ARCADE);
    this.avatar.anchor.setTo(0.5, 0.5);
    this.avatar.body.bounce.setTo(this.bounceX, this.bounceY);
    this.buildAnimations();
    this.avatar.animations.play(this.animation)
};

Item.prototype.buildAnimations = function(){
    this.avatar.animations.add(this.animation, [0, 1, 2], 15, true);
};

Item.prototype.resetItem = function(){

    item = this
    setTimeout(function(){

        item.avatar.body.gravity = false;
        item.avatar.revive();

    }, 1000);


};


// how to create a new item:
var star = {
    name: 'star',
    effect: -10,
    avatar: '',
    animation: 'star',
    velocityX: 100,
    gravity: 50,
    bounceX: 0.5,
    bounceY: 0.5,
}

var health = {
    name: 'health',
    effect: -50,
    avatar: '',
    animation: 'health',
    velocityX: 0,
    gravity: 150,
    bounceX: 0,
    bounceY: 0.5,
}


allItems.push(star);
allItems.push(health);

// Eventually want this to randomly generate items, at random times.
function dropAnItem(item){
    item.avatar.body.gravity.y = item.gravity;
    item.posX = Math.floor(Math.random() * 600);
}

function buildItems() {
    for(var i = 0; i < allItems.length; i++){
        createdItem = new Item(allItems[i]);
        createdItem.build();
        dropItems.push(createdItem);
    };
}


