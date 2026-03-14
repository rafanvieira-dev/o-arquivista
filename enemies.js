class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x; this.startY = y;
        this.width = 65; this.height = 40; 
        this.x = x; this.y = y; 
        this.vx = 3.5; this.patrolDistance = patrolDistance;
        this.facing = 1;
        this.image = new Image(); 
        this.image.src = 'assets/sprites/rato.png';
        this.frameX = 0; this.frameTimer = 0;
    }

    update(deltaTime) {
        this.x += this.vx;
        if (this.x > this.startX + this.patrolDistance || this.x < this.startX) {
            this.vx *= -1; this.facing = (this.vx > 0) ? 1 : -1;
        }
        this.frameTimer += deltaTime;
        if (this.frameTimer > 60) { 
            this.frameX = (this.frameX + 1) % 4; 
            this.frameTimer = 0; 
        }
    }

    draw(ctx, cameraX) {
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        let sWidth = this.image.width / 4;
        let sHeight = this.image.height / 4;
        let drawW = 100; let drawH = 65; 
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        let drawY = this.y - (drawH - this.height);

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY); ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, -drawW/2, 0, drawW, drawH);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, 0, sWidth, sHeight, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }
}

// OS NOVOS NPCs AMIGÁVEIS (1 FRAME ÚNICO)
class NPC {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        // Mesmas dimensões físicas do player
        this.width = 30;
        this.height = 75; 
        
        // Agora o código sabe que a imagem tem apenas 1 frame!
        this.cols = 1;
        this.rows = 1;
        
        if (type === 'flavio') {
            this.image = assets.flavio;
            this.message = "Excelente trabalho, Arquivista!";
        } else if (type === 'rosale') {
            this.image = assets.rosale;
            this.message = "Obrigada por trazer os arquivos!";
        } else if (type === 'eliezer') {
            this.image = assets.eliezer;
            this.message = "Os registos estão seguros aqui.";
        }
    }

    update(deltaTime) {
        // Estátua absoluta. Como só tem 1 frame, não fazemos update de animação.
    }

    draw(ctx, cameraX) {
        if (!this.image || !this.image.complete || this.image.naturalWidth === 0) return;

        // Pega na largura e altura totais da imagem (já que é só 1 frame)
        let sW = this.image.naturalWidth;
        let sH = this.image.naturalHeight;
        
        // Começa a desenhar desde o ponto 0x0 da imagem original
        let sX = 0;
        let sY = 0;

        // TAMANHO EXATO DE DESENHO DO PLAYER (95x95)
        let drawW = 95; 
        let drawH = 95;
        let drawX = Math.floor(this.x - cameraX - (drawW - this.width) / 2);
        
        // Alinhamento exato para pisarem a madeira ao lado do player
        let drawY = Math.floor(this.y - (drawH - this.height) + 18); 

        // Desenha a imagem inteira no ecrã
        ctx.drawImage(this.image, sX, sY, sW, sH, drawX, drawY, drawW, drawH);

        // Balão de fala centrado sobre eles
        if (drawX > -100 && drawX < 900) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(drawX - 70, drawY - 35, 260, 25);
            ctx.fillStyle = "white";
            ctx.font = "bold 13px Courier New";
            ctx.textAlign = "center";
            ctx.fillText(this.message, drawX + 60, drawY - 18);
        }
    }
}
