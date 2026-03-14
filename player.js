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
        
        this.frameX = 1; // Começa no frame seguro
        this.frameY = 0; 
        this.frameTimer = 0;
    }

    update(keys, deltaTime, jumpJustPressed) {
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (this.grounded) { this.jumps = 0; }

        if (jumpJustPressed) {
            if (this.grounded) {
                this.vy = this.jumpForce; this.grounded = false; this.jumps = 1;
            } else if (this.jumps === 1 && Math.abs(this.vx) > 0) { 
                this.vy = this.jumpForce; this.jumps = 2;
            }
        }

        this.vy += this.gravity;

        // LÓGICA DA FOLHA DE SPRITES 7x4
        if (!this.grounded) {
            this.frameY = 2; // Linha de Pulo
            // Frames de subida, pico e queda
            if (this.vy < -5) this.frameX = 2;
            else if (this.vy > 5) this.frameX = 4;
            else this.frameX = 3;
        } 
        else if (this.vx !== 0) {
            this.frameY = 1; // Linha de Corrida
            this.frameTimer += deltaTime;
            if (this.frameTimer > 60) { 
                this.frameX = (this.frameX >= 6) ? 0 : this.frameX + 1; // 7 frames (0 a 6)
                this.frameTimer = 0; 
            }
        } 
        else {
            // O ESQUEMA FREEZE: Quando está parado, estanca!
            this.frameY = 0; 
            this.frameX = 1; // Fixo no frame 1 (o segundo desenho) para não cortar a borda
            this.frameTimer = 0; // O tempo pára, impedindo qualquer movimento ou "fantasma"
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        // MATEMÁTICA ESTrita para 7 colunas!
        let cellW = Math.floor(this.image.naturalWidth / 7);
        // A imagem tem muito espaço em branco por baixo. Dividir por 5.5 foca no personagem.
        let cellH = Math.floor(this.image.naturalHeight / 5.5); 
        
        // Corte Cirúrgico Anti-Fantasmas (25% das laterais)
        let trimX = Math.floor(cellW * 0.25); 
        let trimY = Math.floor(cellH * 0.15); 
        
        let sX = Math.floor((this.frameX * cellW) + trimX);
        let sY = Math.floor((this.frameY * cellH) + trimY);
        let sW = Math.floor(cellW - (trimX * 2));
        let sH = Math.floor(cellH - (trimY * 1.5));
        
        let drawW = 90; 
        let drawH = 100;
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        let drawY = this.y - (drawH - this.height) + 5; // Ajuste da sola no chão

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
