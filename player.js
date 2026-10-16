class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 75;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5.8;
        this.jumpForce = -14.2;
        this.gravity = 0.72;
        this.grounded = false;
        this.facing = 1;
        this.invincible = false;
        this.jumps = 0;
        this.maxJumps = 2;

        this.image = new Image();
        this.image.src = 'assets/sprites/arquivista.png';
        this.frameX = 1;
        this.frameY = 0;
        this.frameTimer = 0;
    }

    update(keys, deltaTime, jumpJustPressed) {
        const frameScale = Math.min(deltaTime / 16.667, 2.5);

        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (this.grounded) this.jumps = 0;

        if (jumpJustPressed) {
            if (this.grounded) {
                this.vy = this.jumpForce;
                this.grounded = false;
                this.jumps = 1;
            } else if (this.jumps === 1 && this.maxJumps > 1) {
                this.vy = this.jumpForce;
                this.jumps = 2;
            }
        }

        this.vy += this.gravity * frameScale;

        if (!this.grounded) {
            this.frameY = 3;
            this.frameX = this.vy < 0 ? 1 : 2;
        } else if (this.vx !== 0) {
            this.frameY = 2;
            this.frameTimer += deltaTime;
            if (this.frameTimer > 70) {
                this.frameX = (this.frameX + 1) % 4;
                this.frameTimer = 0;
            }
        } else {
            this.frameY = 0;
            this.frameX = 1;
            this.frameTimer = 0;
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;

        const cellW = Math.floor(this.image.naturalWidth / 4);
        const cellH = Math.floor(this.image.naturalHeight / 4);
        const trimX = Math.floor(cellW * 0.25);
        const trimY = Math.floor(cellH * 0.05);
        const sX = Math.floor(this.frameX * cellW + trimX);
        const sY = Math.floor(this.frameY * cellH + trimY);
        const sW = Math.floor(cellW - trimX * 2);
        const sH = Math.floor(cellH - trimY * 2);
        const drawW = 95;
        const drawH = 95;
        const drawX = this.x - cameraX - (drawW - this.width) / 2;
        const drawY = this.y - (drawH - this.height) + 18;

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, sX, sY, sW, sH, -drawW / 2, 0, drawW, drawH);
        } else {
            ctx.drawImage(this.image, sX, sY, sW, sH, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }
}
