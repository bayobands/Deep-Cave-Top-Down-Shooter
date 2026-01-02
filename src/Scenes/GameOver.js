class GameOver extends Phaser.Scene {
    init() {
        // Reset all game state variables
        this.registry.set('score', 0);
        this.registry.set('playerHealth', 3);
    }
    constructor() {
        super("GameOver");
        this.keySpace = null;
    }
   

        create() {

              // Access reset variables
        const score = this.registry.get('score');
        const health = this.registry.get('playerHealth');
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
            this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfieldW').setOrigin(0, 0)
      
            this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'GAME OVER', menuConfig).setOrigin(0.5);
            menuConfig.backgroundColor = '#00FF00';
            menuConfig.color = '#000';
            this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press Space to Return to Menu', menuConfig).setOrigin(0.5);
            // Initialize key variables
            this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        }
      
        update() {
            this.starfield.tilePositionY -= 10;
            if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
                this.scene.start('MainScreen');
            }
            
              

        }
    }