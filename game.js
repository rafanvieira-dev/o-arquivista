const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const timerDisplay = document.getElementById('timerDisplay');

// Assets - Garantindo caminhos corretos
const bgImage = new Image(); bgImage.src = 'assets/sprites/fundo.png';
const armarioImg = new Image(); armarioImg.src = 'assets/sprites/armario.png';
const escadaImg = new Image(); escadaImg.src = 'assets/sprites/escada.png';
const andaimeImg = new Image(); andaimeImg.src = 'assets/sprites/andaime.png';
const docImg = new Image(); docImg.src = 'assets/sprites/documento.png';
const chaoImg = new Image(); chaoImg.src = 'assets/sprites/chao.png';

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

// NOVO SISTEMA DE COLISÃO ROBUSTO (Resolve X e Y separadamente)
function handleCollisions() {
    player.grounded = false;
    levelData.platforms.forEach(plat => {
        if (player.x < plat.x + plat.width && player.x + player.width > plat.x &&
            player.y < plat.y + plat.height && player.y + player.height > plat.y) {
            
            let overlapX = Math.min(player.x + player.width - plat.x, plat.x + plat.width - player.x);
            let overlapY = Math.min(player.y + player.height - plat.y, plat.y + plat.height - player.y);

            if (overlapX < overlapY) {
                if (player.x + player.width/2 < plat.x + plat.width/2) player.x -= overlapX;
                else player.x += overlapX;
                player.vx = 0;
            } else {
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
    let deltaTime = timeStamp - (lastTime || timeStamp);
    lastTime = timeStamp;

    if (gameState === 'PLAYING') {
        timerAccumulator += deltaTime;
        if (timerAccumulator >= 1000) { timeLeft--; timerDisplay.innerText = `Tempo: ${timeLeft}`; timerAccumulator = 0; }
        if (timeLeft <= 0) gameState = 'GAMEOVER';

        player.update(keys, deltaTime);
        handleCollisions();
        
        enemiesList.forEach(e => e.update(deltaTime));
        checkGameplay();

        cameraX = Math.max(0, Math.min(player.x - 350, 3200));

        // DESENHAR
        ctx.clearRect(0, 0, 800, 600);
        
        // Fundo
        ctx.drawImage(bgImage, -(cameraX * 0.2 % 800), 0, 800, 600);
        ctx.drawImage(bgImage, 800 - (cameraX * 0.2 % 800), 0, 800, 600);

        // Chão e Obstáculos
        levelData.platforms.forEach(p => {
            if (p.type === 'chao') {
                if (chaoImg.complete) {
                    for(let i=0; i<p.width; i+=200) ctx.drawImage(chaoImg, p.x+i-cameraX, p.y, 200, p.height);
                } else {
                    ctx.fillStyle = "#34495e"; ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
                }
            } else {
                let img = p.type === 'armario' ? armarioImg : p.type === 'escada' ? escadaImg : p.type === 'andaime' ? andaimeImg : null;
                if (img && img.complete) ctx.drawImage(img, p.x - cameraX, p.y, p.width, p.height);
                else { ctx.fillStyle = "white"; ctx.fillRect(p.x - cameraX, p.y, p.width, p.height); }
            }
        });

        levelData.items.forEach(item => {
            if (!item.collected && docImg.complete) ctx.drawImage(docImg, item.x - cameraX, item.y, item.width, item.height);
        });

        enemiesList.forEach(e => e.draw(ctx, cameraX));
        player.draw(ctx, cameraX);
    } else {
        drawUI();
    }
    requestAnimationFrame(gameLoop);
}

function checkGameplay() {
    levelData.items.forEach(item => {
        if (!item.collected && player.x < item.x + item.width && player.x + player.width > item.x &&
            player.y < item.y + item.height && player.y + player.height > item.y) {
            item.collected = true; score += 10; scoreDisplay.innerText = `Documentos: ${score}`;
        }
    });

    enemiesList.forEach(enemy => {
        if (enemy.y < 9000 && player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
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

function drawUI() {
    ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(0,0,800,600);
    ctx.fillStyle = "white"; ctx.font = "40px Courier New"; ctx.textAlign = "center";
    ctx.fillText(gameState === 'START' ? "O ARQUIVISTA" : "FIM DE JOGO", 400, 300);
}

requestAnimationFrame(gameLoop);
