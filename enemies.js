class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x;
        this.x = x;
        this.y = y;
        
        // CORREÇÃO DO ACHATAMENTO:
        // Como o corte da imagem é um quadrado, a largura e altura no jogo também têm de ser iguais!
        this.width = 60;
        this.height = 60; 
        
        this.vx = 2; 
        this.patrolDistance = patrolDistance;
        this.facing = 1;

        // --- SISTEMA DE SPRITES ---
        this.image = new Image();
        this.image.src = 'assets/sprites/rato.png'; 
        
        this.frameX = 0; 
        this.frameY = 0; 
        this.maxFrame = 3; 
        
        this.fps = 15; 
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        this.x += this.vx;
        
        if (this.x > this.startX + this.patrolDistance) {
            this.vx *= -1;
            this.facing = -1; 
        } else if (this.x < this.startX) {
            this.vx *= -1;
            this.facing = 1;  
        }

        let time = deltaTime || 16; 
        
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            this.frameTimer = 0;
        } else {
            this.frameTimer += time;
        }
    }

    draw(ctx, cameraX) {
        if (!this.image.complete || this.image.naturalWidth === 0) {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
            return;
        }

        let sWidth = this.image.naturalWidth / 4;  
        let sHeight = this.image.naturalHeight / 4; 

        let cropX = this.frameX * sWidth;
        let cropY = this.frameY * sHeight;

        ctx.save();

        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image, 
                cropX, cropY, sWidth, sHeight, 
                -(this.x - cameraX + this.width), this.y, this.width, this.height
            );
        } else {
            ctx.drawImage(
                this.image, 
                cropX, cropY, sWidth, sHeight, 
                this.x - cameraX, this.y, this.width, this.height
            );
        }

        ctx.restore();
    }
}

// CORREÇÃO DA POSIÇÃO (Y): 
// Como o rato agora tem 60 de altura, subimos a posição dele para ele ficar pisando certinho na estante.
// O chão está em 550 (550 - 60 = 490) e a estante em 350 (350 - 60 = 290).
const enemiesList = [
    new Enemy(400, 490, 200), // Rato no chão
    new Enemy(900, 490, 150), // Rato no chão
    new Enemy(550, 290, 100)  // Rato na estante 
];
