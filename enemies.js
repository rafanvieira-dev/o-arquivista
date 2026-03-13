class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x; this.startY = y;
        this.x = x; this.y = y;
        
        this.width = 80; this.height = 80; 
        
        this.vx = 2.5; 
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
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, -(this.x - cameraX + this.width), this.y, this.width, this.height);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, this.x - cameraX, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}

// POSIÇÕES CORRIGIDAS: Ratos de altura 80 no chão de Y=550 ficam no Y=470!
const enemiesList = [
    new Enemy(600, 470, 100),  // Rato no chão 
    new Enemy(800, 370, 150),  // Rato em cima do Armário 2 (450 - 80 = 370)
    new Enemy(1400, 470, 150), // Rato no chão
    new Enemy(2100, 320, 100), // Rato em cima do Armário 5 (400 - 80 = 320)
    new Enemy(2800, 470, 150)  // Rato no chão
];
