class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x; this.startY = y;
        this.width = 50; this.height = 50; 
        this.x = x; this.y = y; 
        this.vx = 2.5; this.patrolDistance = patrolDistance;
        this.facing = 1;
        this.image = new Image(); this.image.src = 'assets/sprites/rato.png';
        this.frameX = 0; this.frameTimer = 0;
    }

    update(deltaTime) {
        this.x += this.vx;
        if (this.x > this.startX + this.patrolDistance || this.x < this.startX) {
            this.vx *= -1;
            this.facing = (this.vx > 0) ? 1 : -1;
        }
        this.frameTimer += deltaTime;
        if (this.frameTimer > 100) { this.frameX = (this.frameX + 1) % 4; this.frameTimer = 0; }
    }

    draw(ctx, cameraX) {
        if (!this.image.complete) return;
        let sWidth = this.image.width / 4;
        let sHeight = this.image.height / 4;
        
        let drawW = 70; let drawH = 70; 
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        let drawY = this.y - (drawH - this.height);

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, -drawW / 2, 0, drawW, drawH);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }
}

// Ratos (No Chão = 500 - 50 = 450)
const enemiesList = [
    new Enemy(600, 450, 150),
    new Enemy(1450, 450, 100),
    new Enemy(2200, 450, 200)
];
