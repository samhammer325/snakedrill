import { Scene } from 'phaser';

export class Game extends Scene
{
  constructor ()
  {
    super('Game');
  }
  create ()
  {
    createFunction.bind(this)();
    createWalls.bind(this)();
    addFood.bind(this)();
  }

  updateGame() {
    // player can only move on tileSize grid
    this.player.x = Math.round(this.player.x / (this.tileSize)) * (this.tileSize);
    this.player.y = Math.round(this.player.y / (this.tileSize)) * (this.tileSize);

    this.player.move(this.direction, this.tileSize); 
    this.moved = false;

   // addFood.bind(this)();
//    if(checkCollisionPlayer(this.player, this.rectangle))
//      {
//        this.scene.start('GameOver');
//      }
  }

}
function createFunction() {


    this.cameras.main.setBackgroundColor(0x00ff00);

//    var color = 0xffff00;
    this.tileSize = 128;
    this.gameSpeed = 100;
    this.direction = 'right';
    this.zoom = 1;
    this.tileNumber = 25;

    this.gameBorders = this.tileSize * 50

    // set up player
    //this.player = this.add.graphics();  this.player.fillStyle(color); this.player.fillRect(0, 0, this.tileSize, this.tileSize);  this.player.x = x; this.player.y = y;
    console.log('player', this.textures.get('player'));

    this.wall = this.physics.add.staticSprite(128 * 2, 128 * 2, 'wall');

    this.player = this.add.image(128, 128, 'player');
    this.player.depth = 3;
    this.player.setOrigin(0, 0);

    var x = Math.floor(this.tileNumber * 0.5) * this.tileSize; 
    var y = Math.floor(this.tileNumber * 0.5) * this.tileSize; 
    
    this.player.x = x;
    this.player.y = y;


    // scale player by half 
    this.player.setScale(0.5);

   /// this.player.body.setSize(this.tileSize, this.tileSize);
    
    this.tweens.add({targets: this.player, x: x + this.tileSize, y: y, duration: this.gameSpeed, ease: 'Linear'});

    // set up body segments
    this.player.bodySegments = [];
    // body part use 'body' image
    
    this.player.bodySegments.push(this.add.image(x - this.tileSize * 2, y, 'body'));
    this.player.bodySegments.push(this.add.image(x - this.tileSize * 4, y, 'body'));
    this.player.bodySegments.push(this.add.image(x - this.tileSize * 6, y, 'body'));
    this.player.bodySegments.push(this.add.image(x - this.tileSize * 8, y, 'body'));
    this.player.bodySegments.push(this.add.image(x - this.tileSize * 10, y, 'body'));
    //this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));
    //this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));
    //this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));
    //this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));


    console.log('this', this);
    console.log('physics', this.physics);
    this.physics.add.existing(this.player);

    this.player.bodySegments.forEach((segment, i) => {

      segment.setOrigin(0, 0);
      //this.player.bodySegments[i] = this.add.graphics();
      //this.player.bodySegments[i].fillStyle(color);
      //this.player.bodySegments[i].fillRect(0, 0, this.tileSize, this.tileSize);
      this.player.bodySegments[i].x = segment.x;
      this.player.bodySegments[i].y = segment.y;
      this.player.bodySegments[i].depth = 2;
      this.player.bodySegments[i].setScale(0.5);
      this.tweens.add({targets: this.player.bodySegments[i], x: (x - (this.tileSize * i * 2)) + this.tileSize, y: y, duration: this.gameSpeed, ease: 'Linear'});

      if (i === 0) {
        this.player.bodySegments[i].frontSegment = this.player;
      } else {
        this.player.bodySegments[i].frontSegment = this.player.bodySegments[i - 1];
      }

      if ( i > 3 ) {
        this.physics.add.existing(this.player.bodySegments[i]);
        this.physics.add.collider(this.player, this.player.bodySegments[i], handleCollision, null, this);
      }


    });

    // keys
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.dKey.on('down', handleDKeyDown.bind(this), this);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.aKey.on('down', handleAKeyDown.bind(this), this);
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.wKey.on('down', handleWKeyDown.bind(this), this);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.sKey.on('down', handleSKeyDown.bind(this), this);

    


    //// Listen for the keyup event on the "D" key
    //this.dKey.on('up', this.handleDKeyUp, this);

    this.player.move = moveFunction.bind(this.player);
    this.player.bodySegmentsMove = bodySegmentsMoveFunction.bind(this.player);

    // zoom out 
    this.cameras.main.setZoom(this.zoom);

    // update game when game speed is reached
    this.time.addEvent({ delay: this.gameSpeed, callback: this.updateGame, callbackScope: this, loop: true });


    this.input.once('pointerdown', () => {

      // delete game objects
      this.player.destroy();
      this.player.bodySegments.forEach((segment) => {
        segment.destroy();
      });
      this.scene.stop('Game');

      this.scene.start('GameOver');

    });


}
function moveFunction(direction, tileSize) {
  switch (direction) {
    case 'up':
      this.y -= tileSize;
    break;
    case 'down':
      this.y += tileSize;
    break;
    case 'left':
      this.x -= tileSize;
    break;
    case 'right':
      this.x += tileSize;
    break;
  }
  // tween
  this.scene.tweens.add({targets: this, x: this.x, y: this.y, duration: this.scene.gameSpeed, ease: 'Linear'});
  this.bodySegmentsMove( this.scene );
}
function bodySegmentsMoveFunction() {
  //console.log('this.bodySegments', this.bodySegments);
  this.bodySegments.forEach((segment) => {
    this.scene.tweens.add({targets: segment, x: segment.frontSegment.x, y: segment.frontSegment.y, duration: this.scene.gameSpeed, ease: 'Linear'});
  });
} 

function handleDKeyDown() {
  if (this.moved === true) {
    return;
  }
  if( this.direction === 'left' ) {
    return;
  }
  this.direction = 'right';
  this.moved = true;
}
function handleAKeyDown() {
  if (this.moved === true) {
    return;
  }
  if ( this.direction === 'right' ) {
    return;
  }

  this.direction = 'left';
  this.moved = true;
}
function handleWKeyDown() {
  if (this.moved === true) {
    return;
  }

  if (this.direction === 'down') {
    return;
  }

  this.direction = 'up';
  this.moved = true;
}
function handleSKeyDown() {
  if (this.moved === true) {
    return;
  }
  if (this.direction === 'up') {
    return;
  }

  this.direction = 'down';
  this.moved = true;
}
function createWalls() {
  console.log('createwalls');

  this.rightWall = this.add.rectangle(this.game.config.width, this.game.config.height, 128, this.game.config.height, 0x808080);
  this.rightWall.setOrigin(0, 0);
  this.rightWall.x = this.game.config.width - this.tileSize;
  this.rightWall.y = 0;
  this.physics.add.existing(this.rightWall);
  this.physics.add.collider(this.player, this.rightWall, handleCollision, null, this);

  this.leftWall = this.add.rectangle(this.game.config.width, this.game.config.height, 128, this.game.config.height, 0x808080);
  this.leftWall.setOrigin(0, 0);
  this.leftWall.x = 0;
  this.leftWall.y = 0;
  this.physics.add.existing(this.leftWall);
  this.physics.add.collider(this.player, this.leftWall, handleCollision, null, this);

  this.topWall = this.add.rectangle(this.game.config.width, this.game.config.height, this.game.config.width, 128, 0x808080);
  this.topWall.setOrigin(0, 0);
  this.topWall.x = 0;
  this.topWall.y = 0;
  this.physics.add.existing(this.topWall);
  this.physics.add.collider(this.player, this.topWall, handleCollision, null, this);

  this.bottomWall = this.add.rectangle(this.game.config.width, this.game.config.height, this.game.config.width, 128, 0x808080);
  this.bottomWall.setOrigin(0, 0);
  this.bottomWall.x = 0;
  this.bottomWall.y = this.game.config.height - this.tileSize;
  this.physics.add.existing(this.bottomWall);
  this.physics.add.collider(this.player, this.bottomWall, handleCollision, null, this);

}

function addFood() {
  console.log('addFood');
  // red color: 0xff0000
  this.food = this.add.rectangle(this.game.config.width, this.game.config.height, this.tileSize, this.tileSize, 0xff0000);
  this.food.setOrigin(0, 0);
  this.food.x = (Math.floor(Math.random() * (this.game.config.width - 256) / this.tileSize) + 1) * this.tileSize;
  this.food.y = (Math.floor(Math.random() * (this.game.config.height - 256) / this.tileSize) + 1) * this.tileSize;
  this.physics.add.existing(this.food);
  this.physics.add.collider(this.player, this.food, handleFoodCollision, null, this);
}

function handleCollision() {
  console.log('collision');
  this.scene.stop('Game');
  this.scene.start('GameOver');
}

function handleFoodCollision() {
  console.log('food collision');
  this.player.bodySegments.push(this.add.rectangle(this.game.config.width, this.game.config.height, this.tileSize, this.tileSize, 0x0000FF));
  this.player.bodySegments[this.player.bodySegments.length - 1].setOrigin(0, 0);
  this.player.bodySegments[this.player.bodySegments.length - 1].x = this.player.bodySegments[this.player.bodySegments.length - 2].x;
  this.player.bodySegments[this.player.bodySegments.length - 1].y = this.player.bodySegments[this.player.bodySegments.length - 2].y;
  this.player.bodySegments[this.player.bodySegments.length - 1].frontSegment = this.player.bodySegments[this.player.bodySegments.length - 2];
  this.physics.add.existing(this.player.bodySegments[this.player.bodySegments.length - 1]);
  this.physics.add.collider(this.player, this.player.bodySegments[this.player.bodySegments.length - 1], handleCollision.bind(this), null, this.scene);

  // destroy the food
  this.food.destroy();
  
  addFood.bind(this)();
}

