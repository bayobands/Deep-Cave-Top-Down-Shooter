class Play extends BasePlayScene {
    constructor() {
        super('Play', {
            maxBullets: 1,
            playerSpeed: 5,
            bulletSpeed: 11,
            winScore: 300,
            waveText: 'Wave 1',
            bat1Score: 50,
            hasBat2: false,
            bat1Duration: 3000,
            backgroundKey: 'background',
            backgroundAlpha: 1,
            description: '<h2>How to Play</h2><br>A: left // D: right // Space: Throw Knives<br>Score 300 points to win!<br>',
            winScene: 'LevelComplete',
            loseScene: 'GameOver'
        });
    }
}








