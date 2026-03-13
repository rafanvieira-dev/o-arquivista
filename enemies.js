class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x; this.startY = y;
        this.x = x; this.y = y;
        
        // RATOS MAIORES E MAIS ASSUSTADORES
        this.width = 80; this.height = 80; 
        
        this.vx = 2.5; // Ficaram ligeiramente mais rápidos
        this.patrolDistance = patrolDistance;
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
            // Ajustado para desenhar o rato com o seu novo tamanho (80x80)
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, -(this.x - cameraX + this.width), this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, this.x - cameraX, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}

const enemiesList = [
    new Enemy(600, 470, 100),  // Rato no chão
    new Enemy(1400, 270, 150), // Rato no Andaime (350 - 80 = 270)
    new Enemy(2000, 470, 200), // Rato no chão
    new Enemy(2850, 470, 200)  // Rato no chão
];
