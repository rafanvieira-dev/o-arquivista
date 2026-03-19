class Enemy {
    // Adicionado o parâmetro 'type' para diferenciar inimigos terrestres e voadores
    constructor(x, y, patrolDistance, type = 'ground') {
        this.startX = x; this.startY = y;
        this.width = 65; this.height = 40; 
        this.x = x; this.y = y; 
        this.vx = 3.5; this.patrolDistance = patrolDistance;
        this.facing = 1;
        this.type = type; // 'ground' ou 'flying'

        this.image = new Image(); 
        
        // Define a imagem e a quantidade de frames de acordo com o tipo
        if (this.type === 'ground') {
            this.image.src = 'assets/sprites/rato.png';
            this.numFramesX = 4; // Rato: 4 frames em uma linha
            this.numFramesY = 1; 
            this.frameY = 0; 
        } else if (this.type === 'flying') {
            this.image.src = 'assets/sprites/barata_voadora.png'; // Caminho para a nova sprite sheet 4x4
            this.numFramesX = 4; // Barata: 4 frames por linha e 4 colunas
            this.numFramesY = 4;
            this.frameY = 0; 
        }

        this.frameX = 0; 
        this.frameTimer = 0;
    }

    update(deltaTime) {
        this.x += this.vx;
        if (this.x > this.startX + this.patrolDistance || this.x < this.startX) {
            this.vx *= -1; this.facing = (this.vx > 0) ? 1 : -1;
        }
        
        // Animação de acordo com o tipo
        this.frameTimer += deltaTime;
        if (this.type === 'ground') {
            // Ciclo simples em uma linha (0, 1, 2, 3)
            if (this.frameTimer > 60) { 
                this.frameX = (this.frameX + 1) % 4; 
                this.frameTimer = 0; 
            }
        } else if (this.type === 'flying') {
            // Ciclo por todos os 16 frames da sprite sheet 4x4
            if (this.frameTimer > 60) { 
                this.frameX++;
                if (this.frameX >= 4) {
                    this.frameX = 0;
                    this.frameY = (this.frameY + 1) % 4;
                }
                this.frameTimer = 0; 
            }
        }
    }

    draw(ctx, cameraX) {
        if (!this.image.complete || this.image.naturalWidth === 0) return;

        // Calcula o tamanho de cada frame com base no número de frames
        let sWidth = this.image.naturalWidth / this.numFramesX;
        let sHeight = this.image.naturalHeight / this.numFramesY;
        
        let drawW = 100; let drawH = 65; 
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        
        // Ajusta a posição Y de desenho para que o pé/corpo fique alinhado
        let drawY = this.y - (drawH - this.height);

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY); ctx.scale(-1, 1);
            // Desenha usando frameX e frameY
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, -drawW/2, 0, drawW, drawH);
        } else {
            // Desenha usando frameX e frameY
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }
}

// ... (classe NPC permanece inalterada)
