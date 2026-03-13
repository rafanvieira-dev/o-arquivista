class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 32;   this.height = 70; // Caixa de colisão pequena e precisa
        this.vx = 0; this.vy = 0;
        this.speed = 5; this.jumpForce = -16; this.gravity = 0.8;
        this.grounded = false; this.facing = 1; this.invincible = false;
        this.image = new Image(); this.image.src = 'assets/sprites/arquivista.png';
        this.frameX = 0; this.frameY = 0; this.frameTimer = 0;
    }

    update(keys, deltaTime) {
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (keys.up && this.grounded) { this.vy = this.jumpForce; this.grounded = false; }

        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        // Animação baseada no estado
        if (!this.grounded) this.frameY = 2;
        else if (this.vx !== 0) this.frameY = 1;
        else this.frameY = 0;

        this.frameTimer += deltaTime;
        if (this.frameTimer > 100) { this.frameX = (this.frameX + 1) % 4; this.frameTimer = 0; }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete) return;
        let sWidth = this.image.width / 4;
        let sHeight = this.image.height / 3;
        ctx.save();
        // O ajuste -20 no X e -15 no Y "afunda" o desenho na colisão para os pés tocarem o chão
        let drawX = this.x - cameraX - 18;
        let drawY = this.y - 15;
        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, -(drawX + 64), drawY, 64, 85);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, drawX, drawY, 64, 85);
        }
        ctx.restore();
    }
}
