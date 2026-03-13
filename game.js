const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const timerDisplay = document.getElementById('timerDisplay');

// Carregamento Seguro
const assets = {
    bg: new Image(), chao: new Image(), arm: new Image(), 
    esc: new Image(), and: new Image(), doc: new Image()
};
assets.bg.src = 'assets/sprites/fundo.png';
assets.chao.src = 'assets/sprites/chao.png';
assets.arm.src = 'assets/sprites/armario.png';
assets.esc.src = 'assets/sprites/escada.png';
assets.and.src = 'assets/sprites/andaime.png';
assets.doc.src = 'assets/sprites/documento.png';

let player = new Player(100, 400);
let cameraX = 0; let score = 0; let health = 3; let gameState = 'START';
let timeLeft = 190; let lastTime = 0;
const keys = { left: false, right: false, up: false };

window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') keys.up = true;
    if (e.code === 'Enter' && gameState !== 'PLAYING') resetGame();
});
window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.up = false;
});

function resetGame() {
    player = new Player(100, 400);
    score = 0; health = 3; timeLeft = 190; gameState = 'PLAYING';
    scoreDisplay.innerText = `Documentos: ${score}`;
    healthDisplay.innerText = `Vidas: ${health}`;
    levelData.items.forEach(i => i.collected = false);
    enemiesList.forEach(e => { e.x = e.startX; e.y = e.startY; e.vx = Math.abs(e.vx); });
}

function resolveCollisions() {
    player.grounded = false;
    levelData.platforms.forEach(plat => {
        if (player.x < plat.x + plat.width && player.x + player.width > plat.x &&
            player.y < plat.y + plat.height && player.y + player.height > plat.y) {
            
            let overlapX = Math.min(player.x + player.width - plat.x, plat.x + plat.width - player.x);
            let overlapY = Math.min(player.y + player.height - plat.y, plat.y + plat.height - player.y);

            if (overlapX < overlapY) { // Colisão Lateral
                if (player.x + player.width/2 < plat.x + plat.width/2) player.x -= overlapX;
                else player.x += overlapX;
            } else { // Colisão Vertical
                if (player.y + player.height/2 < plat.y + plat.height/2) {
                    player.y -= overlapY; player.vy = 0; player.grounded = true;
                } else {
                    player.y += overlapY; player.vy = 0;
                }
            }
        }
    });
}

function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, 800, 600);

    if (gameState === 'PLAYING') {
        player.update(keys, deltaTime);
        resolveCollisions();
        enemiesList.forEach(e => e.update(deltaTime));
        
        cameraX = Math.max(0, Math.min(player.x - 350, 3200));

        // Desenho Fundo
        if (assets.bg.complete) ctx.drawImage(assets.bg, -(cameraX * 0.2 % 800), 0, 800, 600);

        // Desenho Plataformas
        levelData.platforms.forEach(p => {
            let img = p.type === 'chao' ? assets.chao : p.type === 'armario' ? assets.arm : p.type === 'escada' ? assets.esc : assets.and;
            if (img.complete) {
                if (p.type === 'chao') {
                    for(let i=0; i<p.width; i+=200) ctx.drawImage(img, p.x+i-cameraX, p.y, 200, p.height);
                } else ctx.drawImage(img, p.x-cameraX, p.y, p.width, p.height);
            } else {
                ctx.fillStyle = p.type === 'chao' ? "#5c4033" : "white";
                ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
            }
        });

        levelData.items.forEach(it => {
            if (!it.collected && assets.doc.complete) ctx.drawImage(assets.doc, it.x - cameraX, it.y, it.width, it.height);
        });

        enemiesList.forEach(e => e.draw(ctx, cameraX));
        player.draw(ctx, cameraX);

    } else {
        ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(0,0,800,600);
        ctx.fillStyle = "white"; ctx.font = "30px Courier New"; ctx.textAlign = "center";
        ctx.fillText(gameState === 'START' ? "O ARQUIVISTA" : "FIM DE JOGO", 400, 280);
        ctx.font = "16px Courier New"; ctx.fillText("Pressione ENTER para começar", 400, 330);
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
