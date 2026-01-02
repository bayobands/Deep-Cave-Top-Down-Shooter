class LevelComplete extends Phaser.Scene {
    constructor() {
        super("LevelComplete");
        this.keySpace = null;
    }
   

        create() {
            let menuConfig = {
                fontFamily: 'Courier',
                fontSize: '28px',
                backgroundColor: '#F3B141',
                color: '#843605',
                align: 'right',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 0
            }
            this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfield2').setOrigin(0, 0)
      
            this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Level Complete', menuConfig).setOrigin(0.5);
            menuConfig.backgroundColor = '#00FF00';
            menuConfig.color = '#000';
            this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press Space to Continue', menuConfig).setOrigin(0.5);
            // Initialize key variables
            this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        }
      
        update() {
            this.starfield.tilePositionX -= 4;
            if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
                this.scene.start('PlayAct2');
            }
            
              

        }
    }