import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        //this.add.image(512, 384, 'background');

        //this.add.image(512, 300, 'logo');


        //this.add.text(128 * 25 / 2, 128 * 25 / 2, 'Start Game', {
        //    fontFamily: 'Arial Black', fontSize: 128, color: '#ffffff',
        //    stroke: '#000000', strokeThickness: 8,
        //    align: 'center'
        //}).setOrigin(0.5);

        // <button id="startGame" style="display:none;">Start Game</button>

        //document.getElementById('startGame').style.display = 'block';
      //  document.getElementById('startGame').addEventListener('click', () => {
      //      this.scene.start('Game');
      //  });

      //     this.scene.registry.set('fastscore', this.scene.score);


      let start = this.add.text(128 * 25 / 2, 128 * 25 / 2, 'Normal Mode ' + (this.registry.get('score') || 0), {
          fontFamily: 'Arial Black', fontSize: 128, color: '#ffffff',
          stroke: '#000000', strokeThickness: 8,
          align: 'center'
      }).setOrigin(0.5);

      start.setInteractive();
      start.on('pointerdown', () => {
          this.scene.start('Game');
      } 
      );


      let fast = this.add.text(128 * 25 / 2, 128 * 25 / 2 + 200, 'Fast Mode ' + (this.registry.get('fastscore') || 0), {
          fontFamily: 'Arial Black', fontSize: 128, color: '#ffffff',
          stroke: '#000000', strokeThickness: 8,
          align: 'center'
      }).setOrigin(0.5);

      fast.setInteractive();
      fast.on('pointerdown', () => {
          this.scene.start('Game', {fast: true});
      } 
      );


      

        //this.input.once('pointerdown', () => {

        //      this.scene.start('Game')

        //});


    }
}
