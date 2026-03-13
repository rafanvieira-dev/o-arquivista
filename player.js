class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 50;
        this.vx = 0;
        this.vy = 0;
        this.speed = 4;
        this.runSpeed = 7;
        this.jumpForce = -12;
        this.gravity = 0.6;
        this.grounded = false;
        this.color = '#3498db'; // Azul (Roupa do arquivista)
    }

    update(keys) {
        // Movimento horizontal
        let currentSpeed = keys.shift ? this.runSpeed : this.speed;
        
        if (keys.left) {
            this.vx = -currentSpeed;
        } else if (keys.right) {
            this.vx = currentSpeed;
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

        // Reseta grounded para checar colisões no game.js
        this.grounded = false;
    }

    draw(ctx, cameraX) {
        ctx.fillStyle = this.color;
        // Desenha o jogador ajustado pela câmera (scroll lateral)
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        
        // Detalhe: Óculos do arquivista
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - cameraX + (this.vx >= 0 ? 15 : 5), this.y + 10, 10, 5);
    }
}
