class BasePlayScene extends Phaser.Scene {
    constructor(key, cfg = {}) {
        super(key);
        this.cfg = cfg;
        this.my = { sprite: {}, text: {} };
        this.maxBullets = cfg.maxBullets || 1;
        this.bulletSpeed = cfg.bulletSpeed || 11;
        this.playerSpeed = cfg.playerSpeed || 5;
        this.winScore = cfg.winScore || 300;
        this.enemyBullets = cfg.enemyBullets || false;
        this.enemyBulletCount = cfg.enemyBulletCount || 0;
    }

    create() {
        // reset state
        this.batImmune = false;
        this.bat2Immune = false;
        this.gameEnded = false;

        this.myScore = this.registry.get('score') || 0;
        this.playerHealth = this.registry.get('playerHealth') || 6;

        // common animations
        this.anims.create({ key: 'puff', frames: [ { key: 'whitePuff00' }, { key: 'whitePuff01' }, { key: 'whitePuff02' }, { key: 'whitePuff03' } ], frameRate: 20, repeat: 5, hideOnComplete: true });
        this.anims.create({ key: 'bat_fly', frames: [ { key: 'bat1' }, { key: 'bat2' }, { key: 'bat3' } ], frameRate: 7, repeat: -1 });
        this.anims.create({ key: 'bat2_fly', frames: [ { key: 'Obat1' }, { key: 'Obat2' }, { key: 'Obat3' } ], frameRate: 7, repeat: -1 });

        // background
        const bgKey = this.cfg.backgroundKey || 'background';
        const background = this.add.image(0, 0, bgKey).setOrigin(0, 0);
        background.alpha = (typeof this.cfg.backgroundAlpha !== 'undefined') ? this.cfg.backgroundAlpha : 1;
        background.displayWidth = this.sys.game.config.width;
        background.displayHeight = this.sys.game.config.height;

        // player
        this.my.sprite.explorer = this.add.sprite(game.config.width/2, game.config.height - 40 - 5, 'explorer');
        this.my.sprite.explorer.setScale(0.2);

        // bats
        this.my.sprite.bat = this.add.sprite(Phaser.Math.Between(50, game.config.width - 50), -50, 'bat1').play('bat_fly');
        this.my.sprite.bat.setScale(0.50);
        this.my.sprite.bat.scorePoints = this.cfg.bat1Score || 50;
        this.my.sprite.bat.canFire = true;

        if (this.cfg.hasBat2) {
            this.my.sprite.bat2 = this.add.sprite(Phaser.Math.Between(50, game.config.width - 50), -50, 'Obat1').play('bat2_fly');
            this.my.sprite.bat2.setScale(0.50);
            this.my.sprite.bat2.scorePoints = this.cfg.bat2Score || 50;
            this.my.sprite.bat2.canFire = true;
            this.startZigZagMovement(this.my.sprite.bat2);
        }

        // bat1 tween
        const dur = this.cfg.bat1Duration || 3000;
        this.tween = this.tweens.add({ targets: this.my.sprite.bat, y: game.config.height + this.my.sprite.bat.displayHeight, duration: dur, repeat: -1, onRepeat: () => { this.my.sprite.bat.x = Phaser.Math.Between(50, game.config.width - 50); this.my.sprite.bat.y = -this.my.sprite.bat.displayHeight; } });

        // input
        this.left = this.input.keyboard.addKey('A');
        this.right = this.input.keyboard.addKey('D');
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // speeds
        this.playerSpeed = this.cfg.playerSpeed || this.playerSpeed;
        this.bulletSpeed = this.cfg.bulletSpeed || this.bulletSpeed;

        // description and UI
        if (this.cfg.description) document.getElementById('description').innerHTML = this.cfg.description;
        this.my.text.score = this.add.bitmapText(580, 0, 'rocketSquare', 'Score ' + this.myScore);
        this.my.text.wave = this.add.bitmapText(10, 5, 'rocketSquare', this.cfg.waveText || 'Wave', 30);
        this.gameEnded = false;

        const timerDelay = this.cfg.survivalTimerDelay || 60000;
        this.survivalTimer = this.time.addEvent({ delay: timerDelay, callback: () => this.checkGameEnd('timer'), callbackScope: this });

        this.playerHealth = this.playerHealth || 6;
        this.my.text.health = this.add.bitmapText(10, 40, 'rocketSquare', 'Health: ' + this.playerHealth, 30);

        // bullets
        this.my.sprite.bullet = [];
        this.maxBullets = this.cfg.maxBullets || this.maxBullets;

        // enemy bullets pool (optional)
        if (this.cfg.enemyBullets) {
            this.my.sprite.enemyBullet = [];
            for (let i = 0; i < this.cfg.enemyBulletCount; i++) {
                const eb = new EnemyBullet(this, 0, 0, 'fireball');
                eb.makeInactive();
                this.my.sprite.enemyBullet.push(eb);
            }
            this.time.addEvent({ delay: 500, loop: true, callback: () => { if (this.my.sprite.bat) this.enemySpit(this.my.sprite.bat); if (this.my.sprite.bat2) this.enemySpit(this.my.sprite.bat2); } });
        }
    }

    update() {
        const my = this.my;

        if (this.myScore >= this.cfg.winScore) {
            this.checkGameEnd('score');
        }

        // player movement
        if (this.left.isDown) {
            my.sprite.explorer.setTexture('explorer_turning_left');
            if (my.sprite.explorer.x > (my.sprite.explorer.displayWidth / 2)) my.sprite.explorer.x -= this.playerSpeed;
        } else if (this.right.isDown) {
            my.sprite.explorer.setTexture('explorer_turning_right');
            if (my.sprite.explorer.x < (game.config.width - (my.sprite.explorer.displayWidth / 2))) my.sprite.explorer.x += this.playerSpeed;
        } else {
            my.sprite.explorer.setTexture('explorer');
        }

        // fire
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(my.sprite.explorer.x, my.sprite.explorer.y - (my.sprite.explorer.displayHeight / 2), 'heart'));
            }
        }

        // clean offscreen bullets
        my.sprite.bullet = my.sprite.bullet.filter(b => b.y > -(b.displayHeight/2));

        // collisions with bat1
        for (let bullet of my.sprite.bullet) {
            if (!this.batImmune && this.collides(bullet, my.sprite.bat)) {
                bullet.y = -100;
                this.myScore += my.sprite.bat.scorePoints;
                this.updateScore();
                this.batImmune = true;
                this.tween.stop();
                my.sprite.bat.anims.stop();
                my.sprite.bat.setTexture('bat4').setScale(0.70);
                this.time.delayedCall(700, () => {
                    this.puff = this.add.sprite(my.sprite.bat.x, my.sprite.bat.y, 'bat4').setScale(0.25).play('puff');
                    my.sprite.bat.visible = false;
                    this.sound.play('dadada', { volume: .5 });
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        my.sprite.bat.x = Phaser.Math.Between(50, game.config.width - 50);
                        my.sprite.bat.y = -my.sprite.bat.displayHeight;
                        my.sprite.bat.visible = true;
                        my.sprite.bat.play('bat_fly').setScale(0.50);
                        this.batImmune = false;
                        this.restartBatTween();
                    }, this);
                });
            }
        }

        // bat2 collisions (optional)
        if (this.cfg.hasBat2) {
            for (let bullet of my.sprite.bullet) {
                if (!this.bat2Immune && this.collides(bullet, my.sprite.bat2)) {
                    bullet.y = -100;
                    this.myScore += my.sprite.bat2.scorePoints;
                    this.updateScore();
                    this.bat2Immune = true;
                    this.tweens.killTweensOf(my.sprite.bat2);
                    my.sprite.bat2.anims.stop();
                    my.sprite.bat2.setTexture('Obat4').setScale(0.70);
                    this.time.delayedCall(700, () => {
                        this.puff = this.add.sprite(my.sprite.bat2.x, my.sprite.bat2.y, 'Obat4').setScale(0.25).play('puff');
                        my.sprite.bat2.visible = false;
                        this.sound.play('dadada', { volume: 0.5 });
                        this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                            my.sprite.bat2.x = Phaser.Math.Between(50, game.config.width - 50);
                            my.sprite.bat2.y = -50;
                            my.sprite.bat2.visible = true;
                            my.sprite.bat2.play('bat2_fly').setScale(0.50);
                            this.bat2Immune = false;
                            this.startZigZagMovement(my.sprite.bat2);
                        }, this);
                    });
                }
            }
        }

        // enemy bullets handling
        if (this.cfg.enemyBullets && this.my.sprite.enemyBullet) {
            for (let eb of this.my.sprite.enemyBullet) {
                if (eb.active) {
                    eb.y += eb.speed * eb.direction;
                    if (eb.y > this.game.config.height + eb.displayHeight) eb.makeInactive();
                    if (this.collides(eb, this.my.sprite.explorer)) {
                        eb.makeInactive();
                        this.playerHealth--;
                        this.my.text.health.setText('Health: ' + this.playerHealth);
                        this.my.sprite.explorer.setTexture('Hurtexplorer');
                        this.time.delayedCall(1000, () => this.my.sprite.explorer.setTexture('explorer'));
                        if (this.playerHealth <= 0) {
                            this.scene.stop(this.scene.key);
                            this.scene.start(this.cfg.loseScene || 'GameOver');
                        }
                    }
                }
            }
        }

        // move bullets
        for (let bullet of my.sprite.bullet) bullet.y -= this.bulletSpeed;
    }

    // helpers
    collides(a, b) {
        if (!a || !b) return false;
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() { this.my.text.score.setText('Score ' + this.myScore); }

    restartBatTween() {
        this.tween = this.tweens.add({ targets: this.my.sprite.bat, y: game.config.height + this.my.sprite.bat.displayHeight, duration: this.cfg.bat1Duration || 3000, repeat: -1, onRepeat: () => { this.my.sprite.bat.x = Phaser.Math.Between(25, game.config.width - 25); this.my.sprite.bat.y = -this.my.sprite.bat.displayHeight - 10; } });
    }

    startZigZagMovement(bat, steps = 0) {
        if (steps >= 5) {
            this.tweens.add({ targets: bat, y: game.config.height + bat.displayHeight, duration: 200, onComplete: () => { bat.x = Phaser.Math.Between(50, game.config.width - 50); bat.y = -50; this.startZigZagMovement(bat); } });
            return;
        }
        this.tweens.add({ targets: bat, x: Phaser.Math.Between(50, game.config.width - 50), y: bat.y + 100, duration: 500, ease: 'Power1', onComplete: () => this.startZigZagMovement(bat, steps + 1) });
    }

    enemySpit(bat) {
        if (!bat || (bat.canFire === false)) return;
        for (let bullet of this.my.sprite.enemyBullet) {
            if (!bullet.active) {
                const bx = bat.x;
                const by = bat.y + (bat.displayHeight / 2);
                const dir = 1;
                bullet.makeActive ? bullet.makeActive(bx, by, dir) : (bullet.x = bx, bullet.y = by, bullet.direction = dir, bullet.active = true, bullet.visible = true);
                // throttle this bat until cooldown expires
                bat.canFire = false;
                this.time.delayedCall(this.cfg.enemyFireCooldown || 1000, () => { bat.canFire = true; });
                break;
            }
        }
    }

    checkGameEnd(trigger) {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.scene.stop(this.scene.key);
        const nextScene = (trigger === 'score') ? (this.cfg.winScene || 'LevelComplete') : (this.cfg.timeoutScene || this.cfg.winScene || 'LevelComplete');
        this.scene.start(nextScene);
    }
}
