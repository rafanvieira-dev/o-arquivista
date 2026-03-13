class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x; this.startY = y;
        this.x = x; this.y = y;
        this.width = 70; this.height = 70;
        this.vx = 2; 
        this.patrolDistance = patrolDistance;
        this.facing = 1;
        this.image = new Image();
        this.image.src = 'assets/sprites/rato.png';
        this.frameX = 0; this.frameTimer = 0;
    }

    update(deltaTime) {
        this.x += this.vx;
        if (this.x > this.startX + this.patrolDistance || this.x < this.startX) {
            this.vx *= -1;
            this.facing = (this.vx > 0) ? 1 : -1;
        }

        this.frameTimer += deltaTime;
        if (this.frameTimer > 100) {
            this.frameX = (this.frameX + 1) % 4;
            this.frameTimer = 0;
        }
    }

    draw(ctx, cameraX) {
        if (!this.image.complete) return;
        let sWidth = this.image.width / 4;
        let sHeight = this.image.height / 4;
        ctx.save();
        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, -(this.x - cameraX + 50), this.y, 50, 50);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, this.x - cameraX, this.y, 50, 50);
        }
        ctx.restore();
    }
}

const enemiesList = [
    new Enemy(450, 500, 200),
    new Enemy(1400, 200, 150),
    new Enemy(2600, 350, 200)
];
