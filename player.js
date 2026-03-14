class Player {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
        this.width = 30;  
        this.height = 75; 
        this.vx = 0; 
        this.vy = 0;
        this.speed = 6.5; 
        this.jumpForce = -15.5; 
        this.gravity = 0.8;
        this.grounded = false; 
        this.facing = 1; 
        this.invincible = false;
        this.jumps = 0; 
        this.maxJumps = 2;

        this.image = new Image(); 
        this.image.src = 'assets/sprites/arquivista.png'; 
        
        this.frameX = 0; 
        this.frameY = 0; 
        this.frameTimer = 0;
    }

    update(keys, deltaTime, jumpJustPressed) {
        // Movimento Horizontal
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (this.grounded) { this.jumps = 0; }

        // Pulo e Duplo Pulo
        if (jumpJustPressed) {
            if (this.grounded) {
                this.vy = this.jumpForce; this.grounded = false; this.jumps = 1;
            } else if (this.jumps === 1 && Math.abs(this.vx) > 0) { 
                this.vy = this.jumpForce; this.jumps = 2;
            }
        }

        this.vy += this.gravity;

        // --- SISTEMA DE ANIMAÇÃO ---
        if (!this.grounded) {
            this.frameY = 3; // Linha de Pulo
            this.frameTimer += deltaTime;
            if (this.frameTimer > 100) {
                this.frameX = (this.frameX + 1) % 4;
                this.frameTimer = 0;
            }
        } 
        else if (this.vx !== 0) {
            this.frameY = 2; // Linha de Correr
            this.frameTimer += deltaTime;
            if (this.frameTimer > 80) { 
                this.frameX = (this.frameX + 1) % 4; 
                this.frameTimer = 0; 
            }
        } 
        else {
            // O ESQUEMA FREEZE: Personagem parado
            this.frameY = 0; 
            this.frameX = 0; // Congela ABSOLUTAMENTE no primeiro frame
            this.frameTimer = 0; // O tempo pára de contar para não haver animação
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        // CORTE MATEMÁTICO PERFEITO E SEGURO
        let cellW = Math.floor(this.image.naturalWidth / 4);
        let cellH = Math.floor(this.image.naturalHeight / 4); 
        
        // Corte agressivo de 28% nas laterais para focar só no centro
        let trimX = Math.floor(cellW * 0.28); 
        let trimY = Math.floor(cellH * 0.05); 
        
        let sX = Math.floor((this.frameX * cellW) + trimX);
        let sY = Math.floor((this.frameY * cellH) + trimY);
        let sW = Math.floor(cellW - (trimX * 2));
        let sH = Math.floor(cellH - (trimY * 2));
        
        let drawW = 95; 
        let drawH = 95;
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        let drawY = this.y - (drawH - this.height) + 22; // Ajuste para pisar no chão

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
