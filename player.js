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
        this.maxFrame = 7; // A imagem tem 8 colunas (0 a 7)
    }

    update(keys, deltaTime, jumpJustPressed) {
        // Movimento Horizontal
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (this.grounded) { this.jumps = 0; }

        // Lógica do Salto
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
            // NO AR (Linha 3 da sua imagem)
            this.frameY = 2; 
            // Se estiver a subir, usa o frame 3 (joelho alto). Se estiver a cair, usa o frame 4.
            this.frameX = this.vy < 0 ? 3 : 4; 
        } 
        else if (this.vx !== 0) {
            // A CORRER (Linha 2 da sua imagem)
            this.frameY = 1; 
            this.maxFrame = 7; 
            
            this.frameTimer += deltaTime;
            if (this.frameTimer > 60) { // Velocidade rápida das pernas
                this.frameX = (this.frameX >= this.maxFrame) ? 0 : this.frameX + 1;
                this.frameTimer = 0; 
            }
        } 
        else {
            // PARADO / RESPIRANDO (Linha 1 da sua imagem)
            this.frameY = 0; 
            this.maxFrame = 7; 
            
            this.frameTimer += deltaTime;
            if (this.frameTimer > 150) { // Respiração lenta e calma
                this.frameX = (this.frameX >= this.maxFrame) ? 0 : this.frameX + 1;
                this.frameTimer = 0; 
            }
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        // Divide a imagem perfeitamente em 8 colunas e 4 linhas
        let cellW = this.image.naturalWidth / 8;
        let cellH = this.image.naturalHeight / 4;
        
        // --- O SEGREDO: CORTE INTELIGENTE (ANTI-BLEED) ---
        // Cortamos 22% do espaço vazio de cada lado do frame para não apanhar o boneco vizinho!
        let trimX = cellW * 0.22; 
        let trimY = cellH * 0.10; // Corta 10% de cima e baixo
        
        let sX = (this.frameX * cellW) + trimX;
        let sY = (this.frameY * cellH) + trimY;
        let sW = cellW - (trimX * 2);
        let sH = cellH - (trimY * 2);
        
        // Tamanho de desenho no ecrã do jogo
        let drawW = 65; 
        let drawH = 80;
        
        // Alinha os sapatos à caixa de colisão
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        let drawY = this.y - (drawH - this.height);

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY);
            ctx.scale(-1, 1);
            // Desenha a imagem usando o corte inteligente
            ctx.drawImage(this.image, sX, sY, sW, sH, -drawW / 2, 0, drawW, drawH);
        } else {
            // Desenha a imagem usando o corte inteligente
            ctx.drawImage(this.image, sX, sY, sW, sH, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }
}
