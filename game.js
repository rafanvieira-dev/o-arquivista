const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const timerDisplay = document.getElementById('timerDisplay');

// Carregamento de Imagens
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
let timeLeft = 190; let timerAccumulator = 0; let lastTime = 0;
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

// LÓGICA DE FÍSICA SEPARADA (X e Y)
function movePlayer() {
    // Primeiro movemos no X e checamos paredes
    player.x += player.vx;
    levelData.platforms.forEach(plat => {
        if (isColliding(player, plat)) {
            if (player.vx > 0) player.x = plat.x - player.width;
            if (player.vx < 0) player.x = plat.x + plat.width;
        }
    });

    // Depois movemos no Y e checamos chão/teto
    player.y += player.vy;
    player.grounded = false;
    levelData.platforms.forEach(plat => {
        if (isColliding(player, plat)) {
            if (player.vy > 0) { // Caindo
                player.y = plat.y - player.height;
                player.vy = 0;
                player.grounded = true;
            } else if (player.vy < 0) { // Subindo (bateu no teto)
                player.y = plat.y + plat.height;
                player.vy = 0;
            }
        }
    });
}

function isColliding(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
}

function gameLoop(timeStamp) {
    if (!lastTime) lastTime = timeStamp; // Garante que os inimigos se movam desde o frame 1
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (gameState === 'PLAYING') {
        timerAccumulator += deltaTime;
        if (timerAccumulator >= 1000) { timeLeft--; timerDisplay.innerText = `Tempo: ${timeLeft}`; timerAccumulator = 0; }
        if (timeLeft <= 0) gameState = 'GAMEOVER';

        player.update(keys, deltaTime);
        movePlayer();
        enemiesList.forEach(e => e.update(deltaTime));
        checkGameplay();

        cameraX = Math.max(0, Math.min(player.x - 350, 3200));

        // Desenhar
        ctx.clearRect(0, 0, 800, 600);
        if (assets.bg.complete) ctx.drawImage(assets.bg, -(cameraX * 0.2 % 800), 0, 800, 600);

        levelData.platforms.forEach(p => {
            let img = p.type === 'chao' ? assets.chao : p.type === 'armario' ? assets.arm : p.type === 'escada' ? assets.esc : assets.and;
            if (img.complete) {
                if (p.type === 'chao') {
                    for(let i=0; i<p.width; i+=200) ctx.drawImage(img, p.x+i-cameraX, p.y, 200, p.height);
                } else ctx.drawImage(img, p.x-cameraX, p.y, p.width, p.height);
            } else {
                ctx.fillStyle = p.type === 'chao' ? "#443322" : "#999";
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
        ctx.fillText(gameState === 'START' ? "O ARQUIVISTA" : "FIM DE JOGO", 400, 300);
        ctx.font = "16px Courier New"; ctx.fillText("Pressione ENTER para começar", 400, 330);
    }
    requestAnimationFrame(gameLoop);
}

function checkGameplay() {
    levelData.items.forEach(item => {
        if (!item.collected && isColliding(player, item)) {
            item.collected = true; score += 10; scoreDisplay.innerText = `Documentos: ${score}`;
        }
    });

    enemiesList.forEach(enemy => {
        if (enemy.y < 9000 && isColliding(player, enemy)) {
            if (player.vy > 0 && player.y + player.height - player.vy <= enemy.y + 20) {
                enemy.y = 9999; player.vy = -12; score += 5;
            } else if (!player.invincible) {
                health--; healthDisplay.innerText = `Vidas: ${health}`;
                player.invincible = true;
                setTimeout(() => player.invincible = false, 1500);
                if (health <= 0) gameState = 'GAMEOVER';
            }
        }
    });
    if (player.y > 600) { health = 0; gameState = 'GAMEOVER'; }
}

requestAnimationFrame(gameLoop);
