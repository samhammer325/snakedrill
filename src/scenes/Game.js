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
  }

  updateGame() {
    this.player.move(this.direction, this.tileSize); 
    this.moved = false;
//    if(checkCollisionPlayer(this.player, this.rectangle))
//      {
//        this.scene.start('GameOver');
//      }
  }

}

function loadAssets() {

  var assets = {
    player: 'assets/snakehead.png',
    wall: 'assets/tPipe.png',
    snakeBody: 'assets/snakebody.png',
    food: 'assets/food.png'
  }
  Object.keys(assets).forEach((asset) => {
    this.load.image(asset, assets[asset]);
  })



}

function createFunction() {

    loadAssets.bind(this)();

    this.cameras.main.setBackgroundColor(0x00ff00);

    var color = 0xffff00;
    var x = 128 * 1;
    var y = 128 * 1;
    this.tileSize = 128;
    this.gameSpeed = 100;
    this.direction = 'right';

    this.gameBorders = this.tileSize * 50

    // set up player
    this.player = this.add.graphics();  this.player.fillStyle(color); this.player.fillRect(0, 0, this.tileSize, this.tileSize);  this.player.x = x; this.player.y = y;

    this.player = this.add.image(128, 128, 'player');
   /// this.player.body.setSize(this.tileSize, this.tileSize);
    
    this.tweens.add({targets: this.player, x: x + this.tileSize, y: y, duration: this.gameSpeed, ease: 'Linear'});

    // set up body segments
    this.player.bodySegments = [];
    this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));
    this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));
    this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));
    this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));


    console.log('this', this);
    console.log('physics', this.physics);
    this.physics.add.existing(this.player);



    this.player.bodySegments.forEach((segment, i) => {
      this.player.bodySegments[i] = this.add.graphics();
      this.player.bodySegments[i].fillStyle(color);
      this.player.bodySegments[i].fillRect(0, 0, this.tileSize, this.tileSize);
      this.player.bodySegments[i].x = segment.x;
      this.player.bodySegments[i].y = segment.y;
      this.tweens.add({targets: this.player.bodySegments[i], x: (x - (this.tileSize * i)) + this.tileSize, y: y, duration: this.gameSpeed, ease: 'Linear'});

      if (i === 0) {
        this.player.bodySegments[i].frontSegment = this.player;
      } else {
        this.player.bodySegments[i].frontSegment = this.player.bodySegments[i - 1];
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
    this.cameras.main.setZoom(0.50);

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

  this.rectangle = this.add.rectangle(100, 1000, 1000, 1000, 0x000000);

  this.physics.add.existing(this.rectangle);

  console.log('rect height', this.rectangle.height);
}
function checkCollisionPlayer(object1, object2) {
  console.log('checkCollision');
  // Calculate the edges of the objects
  const left1 = object1.x;
  const right1 = object1.x + 128;
  const top1 = object1.y;
  const bottom1 = object1.y + 128;

  const left2 = object2.x;
  const right2 = object2.x + object2.width;
  const top2 = object2.y;
  const bottom2 = object2.y + object2.height;

  console.log('player', left1, right1, top1, bottom1);
  console.log('wall', left2, right2, top2, bottom2);

  // Check for intersection
  if (left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2) {
    return true; // Collision detected
  }
  return false; // No collision
}
