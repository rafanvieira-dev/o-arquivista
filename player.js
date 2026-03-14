class Player {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
        
        // --- CAIXA DE COLISÃO PRECISA (HITBOX) ---
        // Caixa mais estreita para não ficar preso nas esquinas facilmente
        this.width = 32;  
        // Caixa mais alta para acompanhar o novo tamanho maior do personagem
        this.height = 78; 
        
        this.vx = 0; 
        this.vy = 0;
        this.speed = 5; 
        this.jumpForce = -14.5; 
        this.gravity = 0.8;
        
        this.grounded = false; 
        this.facing = 1; 
        this.invincible = false;

        this.jumps = 0; 
        this.maxJumps = 2;

        this.image = new Image(); 
        this.image.src = 'assets/sprites/arquivista.png'; // Confirme que o nome está igual!
        
        this.frameX = 0; 
        this.frameY = 0; 
        this.frameTimer = 0;
        this.maxFrame = 6; 
    }

    update(keys, deltaTime, jumpJustPressed) {
        // Movimento Horizontal
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (this.grounded) { this.jumps = 0; }

        // Lógica do Duplo Pulo
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

        // --- NOVO SISTEMA DE ANIMAÇÃO (Grelha 7x4) ---
        if (!this.grounded) {
            // PULAR (Linha 3, Índice 2)
            this.frameY = 2; 
            // Frame 2 (a subir), Frame 3 (pico do salto), Frame 4 (a cair)
            if (this.vy < -5) this.frameX = 2;
            else if (this.vy > 5) this.frameX = 4;
            else this.frameX = 3;
        } 
        else if (this.vx !== 0) {
            // A CORRER (Linha 2, Índice 1)
            this.frameY = 1; 
            this.maxFrame = 6; // 7 frames no total (0 a 6)
            
            this.frameTimer += deltaTime;
            if (this.frameTimer > 60) { 
                this.frameX = (this.frameX >= this.maxFrame) ? 0 : this.frameX + 1;
                this.frameTimer = 0; 
            }
        } 
        else {
            // PARADO (Linha 1, Índice 0)
            this.frameY = 0; 
            this.frameX = 0; // Congela no primeiro frame para evitar tremores
            this.frameTimer = 0; 
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        // A nova imagem tem 7 colunas e cerca de 5.5 linhas lógicas de altura
        // (Ajustamos o cálculo da altura para ignorar o espaço vazio gigante no fundo da imagem)
        let cellW = this.image.naturalWidth / 7;
        let cellH = this.image.naturalHeight / 5.5; 
        
        // --- CORTE ULTRA-PRECISO (TRIMMING) ---
        // Corta o espaço vazio à volta do sprite para os pés alinharem perfeitamente
        let trimX = cellW * 0.25; 
        // Corta o espaço transparente em cima e em baixo para colar os pés ao chão
        let trimY = cellH * 0.18; 
        
        let sX = (this.frameX * cellW) + trimX;
        let sY = (this.frameY * cellH) + trimY;
        let sW = cellW - (trimX * 2);
        let sH = cellH - (trimY * 1.5); // Corta um pouco menos em baixo para não cortar os sapatos
        
        // --- TAMANHO AUMENTADO ---
        // Tamanho de desenho no ecrã do jogo (agora é maior)
        let drawW = 80; 
        let drawH = 95;
        
        // Centraliza horizontalmente na hitbox, e cola o fundo da imagem (pés) ao fundo da hitbox
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
