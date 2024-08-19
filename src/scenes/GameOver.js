import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        //this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(128 * 25 / 2, 128 * 25 / 2, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 128, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        let score = this.add.text(128 * 25 / 2, 128 * 25 / 2 + 200, 'Score: ' + this.registry.get('displayScore'), {
          fontFamily: 'Arial Black', fontSize: 128, color: '#ffffff',
          stroke: '#000000', strokeThickness: 8,
          align: 'center'
        }).setOrigin(0.5);


        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
