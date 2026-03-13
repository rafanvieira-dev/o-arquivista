class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Tamanho do personagem no jogo
        this.width = 64;  
        this.height = 85; 
        
        // Físicas
        this.vx = 0;
        this.vy = 0;
        this.speed = 4;
        this.runSpeed = 7;
        this.jumpForce = -12;
        this.gravity = 0.6;
        this.grounded = false;
        
        // Direção (1 = direita, -1 = esquerda)
        this.facing = 1; 

        // --- SISTEMA DE SPRITES ---
        this.image = new Image();
        this.image.src = 'assets/sprites/arquivista.png'; 
        
        this.frameX = 0; 
        this.frameY = 0; 
        this.maxFrame = 3; 
        
        // Controle de tempo da animação
        this.fps = 8; 
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    update(keys, deltaTime) {
        // Movimento horizontal
        let currentSpeed = keys.shift ? this.runSpeed : this.speed;
        
        if (keys.left) {
            this.vx = -currentSpeed;
            this.facing = -1;
        } else if (keys.right) {
            this.vx = currentSpeed;
            this.facing = 1; 
        } else {
            this.vx = 0;
        }

        // Pulo
        if (keys.up && this.grounded) {
            this.vy = this.jumpForce;
            this.grounded = false;
        }

        // Aplica física
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        this.grounded = false;

        // --- CONTROLE DE ANIMAÇÃO ---
        if (!this.grounded && this.vy !== 0) {
            this.frameY = 2; // Pulando
            this.maxFrame = 3;
        } else if (this.vx !== 0) {
            this.frameY = 1; // Correndo
            this.maxFrame = 3;
        } else {
            this.frameY = 0; // Parado
            this.maxFrame = 2; 
        }

        // --- AVANÇAR OS FRAMES ---
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(ctx, cameraX) {
        // PREVENÇÃO DE ERRO: Só tenta desenhar se a imagem já tiver carregado no navegador
        if (this.image.width === 0) return;

        // CÁLCULO DINÂMICO: Divide a imagem total pelo número de linhas e colunas
        let sWidth = this.image.width / 4;  // 4 bonecos de largura
        let sHeight = this.image.height / 3; // 3 bonecos de altura

        // Corta na posição exata baseada no tamanho calculado
        let cropX = this.frameX * sWidth;
        let cropY = this.frameY * sHeight;

        ctx.save();

        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image, 
                cropX, cropY, sWidth, sHeight, 
                -(this.x - cameraX + this.width), this.y, this.width, this.height
            );
        } else {
            ctx.drawImage(
                this.image, 
                cropX, cropY, sWidth, sHeight, 
                this.x - cameraX, this.y, this.width, this.height
            );
        }

        ctx.restore();
    }
}
