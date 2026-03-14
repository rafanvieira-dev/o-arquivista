class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 30; this.height = 70;
        this.vx = 0; this.vy = 0;
        this.speed = 6; this.jumpForce = -15; this.gravity = 0.8;
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

        // Escolha da Linha (Y) baseada na ação
        if (!this.grounded) this.frameY = 3; 
        else if (this.vx !== 0) this.frameY = 2; // Andando/Correndo
        else this.frameY = 0; // Parado

        // Animação apenas se estiver em movimento
        if (this.vx !== 0 || !this.grounded) {
            this.frameTimer += deltaTime;
            if (this.frameTimer > 90) { 
                this.frameX = (this.frameX + 1) % 4; 
                this.frameTimer = 0; 
            }
        } else {
            this.frameX = 0; // Congela parado
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        let cellW = this.image.naturalWidth / 4;
        let cellH = this.image.naturalHeight / 4; 
        
        // CORTE LIMPO: Ignora 2px das bordas para não ver o boneco do lado
        let sX = (this.frameX * cellW) + 2;
        let sY = (this.frameY * cellH) + 2;
        let sW = cellW - 4;
        let sH = cellH - 4;
        
        let drawW = 100; let drawH = 100;
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        
        // Ajuste exato para pisar na madeira (540px)
        let ajusteDosPes = 26; 
        let drawY = this.y - (drawH - this.height) + ajusteDosPes;

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY); ctx.scale(-1, 1);
            ctx.drawImage(this.image, sX, sY, sW, sH, -drawW/2, 0, drawW, drawH);
        } else {
            ctx.drawImage(this.image, sX, sY, sW, sH, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }
}
