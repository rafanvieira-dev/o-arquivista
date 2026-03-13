class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Tamanho do personagem no jogo (pode ajustar se quiser maior ou menor)
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
        
        // Direção em que está virado (1 = direita, -1 = esquerda)
        this.facing = 1; 

        // --- SISTEMA DE SPRITES ---
        this.image = new Image();
        this.image.src = 'assets/sprites/arquivista.png'; // Caminho da imagem
        
        // Tamanho de cada corte na imagem original gerada (4 colunas e 3 linhas)
        this.spriteWidth = 256; 
        this.spriteHeight = 341; 
        
        this.frameX = 0; // Coluna atual
        this.frameY = 0; // Linha atual (0=Parado, 1=Correndo, 2=Pulando)
        this.maxFrame = 3; // O limite máximo varia por animação
        
        // Controle de tempo da animação
        this.fps = 8; // Velocidade da animação (frames por segundo)
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    update(keys, deltaTime) {
        // Movimento horizontal
        let currentSpeed = keys.shift ? this.runSpeed : this.speed;
        
        if (keys.left) {
            this.vx = -currentSpeed;
            this.facing = -1; // Vira para a esquerda
        } else if (keys.right) {
            this.vx = currentSpeed;
            this.facing = 1;  // Vira para a direita
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

        // Resetar o chão para verificação de colisão
        this.grounded = false;

        // --- CONTROLE DE QUAL ANIMAÇÃO TOCAR ---
        if (!this.grounded && this.vy !== 0) {
            // Pulando (Linha de baixo da imagem)
            this.frameY = 2; 
            this.maxFrame = 3;
        } else if (this.vx !== 0) {
            // Correndo (Linha do meio)
            this.frameY = 1; 
            this.maxFrame = 3;
        } else {
            // Parado (Linha de cima)
            this.frameY = 0; 
            this.maxFrame = 2; // O parado tem menos frames dinâmicos
        }

        // --- AVANÇAR OS FRAMES DA ANIMAÇÃO ---
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
        let cropX = this.frameX * this.spriteWidth;
        let cropY = this.frameY * this.spriteHeight;

        ctx.save();

        if (this.facing === -1) {
            // Vira o personagem para a esquerda
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image, 
                cropX, cropY, this.spriteWidth, this.spriteHeight, 
                -(this.x - cameraX + this.width), this.y, this.width, this.height
            );
        } else {
            // Personagem virado para a direita normal
            ctx.drawImage(
                this.image, 
                cropX, cropY, this.spriteWidth, this.spriteHeight, 
                this.x - cameraX, this.y, this.width, this.height
            );
        }

        ctx.restore();
    }
}
