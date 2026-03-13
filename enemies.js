class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x;
        this.x = x;
        this.y = y;
        
        // Tamanho do rato no jogo (pode ajustar para ficar maior ou menor)
        this.width = 50;
        this.height = 30;
        
        this.vx = 2; // Velocidade de patrulha
        this.patrolDistance = patrolDistance;
        
        // Direção em que o rato está virado (1 = direita, -1 = esquerda)
        this.facing = 1;

        // --- SISTEMA DE SPRITES ---
        this.image = new Image();
        this.image.src = 'assets/sprites/rato.png'; // A nova imagem que guardou
        
        this.frameX = 0; 
        this.frameY = 1; // Vamos usar a linha 1 da imagem (animação a correr)
        this.maxFrame = 3; // A imagem tem 4 frames horizontais (0, 1, 2, 3)
        
        // Controle de tempo da animação do rato
        this.fps = 10; 
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    // Adicionámos o "deltaTime" aqui para a animação funcionar no tempo certo
    update(deltaTime) {
        this.x += this.vx;
        
        // Inverte direção se atingir o limite da patrulha
        if (this.x > this.startX + this.patrolDistance) {
            this.vx *= -1;
            this.facing = -1; // Vira o rato para a esquerda
        } else if (this.x < this.startX) {
            this.vx *= -1;
            this.facing = 1;  // Vira o rato para a direita
        }

        // --- AVANÇAR OS FRAMES DA ANIMAÇÃO ---
        // Se o deltaTime não for passado, assumimos 16ms como prevenção de erros
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
        // SISTEMA DE SEGURANÇA: Se a imagem não for encontrada, desenha um retângulo vermelho
        if (!this.image.complete || this.image.naturalWidth === 0) {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
            return;
        }

        // Cálculo dinâmico (a imagem que gerei tem 4 colunas e 4 linhas)
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

// Inicializando inimigos da fase
const enemiesList = [
    new Enemy(400, 530, 200), // Rato no chão
    new Enemy(900, 530, 150), // Rato no chão
    new Enemy(550, 330, 100)  // Rato na estante (ex-poeira)
];
