class Enemy {
    constructor(x, y, patrolDistance, type = 'ground') {
        this.startX = x; this.startY = y;
        this.width = 65; this.height = 40; 
        this.x = x; this.y = y; 
        this.vx = 3.5; this.patrolDistance = patrolDistance;
        this.facing = 1;
        this.type = type; 

        this.image = new Image(); 
        
        if (this.type === 'ground') {
            this.image.src = 'assets/sprites/rato.png';
            this.numFramesX = 4; 
            this.numFramesY = 1; 
            this.frameY = 0; 
        } else if (this.type === 'flying') {
            this.image.src = 'assets/sprites/barata_voadora.png'; 
            this.numFramesX = 4; 
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
        
        this.frameTimer += deltaTime;
        if (this.type === 'ground') {
            if (this.frameTimer > 60) { 
                this.frameX = (this.frameX + 1) % 4; 
                this.frameTimer = 0; 
            }
        } else if (this.type === 'flying') {
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

        let sWidth = this.image.naturalWidth / this.numFramesX;
        let sHeight = this.image.naturalHeight / this.numFramesY;
        
        let drawW = 100; let drawH = 65; 
        let drawX = this.x - cameraX - (drawW - this.width) / 2;
        let drawY = this.y - (drawH - this.height);

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + drawW / 2, drawY); ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, -drawW/2, 0, drawW, drawH);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, drawX, drawY, drawW, drawH);
        }
        ctx.restore();
    }
}

class NPC {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        this.width = 30;
        this.height = 75; 
        
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
        } else if (type === 'igorgak') {
            this.image = assets.igorgak;
            this.message = "Ótima catalogação de documentos!";
        }
    }

    update(deltaTime) {}

    draw(ctx, cameraX) {
        if (!this.image || !this.image.complete || this.image.naturalWidth === 0) return;

        let sW = this.image.naturalWidth;
        let sH = this.image.naturalHeight;
        let sX = 0; let sY = 0;

        let drawH = 145; 
        let drawW = Math.floor(drawH * (sW / sH)); 
        
        let drawX = Math.floor(this.x - cameraX - (drawW - this.width) / 2);
        let drawY = Math.floor((this.y + this.height) + 18 - drawH); 

        ctx.drawImage(this.image, sX, sY, sW, sH, drawX, drawY, drawW, drawH);

        if (drawX > -100 && drawX < 900) {
            let bubbleW = 280;
            let bubbleH = 30;
            let bubbleX = drawX + (drawW / 2) - (bubbleW / 2);
            let bubbleY = drawY - bubbleH - 25;

            ctx.fillStyle = "rgba(255, 255, 255, 0.95)"; 
            ctx.strokeStyle = "#000"; 
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8); 
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(drawX + (drawW / 2) - 8, bubbleY + bubbleH);
            ctx.lineTo(drawX + (drawW / 2) + 8, bubbleY + bubbleH);
            ctx.lineTo(drawX + (drawW / 2), bubbleY + bubbleH + 12);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.beginPath();
            ctx.moveTo(drawX + (drawW / 2) - 7, bubbleY + bubbleH - 1);
            ctx.lineTo(drawX + (drawW / 2) + 7, bubbleY + bubbleH - 1);
            ctx.lineTo(drawX + (drawW / 2), bubbleY + bubbleH + 11);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#000";
            ctx.font = "bold 13px Courier New";
            ctx.textAlign = "center";
            ctx.fillText(this.message, drawX + (drawW / 2), bubbleY + 20);
        }
    }
}
