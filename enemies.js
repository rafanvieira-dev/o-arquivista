class Enemy {
    constructor(x, y, patrolDistance, type = 'ground') {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.patrolDistance = patrolDistance;
        this.facing = 1;
        this.type = type;
        this.image = new Image();

        if (this.type === 'ground') {
            this.image.src = 'assets/sprites/rato.png';
            this.numFramesX = 4;
            this.numFramesY = 4;
            this.frameY = 0;
            this.width = 60;
            this.height = 35;
            this.drawW = 85;
            this.drawH = 55;
            this.vx = 2.5;
        } else {
            this.image.src = 'assets/sprites/barata_voadora.png';
            this.numFramesX = 4;
            this.numFramesY = 4;
            this.frameY = 0;
            // A área de colisão fica mais próxima da área visual da barata.
            this.width = 22;
            this.height = 20;
            this.drawW = 34;
            this.drawH = 32;
            this.vx = 0;
        }

        this.frameX = 0;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        const frameScale = Math.min(deltaTime / 16.667, 2.5);
        if (this.type === 'ground') {
            this.x += this.vx * frameScale;
            if (this.x >= this.startX + this.patrolDistance) {
                this.x = this.startX + this.patrolDistance;
                this.vx = -Math.abs(this.vx);
                this.facing = -1;
            } else if (this.x <= this.startX) {
                this.x = this.startX;
                this.vx = Math.abs(this.vx);
                this.facing = 1;
            }
        }

        this.frameTimer += deltaTime;
        const frameDuration = this.type === 'ground' ? 90 : 45;
        if (this.frameTimer >= frameDuration) {
            this.frameTimer %= frameDuration;
            if (this.type === 'ground') {
                this.frameX = (this.frameX + 1) % 4;
            } else {
                this.frameX++;
                if (this.frameX >= 4) {
                    this.frameX = 0;
                    this.frameY = (this.frameY + 1) % 4;
                }
            }
        }
    }

    draw(ctx, cameraX) {
        if (!this.image.complete || this.image.naturalWidth === 0) return;
        const cellWidth = Math.floor(this.image.naturalWidth / this.numFramesX);
        const cellHeight = Math.floor(this.image.naturalHeight / this.numFramesY);
        const trimX = this.type === 'flying' ? Math.floor(cellWidth * 0.03) : 0;
        const trimY = this.type === 'flying' ? Math.floor(cellHeight * 0.03) : 0;
        const sX = Math.floor(this.frameX * cellWidth + trimX);
        const sY = Math.floor(this.frameY * cellHeight + trimY);
        const sW = Math.floor(cellWidth - trimX * 2);
        const sH = Math.floor(cellHeight - trimY * 2);
        const drawX = this.x - cameraX - (this.drawW - this.width) / 2;
        const drawY = this.y - (this.drawH - this.height);

        ctx.save();
        if (this.facing === -1) {
            ctx.translate(drawX + this.drawW / 2, drawY);
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, sX, sY, sW, sH, -this.drawW / 2, 0, this.drawW, this.drawH);
        } else {
            ctx.drawImage(this.image, sX, sY, sW, sH, drawX, drawY, this.drawW, this.drawH);
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
        if (type === 'flavio') { this.image = assets.flavio; this.message = "Excelente trabalho, Arquivista!"; }
        else if (type === 'rosale') { this.image = assets.rosale; this.message = "Obrigada por trazer os arquivos!"; }
        else if (type === 'eliezer') { this.image = assets.eliezer; this.message = "Os registos estão seguros aqui."; }
        else if (type === 'igorgak') { this.image = assets.igorgak; this.message = "Ótima catalogação de documentos!"; }
    }

    update(deltaTime) {}

    draw(ctx, cameraX) {
        if (!this.image || !this.image.complete || this.image.naturalWidth === 0) return;
        const sW = this.image.naturalWidth;
        const sH = this.image.naturalHeight;
        const drawH = 145;
        const drawW = Math.floor(drawH * (sW / sH));
        const drawX = Math.floor(this.x - cameraX - (drawW - this.width) / 2);
        const drawY = Math.floor((this.y + this.height) + 18 - drawH);
        ctx.drawImage(this.image, 0, 0, sW, sH, drawX, drawY, drawW, drawH);

        if (drawX > -100 && drawX < 900) {
            const bubbleW = 280;
            const bubbleH = 30;
            const bubbleX = drawX + drawW / 2 - bubbleW / 2;
            const bubbleY = drawY - bubbleH - 25;
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(drawX + drawW / 2 - 8, bubbleY + bubbleH);
            ctx.lineTo(drawX + drawW / 2 + 8, bubbleY + bubbleH);
            ctx.lineTo(drawX + drawW / 2, bubbleY + bubbleH + 12);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.beginPath();
            ctx.moveTo(drawX + drawW / 2 - 7, bubbleY + bubbleH - 1);
            ctx.lineTo(drawX + drawW / 2 + 7, bubbleY + bubbleH - 1);
            ctx.lineTo(drawX + drawW / 2, bubbleY + bubbleH + 11);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#000";
            ctx.font = "bold 13px Courier New";
            ctx.textAlign = "center";
            ctx.fillText(this.message, drawX + drawW / 2, bubbleY + 20);
        }
    }
}
