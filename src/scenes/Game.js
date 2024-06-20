import { Scene } from 'phaser';

export class Game extends Scene
{
  constructor ()
  {
    super('Game');
  }

  create ()
  {
    this.cameras.main.setBackgroundColor(0x00ff00);

    var color = 0xffff00;
    var x = 400;
    var y = 300;
    this.tileSize = 128;
    var gameSpeed = 100;
    this.direction = 'right';

    // set up player
    this.player = this.add.graphics();  this.player.fillStyle(color); this.player.fillRect(0, 0, this.tileSize, this.tileSize);  this.player.x = x; this.player.y = y;
    this.tweens.add({targets: this.player, x: x + this.tileSize, y: y, duration: gameSpeed, ease: 'Linear'});

    // set up body segments
    this.player.bodySegments = [];
    this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));
    this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));
    this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));
    this.player.bodySegments.push(new Phaser.Geom.Rectangle(x - (this.tileSize * (this.player.bodySegments.length + 1)), y, this.tileSize, this.tileSize));

    this.player.bodySegments.forEach((segment, i) => {
      this.player.bodySegments[i] = this.add.graphics();
      this.player.bodySegments[i].fillStyle(color);
      this.player.bodySegments[i].fillRect(0, 0, this.tileSize, this.tileSize);
      this.player.bodySegments[i].x = segment.x;
      this.player.bodySegments[i].y = segment.y;
      this.tweens.add({targets: this.player.bodySegments[i], x: (x - (this.tileSize * i)) + this.tileSize, y: y, duration: gameSpeed, ease: 'Linear'});

      if (i === 0) {
        this.player.bodySegments[i].frontSegment = this.player;
      } else {
        this.player.bodySegments[i].frontSegment = this.player.bodySegments[i - 1];
      }
    });

    // keys
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.dKey.on('down', this.handleDKeyDown, this);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.aKey.on('down', this.handleAKeyDown, this);
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.wKey.on('down', this.handleWKeyDown, this);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.sKey.on('down', this.handleSKeyDown, this);


    //// Listen for the keyup event on the "D" key
    //this.dKey.on('up', this.handleDKeyUp, this);

    this.player.move = function (direction, tileSize) {
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
      this.scene.tweens.add({targets: this, x: this.x, y: this.y, duration: gameSpeed, ease: 'Linear'});
      this.bodySegmentsMove( this.scene );
    }

    this.player.bodySegmentsMove = function () {
      //console.log('this.bodySegments', this.bodySegments);
      this.bodySegments.forEach((segment) => {
        this.scene.tweens.add({targets: segment, x: segment.frontSegment.x, y: segment.frontSegment.y, duration: gameSpeed, ease: 'Linear'});
      });
    } 

    // zoom out 
    this.cameras.main.setZoom(0.20);

    // update game when game speed is reached
    this.time.addEvent({ delay: gameSpeed, callback: this.updateGame, callbackScope: this, loop: true });


    this.input.once('pointerdown', () => {

      this.scene.start('GameOver');

    });

  }

  updateGame() {
    this.player.move(this.direction, this.tileSize); 
    //console.log('update game');
  }

  handleDKeyDown() {
    this.direction = 'right';
  }

  handleAKeyDown() {
    this.direction = 'left';
  }

  handleWKeyDown() {
    this.direction = 'up';
  }

  handleSKeyDown() {
    this.direction = 'down';
  }



}
