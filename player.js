class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 30;  this.height = 70; // Caixa de física invisível
        this.vx = 0; this.vy = 0;
        this.speed = 5; this.jumpForce = -14; this.gravity = 0.8;
        
        this.grounded = false; 
        this.facing = 1; 
        this.invincible = false;

        // Duplo Pulo
        this.jumps = 0; 
        this.maxJumps = 2;

        this.image = new Image(); 
        this.image.src = 'assets/sprites/arquivista.png';
        
        this.frameX = 0; 
        this.frameY = 0; 
        this.frameTimer = 0;
        this.maxFrame = 7; 
    }

    update(keys, deltaTime, jumpJustPressed) {
        // Movimento Horizontal
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (this.grounded) { this.jumps = 0; }

        // Lógica do Salto e Duplo Pulo
        if (jumpJustPressed) {
            if (this.grounded) {
                this.vy = this.jumpForce;
                this.grounded = false;
                this.jumps = 1;
            } else if (this.jumps === 1 && Math.abs(this.vx) > 0) { 
                this.vy = this.jumpForce;
                this.jumps = 2;
            }
        }

        this.vy += this.gravity;

        // --- SISTEMA DE ANIMAÇÃO ---
        if (!this.grounded) {
            // NO AR (Linha 3: Se sobe, joelho alto [3]. Se cai, braço aberto [4])
            this.frameY = 2; 
            this.frameX = this.vy < 0 ? 3 : 4; 
        } 
        else if (this.vx !== 0) {
            // A CORRER (Linha 2: Ciclo rápido)
            this.frameY = 1; 
            this.maxFrame = 7; 
            
            this.frameTimer += deltaTime;
            if (this.frameTimer > 60) { 
                this.frameX = (this.frameX >= this.maxFrame) ? 0 : this.frameX + 1;
                this.frameTimer = 0; 
            }
        } 
        else {
            // PARADO (Linha 1: CONGELADO TOTALMENTE)
            this.frameY = 0; 
            this.frameX = 0;     // Fica PRESO no primeiro frame
            this.frameTimer = 0; // O relógio pára para ele não tremer
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        let cellW = this.image.naturalWidth / 8;
        let cellH = this.image.naturalHeight / 4;
        
        // --- CORTE MAIS AGRESSIVO ---
        // Aumentámos o corte horizontal (trimX) de 0.22 para 0.26. 
        // Isto elimina os braços/pernas dos frames do lado!
        let trimX = cellW * 0.26; 
        let trimY = cellH * 0.15; 
        
        let sX = (this.frameX * cellW) + trimX;
        let sY = (this.frameY * cellH) + trimY;
        let sW = cellW - (trimX * 2);
        let sH = cellH - (trimY * 2);
        
        // Tamanho fixo de exibição na tela
        let drawW = 60; 
        let drawH = 80;
        
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        let drawY = this.y - (drawH - this.height);

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
