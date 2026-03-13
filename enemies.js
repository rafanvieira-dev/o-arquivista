class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x;
        this.startY = y; // Guarda a altura inicial para o reset
        this.x = x;
        this.y = y;
        
        this.width = 60;
        this.height = 60; 
        
        this.vx = 2; 
        this.patrolDistance = patrolDistance;
        this.facing = 1;

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

// Exército de Ratos para o novo Mega Nível
const enemiesList = [
    new Enemy(350, 505, 150),  // Rato chão início
    new Enemy(920, 375, 150),  // Rato mesa 1
    new Enemy(1250, 235, 100), // Rato armário 1
    new Enemy(1520, 135, 150), // Rato andaime 1
    new Enemy(2050, 335, 100), // Rato armário 2
    new Enemy(2370, 235, 150), // Rato andaime 2
    new Enemy(2860, 355, 150), // Rato mesa 2
    new Enemy(3520, 405, 150)  // Rato mesa final
];
