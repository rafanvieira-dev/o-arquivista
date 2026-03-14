class Player {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
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
        this.maxFrame = 3; 
    }

    update(keys, deltaTime, jumpJustPressed) {
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (this.grounded) { this.jumps = 0; }

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

        // --- LÓGICA DE ANIMAÇÃO ---
        if (!this.grounded) {
            this.frameY = 3; // Linha de Pulo/Cair
            this.frameX = (this.vy < 0) ? 1 : 2; 
        } 
        else if (this.vx !== 0) {
            this.frameY = 2; // Linha de Corrida (Linha 3)
            this.maxFrame = 3; 
            this.frameTimer += deltaTime;
            if (this.frameTimer > 80) { 
                this.frameX = (this.frameX >= this.maxFrame) ? 0 : this.frameX + 1;
                this.frameTimer = 0; 
            }
        } 
        else {
            this.frameY = 0; // Linha Parado
            this.frameX = 0; // CONGELADO no primeiro frame para não tremer
            this.frameTimer = 0; 
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        let cellW = this.image.naturalWidth / 4;
        let cellH = this.image.naturalHeight / 4; 
        
        // --- CORTE DE SEGURANÇA (Anti-Fantasma) ---
        // Ignora 10% de cada lado do frame para não mostrar o boneco vizinho
        let trimX = cellW * 0.10;
        let sX = (this.frameX * cellW) + trimX;
        let sY = this.frameY * cellH;
        let sW = cellW - (trimX * 2);
        let sH = cellH;
        
        let drawW = 100; 
        let drawH = 100;
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        
        // Ajuste para os pés tocarem a madeira conforme o seu print
        let ajusteDosPes = 30; 
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
