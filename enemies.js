class Enemy {
    constructor(x, y, patrolDistance) {
        this.startX = x;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 20;
        this.vx = 2; // Velocidade de patrulha
        this.patrolDistance = patrolDistance;
        this.color = '#e74c3c'; // Vermelho (Ratos/Perigo)
    }

    update() {
        this.x += this.vx;
        // Inverte direção se atingir o limite da patrulha
        if (this.x > this.startX + this.patrolDistance || this.x < this.startX) {
            this.vx *= -1;
        }
    }

    draw(ctx, cameraX) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }
}

// Inicializando inimigos da fase
const enemiesList = [
    new Enemy(400, 530, 200), // Rato no chão
    new Enemy(900, 530, 150), // Rato no chão
    new Enemy(550, 330, 100)  // Poeira na estante
];
