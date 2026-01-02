class PlayAct3 extends BasePlayScene {
    constructor() {
        super('PlayAct3', {
            maxBullets: 4,
            playerSpeed: 7,
            bulletSpeed: 14,
            winScore: 1000,
            waveText: 'Final Wave',
            bat1Score: 50,
            bat2Score: 100,
            hasBat2: true,
            bat1Duration: 1000,
            backgroundKey: 'background',
            backgroundAlpha: 0.1,
            description: '<h2>How to Play</h2><br>A: left // D: right // Space: Throw Knives<br>Score 1000 points to win!<br>',
            enemyBullets: true,
            enemyBulletCount: 10,
            winScene: 'YouWin',
            loseScene: 'GameOver'
        });
    }
}