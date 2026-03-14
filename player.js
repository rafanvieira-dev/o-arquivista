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
        
        // MUDANÇA: Começa logo no frame 1 para não nascer invisível
        this.frameX = 1; 
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

        // --- LÓGICA DA GRELHA 4x4 ---
        if (!this.grounded) {
            this.frameY = 3; // Linha 4 (Pulo/Queda)
            if (this.vy < 0) this.frameX = 1; // Subindo
            else this.frameX = 2; // Caindo
        } 
        else if (this.vx !== 0) {
            this.frameY = 2; // Linha 3 (Corrida)
            this.frameTimer += deltaTime;
            if (this.frameTimer > 70) { 
                this.frameX = (this.frameX + 1) % 4; // Anima de 0 a 3
                this.frameTimer = 0; 
            }
        } 
        else {
            // O FREEZE ABSOLUTO NO FRAME 1
            // Usamos o frame 1 (o segundo desenho) porque o 0 é engolido pelo corte das bordas
            this.frameY = 0; 
            this.frameX = 1; 
            this.frameTimer = 0; 
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        let cellW = Math.floor(this.image.naturalWidth / 4);
        let cellH = Math.floor(this.image.naturalHeight / 4); 
        
        // Corte de 25% nas laterais (Resolve o problema do braço extra)
        let trimX = Math.floor(cellW * 0.25); 
        let trimY = Math.floor(cellH * 0.05); 
        
        let sX = Math.floor((this.frameX * cellW) + trimX);
        let sY = Math.floor((this.frameY * cellH) + trimY);
        let sW = Math.floor(cellW - (trimX * 2));
        let sH = Math.floor(cellH - (trimY * 2));
        
        let drawW = 95; 
        let drawH = 95;
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        
        let drawY = this.y - (drawH - this.height) + 18; 

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
