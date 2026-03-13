class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 45;   // Largura da colisão
        this.height = 78;  // Altura da colisão (ajustado para não flutuar)
        this.vx = 0; this.vy = 0;
        this.speed = 5; this.jumpForce = -16; this.gravity = 0.9;
        this.grounded = false; this.facing = 1; this.invincible = false;

        this.image = new Image();
        this.image.src = 'assets/sprites/arquivista.png';
        this.frameX = 0; this.frameY = 0; this.maxFrame = 3;
        this.frameTimer = 0; this.frameInterval = 1000/12;
    }

    update(keys, deltaTime) {
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx *= 0.85; }

        if (keys.up && this.grounded) { this.vy = this.jumpForce; this.grounded = false; }

        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        if (this.grounded) {
            if (Math.abs(this.vx) > 0.5) this.frameY = 1; else this.frameY = 0;
        } else { this.frameY = 2; }

        if (this.frameTimer > this.frameInterval) {
            this.frameX = (this.frameX + 1) % 4;
            this.frameTimer = 0;
        } else { this.frameTimer += deltaTime; }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        let sWidth = this.image.width / 4;
        let sHeight = this.image.height / 3;
        ctx.save();
        // O ajuste "+5" e "-10" garante que a imagem cubra a caixa de colisão sem flutuar
        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, -(this.x - cameraX + this.width + 12), this.y - 5, 70, 90);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, this.x - cameraX - 12, this.y - 5, 70, 90);
        }
        ctx.restore();
    }
}
