class Player {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
        
        // Caixa de colisão invisível (Hitbox)
        this.width = 30;  
        this.height = 75; 
        
        this.vx = 0; 
        this.vy = 0;
        this.speed = 6; 
        this.jumpForce = -15; 
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
        this.maxFrame = 3; // A nova imagem tem 4 colunas (0 a 3)
    }

    update(keys, deltaTime, jumpJustPressed) {
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (this.grounded) { this.jumps = 0; }

        // Duplo Pulo
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

        // --- SISTEMA DE ANIMAÇÃO 4x4 ---
        if (!this.grounded) {
            // PULAR / CAIR (Linha 4 da imagem, índice 3)
            this.frameY = 3; 
            // Frame 1 = A subir | Frame 2 = A cair
            if (this.vy < -2) this.frameX = 1;
            else if (this.vy > 2) this.frameX = 2;
            else this.frameX = 1; 
        } 
        else if (this.vx !== 0) {
            // A CORRER (Linha 3 da imagem, índice 2)
            this.frameY = 2; 
            this.maxFrame = 3; 
            
            this.frameTimer += deltaTime;
            if (this.frameTimer > 80) { // Velocidade da corrida
                this.frameX = (this.frameX >= this.maxFrame) ? 0 : this.frameX + 1;
                this.frameTimer = 0; 
            }
        } 
        else {
            // PARADO (Linha 1 da imagem, índice 0)
            this.frameY = 0; 
            this.maxFrame = 3; 
            
            this.frameTimer += deltaTime;
            // Deixei a animação dele parado BEM LENTA para dar um efeito de respiração sem tremer
            if (this.frameTimer > 200) { 
                this.frameX = (this.frameX >= this.maxFrame) ? 0 : this.frameX + 1;
                this.frameTimer = 0; 
            }
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        // Divide a imagem perfeitamente em 4 por 4
        let cellW = this.image.naturalWidth / 4;
        let cellH = this.image.naturalHeight / 4; 
        
        let sX = this.frameX * cellW;
        let sY = this.frameY * cellH;
        let sW = cellW;
        let sH = cellH;
        
        // Tamanho do personagem no ecrã
        let drawW = 100; 
        let drawH = 100;
        
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        
        // Ajuste dos sapatos (Aumente ou diminua este número para afundar/subir o boneco)
        let ajusteDosPes = 12; 
        let drawY = this.y - (drawH - this.height) + ajusteDosPes;

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
