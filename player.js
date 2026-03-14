class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 30;  this.height = 70; // Caixa de colisão invisível
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
        
        // Controlo da nova folha de sprites
        this.frameX = 0; 
        this.frameY = 0; 
        this.frameTimer = 0;
        this.maxFrame = 7; // A nova imagem tem 8 frames (0 a 7)
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

        // --- NOVA LÓGICA DE ESCOLHA DE FRAMES ---
        if (!this.grounded) {
            // NO AR: Fixa a imagem no exato frame do salto!
            this.frameY = 2; // Linha 3 (índice 2)
            this.frameX = 3; // Coluna 4 (índice 3 - O boneco com o joelho no ar)
        } else if (this.vx !== 0) {
            // A CORRER
            this.frameY = 1; // Linha 2 (índice 1)
            this.maxFrame = 7; 
        } else {
            // PARADO
            this.frameY = 0; // Linha 1 (índice 0)
            this.maxFrame = 7; 
        }

        // --- TEMPORIZADOR DA ANIMAÇÃO ---
        // Só reproduz a animação se estiver no chão (pois no ar o frame é fixo)
        if (this.grounded) {
            this.frameTimer += deltaTime;
            
            // Velocidade da animação: pernas rápidas a correr, respiração lenta quando parado
            let animSpeed = this.vx !== 0 ? 60 : 120; 
            
            if (this.frameTimer > animSpeed) { 
                // Se o frameX estiver preso num número maior (ex: quando aterra), reseta para 0
                if (this.frameX >= this.maxFrame) {
                    this.frameX = 0;
                } else {
                    this.frameX++;
                }
                this.frameTimer = 0; 
            }
        }
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        
        // --- O NOVO CORTE MATEMÁTICO: 8 COLUNAS E 4 LINHAS ---
        let sWidth = this.image.naturalWidth / 8;
        let sHeight = this.image.naturalHeight / 4;
        
        // Tamanho que a imagem vai ocupar no ecrã (ajustado para a nova proporção)
        let drawW = 85; 
        let drawH = 100;
        
        // Centraliza a imagem na horizontal e alinha a SOLA DO SAPATO com a caixa de colisão
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        let drawY = this.y - (drawH - this.height) - 5; // O "-5" é o ajuste milimétrico do sapato

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
