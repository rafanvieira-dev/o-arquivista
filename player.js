class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 30;  this.height = 70; // Física invisível
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

        // --- LÓGICA DE ANIMAÇÃO CORRIGIDA ---
        if (!this.grounded) {
            // NO AR: Congela no frame de salto (joelho levantado)
            this.frameY = 2; 
            this.frameX = 3; 
        } 
        else if (this.vx !== 0) {
            // A CORRER: Faz o ciclo de animação das pernas
            this.frameY = 1; 
            this.maxFrame = 7; 
            
            this.frameTimer += deltaTime;
            if (this.frameTimer > 60) { // Velocidade da perna (60ms)
                if (this.frameX >= this.maxFrame) {
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
                this.frameTimer = 0; 
            }
        } 
        else {
            // PARADO: Congela TOTALMENTE no primeiro frame
            this.frameY = 0; 
            this.frameX = 0; // Fica fixo no primeiro boneco da folha
            this.frameTimer = 0; // O tempo não passa para a animação
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        let sWidth = this.image.naturalWidth / 8;
        let sHeight = this.image.naturalHeight / 4;
        
        let drawW = 85; 
        let drawH = 100;
        
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        let drawY = this.y - (drawH - this.height) - 5; 

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, -drawW / 2, 0, drawW, drawH);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }
}
