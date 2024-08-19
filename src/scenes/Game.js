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
    createScore.bind(this)();
    addFood.bind(this)();
  }

  updateGame() {
    this.player.lastLocation = { x: this.player.x, y: this.player.y };
    // player can only move on tileSize grid
    this.player.x = Math.round(this.player.x / (this.tileSize)) * (this.tileSize);
    this.player.y = Math.round(this.player.y / (this.tileSize)) * (this.tileSize);

    // smooth movement
    this.player.move(this.player.direction, this.tileSize);
    //this.player.move(this.player.direction, this.tileSize); 
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
    this.gameSpeed = 150;

  //           this.scene.start('Game', {fast: true});

    if (this.scene.settings.data.fast) {
      console.log('fast');
      this.gameSpeed = 100;
    }


    this.zoom = 1;
    this.tileNumber = 25;

    this.score = 0;

    this.gameBorders = this.tileSize * 50

  this.add.image(0, 0, 'floor-tiles')
    .setOrigin(0, 0)
    .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

    // set up player
    //this.player = this.add.graphics();  this.player.fillStyle(color); this.player.fillRect(0, 0, this.tileSize, this.tileSize);  this.player.x = x; this.player.y = y;
    console.log('player', this.textures.get('player'));

    //this.wall = this.physics.add.staticSprite(128 * 2, 128 * 2, 'wall');

    this.player = this.add.image(128, 128, 'player');
    this.player.depth = 3;
    this.player.setOrigin(0, 0);

    this.player.direction = 'right';

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

    this.player.body.setCircle(90);

    this.player.bodySegments.forEach((segment, i) => {

      segment.setOrigin(0, 0);
      //this.player.bodySegments[i] = this.add.graphics();
      //this.player.bodySegments[i].fillStyle(color);
      //this.player.bodySegments[i].fillRect(0, 0, this.tileSize, this.tileSize);
      //this.player.bodySegments[i].x = segment.x;
      //this.player.bodySegments[i].y = segment.y;

      console.log('position', segment.x, segment.y);

      this.player.bodySegments[i].depth = 2;
      this.player.bodySegments[i].setScale(0.5);
      this.tweens.add({targets: this.player.bodySegments[i], x: (x - (this.tileSize * i * 2)) + this.tileSize, y: y, duration: this.gameSpeed, ease: 'Linear'});

      if (i === 0) {
        this.player.bodySegments[i].frontSegment = this.player;
      } else {
        this.player.bodySegments[i].frontSegment = this.player.bodySegments[i - 1];
      }

      if ( i > 1 ) {
        this.physics.add.existing(this.player.bodySegments[i]);
        this.player.bodySegments[i].body.setCircle(60);
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

    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.upKey.on('down', handleWKeyDown.bind(this), this);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.downKey.on('down', handleSKeyDown.bind(this), this);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.leftKey.on('down', handleAKeyDown.bind(this), this);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.rightKey.on('down', handleDKeyDown.bind(this), this);

    //// Listen for the keyup event on the "D" key
    //this.dKey.on('up', this.handleDKeyUp, this);

    this.player.move = moveFunction.bind(this.player);
    this.player.bodySegmentsMove = bodySegmentsMoveFunction.bind(this.player);

    // zoom out 
    this.cameras.main.setZoom(this.zoom);

    // update game when game speed is reached
    this.time.addEvent({ delay: this.gameSpeed, callback: this.updateGame, callbackScope: this, loop: true });

    //this.input.once('pointerdown', () => {

    //  // delete game objects
    //  this.player.destroy();
    //  this.player.bodySegments.forEach((segment) => {
    //    segment.destroy();
    //  });
    //  this.scene.stop('Game');

    //  this.scene.start('GameOver');

    //});
}
function moveFunction(direction, tileSize) {
  let directionX;
  let directionY;
  switch (direction) {
    case 'up':
      this.scene.tweens.add({targets: this, x: this.x, y: this.y - tileSize, duration: this.scene.gameSpeed, ease: 'Linear'});
    break;
    case 'down':
      this.scene.tweens.add({targets: this, x: this.x, y: this.y + tileSize, duration: this.scene.gameSpeed, ease: 'Linear'});
    break;
    case 'left':
      this.scene.tweens.add({targets: this, x: this.x - tileSize, y: this.y, duration: this.scene.gameSpeed, ease: 'Linear'});
    break;
    case 'right':
      this.scene.tweens.add({targets: this, x: this.x + tileSize, y: this.y, duration: this.scene.gameSpeed, ease: 'Linear'});
    break;
  }
  // tween
  //this.scene.tweens.killTweensOf(this);
  this.bodySegmentsMove( this.scene );
}
function bodySegmentsMoveFunction() {
  //console.log('this.bodySegments', this.bodySegments);
  var xTarget;
  var yTarget;

  this.bodySegments.forEach((segment) => {
    xTarget = segment.x;
    yTarget = segment.y;

    //console.log(' segment position', segment.x, segment.y);
    //console.log('segment.frontSegment.lastLocation', segment.frontSegment.lastLocation);

    segment.x = Math.round(segment.x / (this.scene.tileSize)) * (this.scene.tileSize);
    segment.y = Math.round(segment.y / (this.scene.tileSize)) * (this.scene.tileSize);
    //console.log('segment position', segment.x, segment.y, this.scene.tileSize, this.scene.tileSize);

    // TODO initial setup last location
    segment.lastLocation = {x: segment.x, y: segment.y};
    //console.log('segment.lastLocation', segment.lastLocation);

    xTarget = segment.frontSegment.lastLocation.x;
    yTarget = segment.frontSegment.lastLocation.y;

    //if (segment.direction === 'up') {
    //  yTarget = segment.frontSegment.y;
    //  //yTarget += segment.frontSegment.y;
    //}
    //if (segment.direction === 'down') {
    //  yTarget = segment.frontSegment.y;
    //}
    //if (segment.direction === 'left') {
    //  xTarget = segment.frontSegment.x;
    //}
    //if (segment.direction === 'right') {
    //  xTarget = segment.frontSegment.x;
    //}

    //console.log("segment.y", segment.y, segment.frontSegment.y);
    //console.log("segment.x", segment.x, segment.frontSegment.x);
    //if (Math.floor(segment.y) === Math.floor(segment.frontSegment.y)) {
    //  segment.direction = segment.frontSegment.direction;
    //}

    //if (Math.floor(segment.x) === Math.floor(segment.frontSegment.x)) {
    //  segment.direction = segment.frontSegment.direction;
    //}

    if( xTarget !== Math.round(segment.frontSegment.x / (this.tileSize)) * (this.tileSize)) {
      this.scene.tweens.add({targets: segment, x: xTarget, y: yTarget, duration: this.scene.gameSpeed, ease: 'Linear'});
    }
  });
} 
function handleDKeyDown() {
  if (this.moved === true) {
    return;
  }
  if( this.player.direction === 'left' ) {
    return;
  }
  this.player.direction = 'right';
  this.moved = true;
}
function handleAKeyDown() {
  if (this.moved === true) {
    return;
  }
  if ( this.player.direction === 'right' ) {
    return;
  }

  this.player.direction = 'left';
  this.moved = true;
}
function handleWKeyDown() {
  if (this.moved === true) {
    return;
  }

  if (this.player.direction === 'down') {
    return;
  }

  this.player.direction = 'up';
  this.moved = true;
}
function handleSKeyDown() {
  if (this.moved === true) {
    return;
  }
  if (this.player.direction === 'up') {
    return;
  }

  this.player.direction = 'down';
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


  this.topWall = this.add.rectangle(this.game.config.width, this.game.config.height, this.game.config.width, 128, 0x808080);
  this.topWall.setOrigin(0, 0);
  this.topWall.x = 0;
  this.topWall.y = 0;
  this.physics.add.existing(this.topWall);
  //this.physics.add.collider(this.player, this.topWall, handleCollision, null, this);
  this.topWallBarrier = this.add.rectangle(this.game.config.width, this.game.config.height, this.game.config.width, 50, 0x808080);
  this.topWallBarrier.setOrigin(0, 0);
  this.topWallBarrier.x = 0;
  this.topWallBarrier.y = -50;
  this.physics.add.existing(this.topWallBarrier);
  this.physics.add.collider(this.player, this.topWallBarrier, handleCollision, null, this);


  this.leftWall = this.add.rectangle(this.game.config.width, this.game.config.height, 128, this.game.config.height, 0x808080);
  this.leftWall.setOrigin(0, 0);
  this.leftWall.x = 0;
  this.leftWall.y = 0;
  this.physics.add.existing(this.leftWall);
  //this.physics.add.collider(this.player, this.leftWall, handleCollision, null, this);
  this.leftWallBarrier = this.add.rectangle(this.game.config.width, this.game.config.height, 50, this.game.config.height, 0x808080);
  this.leftWallBarrier.setOrigin(0, 0);
  this.leftWallBarrier.x = -50;
  this.leftWallBarrier.y = 0;
  this.physics.add.existing(this.leftWallBarrier);
  this.physics.add.collider(this.player, this.leftWallBarrier, handleCollision, null, this);

  this.bottomWall = this.add.rectangle(this.game.config.width, this.game.config.height, this.game.config.width, 128, 0x808080);
  this.bottomWall.setOrigin(0, 0);
  this.bottomWall.x = 0;
  this.bottomWall.y = this.game.config.height - this.tileSize;
  this.physics.add.existing(this.bottomWall);
  this.physics.add.collider(this.player, this.bottomWall, handleCollision, null, this);

}
function createScore() {


  this.scoreText = this.add.text(128 * 25 / 2, 75, 'Score: ' + this.score, { 
    fontSize: '128px', fill: '#000',
    stroke: '#000000', strokeThickness: 8,
    align: 'center'
  }).setOrigin(0.5);

  //let fast = this.add.text(128 * 25 / 2, 128 * 25 / 2 + 200, 'Fast Mode', {
  //  fontFamily: 'Arial Black', fontSize: 128, color: '#ffffff',
  //  stroke: '#000000', strokeThickness: 8,
  //  align: 'center'
  //}).setOrigin(0.5);
}
function addFood() {
  console.log('addFood');
  // red color: 0xff0000
  //this.food = this.add.rectangle(this.game.config.width, this.game.config.height, this.tileSize, this.tileSize, 0xff0000);
  //  this.player.bodySegments.push(this.add.image(x - this.tileSize * 8, y, 'body'));
  this.food = this.add.image(this.game.config.width, this.game.config.height, 'berry');
  // resize image
  this.food.setScale(0.5);

  // add food body 
  this.physics.add.existing(this.food);

  this.food.setOrigin(0, 0);
  this.food.body.setCircle(90);

  // dont allow food to be placed on top of the player or bodySegments

  var onSnake;

  var tryX;
  var tryY;
  do {

    onSnake = false;

    tryX = (Math.floor(Math.random() * (this.game.config.width - 256) / this.tileSize) + 1) * this.tileSize;
    tryY = (Math.floor(Math.random() * (this.game.config.height - 256) / this.tileSize) + 1) * this.tileSize;

    this.player.bodySegments.forEach((segment) => {
      //console.log('segmentxy', (Math.round(segment.x / (this.tileSize)) * (this.tileSize)), (Math.round(segment.y / (this.tileSize)) * (this.tileSize)), tryX, tryY);
      // Math.round(this.player.x / (this.tileSize)) * (this.tileSize)
      if (Math.round(segment.x / (this.tileSize)) * (this.tileSize) === tryX && Math.round(segment.y / (this.tileSize)) * (this.tileSize) === tryY) {
        console.log('food on snake!!!!!!!!!!!!!!!!!!!!!!!!!!');
        onSnake = true;
      }
    }
    );


  } while (onSnake);

  this.food.x = tryX;
  this.food.y = tryY;

  this.physics.add.existing(this.food);
  this.physics.add.collider(this.player, this.food, handleFoodCollision, null, this);
}
function handleCollision() {
  console.log('collision');
  this.scene.stop('Game');
  // if fast mode
  if (this.scene.settings.data.fast) {
    this.registry.set('fastscore', this.score);
  } else {
    this.registry.set('score', this.score);
  }
  this.registry.set('displayScore', this.score);
  this.scene.start('GameOver');
}
function handleFoodCollision() {
  //console.log('food collision');
  this.player.bodySegments.push(this.add.rectangle(this.game.config.width, this.game.config.height, this.tileSize, this.tileSize, 0x0000FF));
  this.player.bodySegments[this.player.bodySegments.length - 1].setOrigin(0, 0);
  this.player.bodySegments[this.player.bodySegments.length - 1].x = this.player.bodySegments[this.player.bodySegments.length - 2].x;
  this.player.bodySegments[this.player.bodySegments.length - 1].y = this.player.bodySegments[this.player.bodySegments.length - 2].y;
  this.player.bodySegments[this.player.bodySegments.length - 1].frontSegment = this.player.bodySegments[this.player.bodySegments.length - 2];
  this.physics.add.existing(this.player.bodySegments[this.player.bodySegments.length - 1]);
  this.physics.add.collider(this.player, this.player.bodySegments[this.player.bodySegments.length - 1], handleCollision.bind(this), null, this.scene);


  // set collision body to circle
  this.player.bodySegments[this.player.bodySegments.length - 1].body.setCircle(50);

  // destroy the food
  this.food.destroy();

  this.score += 1;
  this.scoreText.setText('Score: ' + this.score);
  
  addFood.bind(this)();
}

