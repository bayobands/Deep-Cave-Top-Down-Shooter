class MainScreen extends Phaser.Scene {
    constructor() {
        super("MainScreen");
        this.keySpace = null;
        this.keyC = null;
    }
    preload() {
        this.load.setPath("./assets/");
        // For background
        this.load.image("background", "Backgrounds.jpeg");
        this.load.image('starfield', 'starfield.png');
        this.load.image('starfield2', 'starfield2.png');
        this.load.image('starfieldE', 'starfield3.0.png');
        this.load.image('starfieldW', 'starfield2.0.png');
        this.load.image('starfieldC', 'starfieldC.png');
        this.load.image('TitleBackground', 'TitleBackground.png');
        // For other sprites
        this.load.image("explorer", "explorer.png");
        this.load.image("fireball", "NBall3.png");
        this.load.image("heart", "heart.png");
        this.load.image("explorer_turning_left", "explorer1.png");
        this.load.image("explorer_turning_right", "explorer2.png");
        this.load.image("Hurtexplorer", "hurtexplorer.png");
        

        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        // For enemy 1 Animations
        this.load.image("bat1", "bat1.png");
        this.load.image("bat2", "bat2.png");
        this.load.image("bat3", "bat3.png");
        this.load.image("bat4", "bat4.png");

        // For enemy 2 Animations
        this.load.image("Obat1", "Obat1.png");
        this.load.image("Obat2", "Obat2.png");
        this.load.image("Obat3", "Obat3.png");
        this.load.image("Obat4", "Obat4.png");




        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // Sound asset from the Kenny Music Jingles pack
        // https://kenney.nl/assets/music-jingles
        this.load.audio("dadada", "jingles_NES13.ogg");

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
            this.tileSprite = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'TitleBackground').setOrigin(0, 0)
            .setOrigin(0, 0)
            .setAlpha(0.7);
      
            this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Deep Cave', menuConfig).setOrigin(0.5);
            menuConfig.backgroundColor = '#00FF00';
            menuConfig.color = '#000';
            this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press Space to Start or C for Credits', menuConfig).setOrigin(0.5);
            // Initialize key variables
            this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        }
      
        update() {
            this.tileSprite.tilePositionY += 3;
            if (Phaser.Input.Keyboard.JustDown(this.keySpace)) {
                this.scene.start('Play');

            }
            if (Phaser.Input.Keyboard.JustDown(this.keyC)) {
                this.scene.start('Credits'); // Start the Credits scene
            }

        }
    }