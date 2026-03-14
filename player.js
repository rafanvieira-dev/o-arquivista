class Player {
    constructor(x, y) {
        this.x = x; 
        this.y = y;
        
        // Caixa de física
        this.width = 32;  
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
        this.image.src = 'assets/sprites/arquivista.png'; 
        
        this.frameX = 1; 
        this.frameY = 0; 
        this.frameTimer = 0;
        this.maxFrame = 6; 
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

        // --- SISTEMA DE ANIMAÇÃO ---
        if (!this.grounded) {
            // PULAR (Linha 3)
            this.frameY = 2; 
            if (this.vy < -5) this.frameX = 2;
            else if (this.vy > 5) this.frameX = 4;
            else this.frameX = 3;
        } 
        else if (this.vx !== 0) {
            // A CORRER (Linha 2)
            this.frameY = 1; 
            this.maxFrame = 6; 
            
            this.frameTimer += deltaTime;
            if (this.frameTimer > 60) { 
                this.frameX = (this.frameX >= this.maxFrame) ? 0 : this.frameX + 1;
                this.frameTimer = 0; 
            }
        } 
        else {
            // PARADO (Linha 1)
            this.frameY = 0; 
            this.frameX = 1; // Fixo no segundo frame
            this.frameTimer = 0; 
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        // A matemática da grelha: 7 colunas e espaço para 6 linhas (apesar de só usar 4)
        let cellW = this.image.naturalWidth / 7;
        let cellH = this.image.naturalHeight / 6; 
        
        // REMOVIDO QUALQUER CORTE! Vamos pegar o quadro exato da imagem.
        let sX = this.frameX * cellW;
        let sY = this.frameY * cellH;
        let sW = cellW;
        let sH = cellH;
        
        // O TAMANHO QUE ELE APARECE NO ECRÃ (Maior e proporcional)
        let drawW = 110; 
        let drawH = 110;
        
        // Posicionamento Horizontal (Centrado com a caixa invisível)
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        
        // --- O SEGREDO DOS PÉS ---
        // Como não estamos a cortar a imagem, o espaço vazio por baixo dele vai fazê-lo flutuar.
        // Use este número para o "empurrar" para baixo.
        // Se ele flutuar, AUMENTE este número. Se ele enterrar os pés no chão, DIMINUA este número.
        let ajusteDosPes = 18; 
        
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
