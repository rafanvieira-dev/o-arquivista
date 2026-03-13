class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x;
        this.x = x;
        this.y = y;
        
        // Tamanho ajustado para ficar proporcional e "legal" no jogo
        this.width = 70;
        this.height = 70;
        
        this.vx = 2; // Velocidade de patrulha
        this.patrolDistance = patrolDistance;
        
        // Direção em que o rato está virado (1 = direita, -1 = esquerda)
        this.facing = 1;

        // --- SISTEMA DE SPRITES ---
        this.image = new Image();
        this.image.src = 'assets/sprites/rato.png'; 
        
        this.frameX = 0; 
        this.frameY = 0; // Todas as linhas desta imagem são de movimento, usamos a primeira
        this.maxFrame = 3; // A nova imagem tem 4 colunas perfeitamente alinhadas (0 a 3)
        
        // Controle de tempo da animação (aumentei um pouco para ele correr mais frenético)
        this.fps = 15; 
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        this.x += this.vx;
        
        // Inverte a direção se atingir o limite da patrulha
        if (this.x > this.startX + this.patrolDistance) {
            this.vx *= -1;
            this.facing = -1; // Vira o rato para a esquerda
        } else if (this.x < this.startX) {
            this.vx *= -1;
            this.facing = 1;  // Vira o rato para a direita
        }

        // --- AVANÇAR OS FRAMES DA ANIMAÇÃO ---
        let time = deltaTime || 16; 
        
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            this.frameTimer = 0;
        } else {
            this.frameTimer += time;
        }
    }

    draw(ctx, cameraX) {
        if (!this.image.complete || this.image.naturalWidth === 0) {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
            return;
        }

        // CÁLCULO PERFEITO: Voltamos à divisão exata por 4 colunas e 4 linhas
        let sWidth = this.image.naturalWidth / 4;  
        let sHeight = this.image.naturalHeight / 4; 

        let cropX = this.frameX * sWidth;
        let cropY = this.frameY * sHeight;

        ctx.save();

        if (this.facing === -1) {
            // Vira o rato para a esquerda
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image, 
                cropX, cropY, sWidth, sHeight, 
                -(this.x - cameraX + this.width), this.y, this.width, this.height
            );
        } else {
            // Desenha o rato normalmente (virado para a direita)
            ctx.drawImage(
                this.image, 
                cropX, cropY, sWidth, sHeight, 
                this.x - cameraX, this.y, this.width, this.height
            );
        }

        ctx.restore();
    }
}

// Inicializando os inimigos da fase
const enemiesList = [
    new Enemy(400, 530, 200), // Rato no chão
    new Enemy(900, 530, 150), // Rato no chão
    new Enemy(550, 330, 100)  // Rato na estante 
];
