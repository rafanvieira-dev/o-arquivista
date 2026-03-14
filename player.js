class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 30; this.height = 75; 
        this.vx = 0; this.vy = 0;
        this.speed = 6.5; this.jumpForce = -15.5; this.gravity = 0.8;
        this.grounded = false; this.facing = 1; this.invincible = false;
        this.jumps = 0; this.maxJumps = 2;

        this.image = new Image(); 
        this.image.src = 'assets/sprites/arquivista.png'; 
        
        this.frameX = 0; this.frameY = 0; this.frameTimer = 0;
    }

    update(keys, deltaTime, jumpJustPressed) {
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (this.grounded) { this.jumps = 0; }

        if (jumpJustPressed) {
            if (this.grounded) { this.vy = this.jumpForce; this.grounded = false; this.jumps = 1; }
            else if (this.jumps === 1 && Math.abs(this.vx) > 0) { this.vy = this.jumpForce; this.jumps = 2; }
        }

        this.vy += this.gravity;

        // --- MATEMÁTICA CORRIGIDA PARA 4 COLUNAS E 4 LINHAS ---
        if (!this.grounded) {
            this.frameY = 3; // Linha de Pulo/Queda
            if (this.vy < 0) this.frameX = 1; // Frame de subida
            else this.frameX = 2; // Frame de descida
        } 
        else if (this.vx !== 0) {
            this.frameY = 2; // Linha de Corrida
            this.frameTimer += deltaTime;
            if (this.frameTimer > 70) { 
                this.frameX = (this.frameX + 1) % 4; // Roda pelos 4 frames!
                this.frameTimer = 0; 
            }
        } 
        else {
            // FREEZE ABSOLUTO: Parado sem piscar e sem sumir
            this.frameY = 0; 
            this.frameX = 0; // Fixado perfeitamente no frame 0 (o primeiro boneco)
            this.frameTimer = 0; 
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        // A imagem tem exatamente 4 COLUNAS e 4 LINHAS
        let cellW = Math.floor(this.image.naturalWidth / 4);
        let cellH = Math.floor(this.image.naturalHeight / 4); 
        
        // Corte de 25% nas laterais para garantir que o braço do boneco ao lado não aparece
        let trimX = Math.floor(cellW * 0.25); 
        let trimY = Math.floor(cellH * 0.05); 
        
        let sX = Math.floor((this.frameX * cellW) + trimX);
        let sY = Math.floor((this.frameY * cellH) + trimY);
        let sW = Math.floor(cellW - (trimX * 2));
        let sH = Math.floor(cellH - (trimY * 2));
        
        let drawW = 95; let drawH = 95;
        let drawX = Math.floor(this.x - cameraX - (drawW - this.width) / 2);
        
        // Ajuste dos sapatos para pisarem exatamente na madeira do fundo
        let drawY = Math.floor(this.y - (drawH - this.height) + 18); 

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY); ctx.scale(-1, 1);
            ctx.drawImage(this.image, sX, sY, sW, sH, Math.floor(-drawW / 2), 0, drawW, drawH);
        } else {
            ctx.drawImage(this.image, sX, sY, sW, sH, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }
}
