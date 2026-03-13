class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 40;   // Colisão mais estreita evita trancar nos cantos
        this.height = 75;  // Altura real para pisar no chão
        this.vx = 0; this.vy = 0;
        this.speed = 5; this.jumpForce = -16; this.gravity = 0.9;
        this.grounded = false; this.facing = 1; this.invincible = false;

        this.image = new Image();
        this.image.src = 'assets/sprites/arquivista.png';
        this.frameX = 0; this.frameY = 0;
        this.frameTimer = 0; this.frameInterval = 1000/10;
    }

    update(keys, deltaTime) {
        // Movimento lateral com resposta imediata
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; } // Parada brusca para melhor controle

        // Pulo
        if (keys.up && this.grounded) { this.vy = this.jumpForce; this.grounded = false; }

        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        // Controle de Animação
        if (!this.grounded) this.frameY = 2; // Ar
        else if (this.vx !== 0) this.frameY = 1; // Correndo
        else this.frameY = 0; // Parado

        this.frameTimer += deltaTime;
        if (this.frameTimer > this.frameInterval) {
            this.frameX = (this.frameX + 1) % 4;
            this.frameTimer = 0;
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        let sWidth = this.image.width / 4;
        let sHeight = this.image.height / 3;
        ctx.save();
        // Ajuste de desenho: -15 no Y para a imagem "encaixar" na colisão
        let drawX = this.x - cameraX - 15;
        let drawY = this.y - 10;
        
        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, -(drawX + 70), drawY, 70, 90);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, drawX, drawY, 70, 90);
        }
        ctx.restore();
    }
}
