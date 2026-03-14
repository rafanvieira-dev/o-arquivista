const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const timerDisplay = document.getElementById('timerDisplay');

const assets = { bg: new Image(), arm: new Image(), doc: new Image() };
assets.bg.src = 'assets/sprites/fundo.png'; 
assets.arm.src = 'assets/sprites/armario.png';
assets.doc.src = 'assets/sprites/documento.png';

let player = new Player(100, 300);
let cameraX = 0; let score = 0; let health = 3; let gameState = 'START';
let timeLeft = 190; let timerAccumulator = 0; let lastTime = 0;

let keys = { left: false, right: false, up: false };
let jumpJustPressed = false; 

window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') {
        if (!keys.up) jumpJustPressed = true; 
        keys.up = true;
    }
    if (e.code === 'Enter' && gameState !== 'PLAYING') resetGame();
});
window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.up = false;
});

function resetGame() {
    player = new Player(100, 300);
    score = 0; health = 3; timeLeft = 190; gameState = 'PLAYING';
    scoreDisplay.innerText = `Documentos: ${score}`;
    healthDisplay.innerText = `Vidas: ${health}`;
    levelData.items.forEach(i => i.collected = false);
    enemiesList.forEach(e => { e.x = e.startX; e.y = e.startY; e.vx = Math.abs(e.vx); });
}

function isColliding(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function applyPhysics() {
    player.x += player.vx;
    for (let plat of levelData.platforms) {
        if (isColliding(player, plat)) {
            if (player.vx > 0) player.x = plat.x - player.width;
            else if (player.vx < 0) player.x = plat.x + plat.width;
        }
    }

    player.y += player.vy;
    player.grounded = false;
    for (let plat of levelData.platforms) {
        if (isColliding(player, plat)) {
            if (player.vy > 0) { 
                player.y = plat.y - player.height;
                player.vy = 0;
                player.grounded = true;
            } else if (player.vy < 0) { 
                player.y = plat.y + plat.height;
                player.vy = 0;
            }
        }
    }
}

function gameLoop(timeStamp) {
    if (!lastTime) lastTime = timeStamp; 
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, 800, 600);

    if (gameState === 'PLAYING') {
        timerAccumulator += deltaTime;
        if (timerAccumulator >= 1000) { timeLeft--; timerDisplay.innerText = `Tempo: ${timeLeft}`; timerAccumulator = 0; }
        if (timeLeft <= 0) gameState = 'GAMEOVER';

        player.update(keys, deltaTime, jumpJustPressed);
        jumpJustPressed = false; 

        applyPhysics(); 
        enemiesList.forEach(e => e.update(deltaTime));
        checkGameplay();

        cameraX = Math.max(0, Math.min(player.x - 400, 4200));

        if (assets.bg.complete) {
            let ratio = 600 / assets.bg.naturalHeight;
            let bgWidth = assets.bg.naturalWidth * ratio;
            for(let i = 0; i < 5000; i += bgWidth) { 
                ctx.drawImage(assets.bg, i - cameraX, 0, bgWidth, 600);
            }
        }

        levelData.platforms.forEach(p => {
            if (p.type === 'chao_invisivel') return; 
            if (assets.arm.complete) {
                // Afunda o armário no chão para não haver folga
                ctx.drawImage(assets.arm, p.x - cameraX, p.y, p.width, p.height + 20);
            }
        });

        let animTime = Date.now();
        let floatY = Math.sin(animTime / 200) * 5; 
        levelData.items.forEach(it => {
            if (!it.collected) {
                ctx.save();
                ctx.globalAlpha = 0.5 + Math.abs(Math.sin(animTime / 150)) * 0.5; 
                if (assets.doc.complete) ctx.drawImage(assets.doc, it.x - cameraX, it.y + floatY, it.width, it.height);
                ctx.restore();
            }
        });

        enemiesList.forEach(e => e.draw(ctx, cameraX));
        player.draw(ctx, cameraX);

    } else {
        ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(0,0,800,600);
        ctx.fillStyle = "white"; ctx.font = "30px Courier New"; ctx.textAlign = "center";
        ctx.fillText(gameState === 'START' ? "O ARQUIVISTA" : (gameState === 'WIN' ? "ARQUIVO SALVO!" : "FIM DE JOGO"), 400, 300);
        ctx.font = "16px Courier New"; ctx.fillText("Pressione ENTER para jogar", 400, 340);
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
                enemy.y = 9999; player.vy = -14; score += 5;
            } else if (!player.invincible) {
                health--; healthDisplay.innerText = `Vidas: ${health}`;
                player.invincible = true;
                setTimeout(() => player.invincible = false, 1500);
                if (health <= 0) gameState = 'GAMEOVER';
            }
        }
    });
}

requestAnimationFrame(gameLoop);
