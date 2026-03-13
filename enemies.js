class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x;
        this.x = x;
        this.y = y;
        
        // Tamanho do rato no jogo
        this.width = 50;
        this.height = 30;
        
        this.vx = 2; // Velocidade de patrulha
        this.patrolDistance = patrolDistance;
        
        // Direção em que o rato está virado (1 = direita, -1 = esquerda)
        this.facing = 1;

        // --- SISTEMA DE SPRITES ---
        this.image = new Image();
        this.image.src = 'assets/sprites/rato.png'; 
        
        this.frameX = 0; 
        this.frameY = 1; // Linha da animação de correr
        this.maxFrame = 2; // CORREÇÃO: A imagem tem 3 frames na horizontal (0 a 2)
        
        // Controle de tempo da animação do rato
        this.fps = 10; 
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

        // CORREÇÃO: A imagem tem 3 colunas e 4 linhas
        let sWidth = this.image.naturalWidth / 3;  
        let sHeight = this.image.naturalHeight / 4; 

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

// Inicializando os inimigos da fase
const enemiesList = [
    new Enemy(400, 530, 200), // Rato no chão
    new Enemy(900, 530, 150), // Rato no chão
    new Enemy(550, 330, 100)  // Rato na estante 
];
