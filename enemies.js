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

// OS NOVOS NPCs AMIGÁVEIS E DO TAMANHO DO PLAYER
class NPC {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        // Mesmas dimensões físicas do player
        this.width = 30;
        this.height = 75; 
        
        // O FREEZE ABSOLUTO: Fixados no frame 1 (o frame 0 costuma estar cortado nas bordas)
        this.frameX = 1; 
        
        if (type === 'flavio') {
            this.cols = 6; this.rows = 2; this.animRow = 0;
            this.image = assets.flavio;
            this.message = "Excelente trabalho, Arquivista!";
        } else if (type === 'rosale') {
            this.cols = 4; this.rows = 4; this.animRow = 0; // Assumindo grelha 4x4
            this.image = assets.rosale;
            this.message = "Obrigada por trazer os arquivos!";
        } else if (type === 'eliezer') {
            this.cols = 4; this.rows = 4; this.animRow = 0; // Assumindo grelha 4x4
            this.image = assets.eliezer;
            this.message = "Os registos estão seguros aqui.";
        }
    }

    update(deltaTime) {
        // Estátua absoluta. Sem respiração, sem mudar de frame.
    }

    draw(ctx, cameraX) {
        if (!this.image || !this.image.complete || this.image.naturalWidth === 0) return;

        let cellW = Math.floor(this.image.naturalWidth / this.cols);
        let cellH = Math.floor(this.image.naturalHeight / this.rows);
        
        // CORTE SUAVE: Apenas 10% para não lhes arrancar braços!
        let trimX = Math.floor(cellW * 0.10); 
        let trimY = Math.floor(cellH * 0.05); 
        
        let sX = Math.floor((this.frameX * cellW) + trimX);
        let sY = Math.floor((this.animRow * cellH) + trimY);
        let sW = Math.floor(cellW - (trimX * 2));
        let sH = Math.floor(cellH - (trimY * 2));

        // TAMANHO EXATO DE DESENHO DO PLAYER (95x95)
        let drawW = 95; 
        let drawH = 95;
        let drawX = Math.floor(this.x - cameraX - (drawW - this.width) / 2);
        
        // Alinhamento exato para pisarem a madeira ao lado do player
        let drawY = Math.floor(this.y - (drawH - this.height) + 18); 

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
