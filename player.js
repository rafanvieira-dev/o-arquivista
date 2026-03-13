class Player {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.width = 36;   // Colisão estreita para não prender em quinas
        this.height = 76;  
        this.vx = 0; this.vy = 0;
        this.speed = 5; this.jumpForce = -17; this.gravity = 0.9;
        this.grounded = false; this.facing = 1; this.invincible = false;

        this.image = new Image();
        this.image.src = 'assets/sprites/arquivista.png';
        this.frameX = 0; this.frameY = 0;
        this.frameTimer = 0; this.frameInterval = 100;
    }

    update(keys, deltaTime) {
        if (keys.left) { this.vx = -this.speed; this.facing = -1; }
        else if (keys.right) { this.vx = this.speed; this.facing = 1; }
        else { this.vx = 0; }

        if (keys.up && this.grounded) { this.vy = this.jumpForce; this.grounded = false; }

        this.vy += this.gravity;
    }

    draw(ctx, cameraX) {
        if (this.invincible && Math.floor(Date.now() / 100) % 2) return;
        let sWidth = this.image.width / 4;
        let sHeight = this.image.height / 3;
        ctx.save();
        
        // COMPENSAÇÃO DE FLUTUAÇÃO: O drawY foi ajustado para os pés tocarem a hitbox
        let drawX = this.x - cameraX - 17;
        let drawY = this.y - 14; 
        
        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, -(drawX + 70), drawY, 70, 90);
        } else {
            ctx.drawImage(this.image, this.frameX * sWidth, this.frameY * sHeight, sWidth, sHeight, drawX, drawY, 70, 90);
        }
        ctx.restore();
    }
}
