class PlayAct2 extends BasePlayScene {
    constructor() {
        super('PlayAct2', {
            maxBullets: 2,
            playerSpeed: 7,
            bulletSpeed: 14,
            winScore: 400,
            waveText: 'Wave 2',
            bat1Score: 25,
            hasBat2: true,
            bat2Score: 50,
            bat1Duration: 1500,
            backgroundKey: 'background',
            backgroundAlpha: 0.4,
            description: '<h2>How to Play</h2><br>A: left // D: right // Space: Throw Knives<br>Score 400 points to win!<br>',
            winScene: 'LevelComplete2',
            loseScene: 'GameOver'
        });
    }
}
