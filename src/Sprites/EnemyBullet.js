class EnemyBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture , frame) {
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        this.speed = 5;
        this.direction = 1; // Downward by default
        scene.add.existing(this);
    }

    update() {
        if (this.active) {
            this.y += this.speed * this.direction;
            if (this.y < -this.displayHeight || this.y > this.scene.game.config.height + this.displayHeight) {
                this.makeInactive();
            }
        }
    }

    makeActive(x, y, direction = 1) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }
}
