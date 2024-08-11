import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');



        this.load.image('wall', 'assets/tPipe.png');
        this.load.image('player', 'assets/snakehead.png');
        this.load.image('body', 'assets/snakebody.png');
        this.load.image('berry', 'assets/berry.png');
        this.load.image('tiles', 'assets/tiles.png');
        this.load.image('floor-tiles', 'assets/floor-tiles.png');
        


    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
