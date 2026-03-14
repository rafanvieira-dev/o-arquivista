const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const timerDisplay = document.getElementById('timerDisplay');

const assets = { bg: new Image(), arm: new Image(), doc: new Image() };
assets.arm.src = 'assets/sprites/armario.png';
assets.doc.src = 'assets/sprites/documento.png';

let player, cameraX, score, health, timer, timerAccumulator, gameState;
let currentLevel = 1;
const MAX_LEVELS = 10;
let levelData = {}; 

let keys = { left: false, right: false, up: false };
let jumpJustPressed = false; let lastTime = 0;

// CONTROLES DE TECLADO
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') { if (!keys.up) jumpJustPressed = true; keys.up = true; }
    
    if (e.code === 'Enter') checkMenuProgression();
});
window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.up = false;
});

// CONTROLES MOBILE (Toque no ecrã)
function checkMenuProgression() {
    if (gameState === 'START' || gameState === 'GAMEOVER') resetGame();
    else if (gameState === 'LEVEL_CLEAR') nextLevel();
    else if (gameState === 'GAME_COMPLETED') resetGame();
}

// Toque na ecrã para iniciar o jogo em vez de Enter
window.addEventListener('touchstart', (e) => {
    if (gameState !== 'PLAYING') checkMenuProgression();
});

// Botões Virtuais
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnJump = document.getElementById('btn-jump');

function setupTouchBtn(btn, key) {
    btn.addEventListener('touchstart', (e) => { 
        e.preventDefault(); // Previne zoom no telemóvel
        if (gameState === 'PLAYING') {
            keys[key] = true; 
            if (key === 'up' && !keys.up) jumpJustPressed = true;
        }
    });
    btn.addEventListener('touchend', (e) => { 
        e.preventDefault(); 
        keys[key] = false; 
    });
}
setupTouchBtn(btnLeft, 'left');
setupTouchBtn(btnRight, 'right');
setupTouchBtn(btnJump, 'up');

// Lógica de Fases
function initLevel(lvl) {
    levelData = generateLevel(lvl);
    
    // CARREGA O FUNDO DINÂMICO
    assets.bg.src = levelData.bgImage; 
    
    player = new Player(100, 300);
    cameraX = 0;
    timer = levelData.timeLimit;
    timerAccumulator = 0;
    gameState = 'PLAYING';
    
    levelDisplay.innerText = `Nível: ${currentLevel}`;
    updateHUD();
}

function resetGame() {
    currentLevel = 1; score = 0; health = 3; initLevel(currentLevel);
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > MAX_LEVELS) gameState = 'GAME_COMPLETED';
    else initLevel(currentLevel);
}

function updateHUD() {
    scoreDisplay.innerText = `Doc: ${score}`;
    timerDisplay.innerText = `⏳ ${timer}`;
    healthDisplay.innerText = `❤️ ${Math.max(0, health)}`;
}

function isColliding(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function applyPhysics() {
    player.x += player.vx;
    if (player.x < 0) player.x = 0; 
    
    levelData.platforms.forEach(p => {
        if (isColliding(player, p)) {
            if (player.vx > 0) player.x = p.x - player.width;
            else if (player.vx < 0) player.x = p.x + p.width;
        }
    });

    player.y += player.vy;
    player.grounded = false;
    levelData.platforms.forEach(p => {
        if (isColliding(player, p)) {
            if (player.vy > 0) { player.y = p.y - player.height; player.vy = 0; player.grounded = true; }
            else if (player.vy < 0) { player.y = p.y + p.height; player.vy = 0; }
        }
    });
}

function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime; lastTime = timeStamp;

    if (gameState === 'PLAYING') {
        timerAccumulator += deltaTime;
        if (timerAccumulator >= 1000) { 
            timer--; updateHUD(); timerAccumulator = 0; 
            if (timer <= 0) gameState = 'GAMEOVER';
        }

        player.update(keys, deltaTime, jumpJustPressed); jumpJustPressed = false;
        applyPhysics();
        levelData.enemies.forEach(e => e.update(deltaTime));
        
        levelData.items.forEach(it => {
            if (!it.collected && isColliding(player, it)) {
                it.collected = true; score += 10; updateHUD();
            }
        });

        levelData.enemies.forEach(enemy => {
            if (isColliding(player, enemy)) {
                if (player.vy > 0 && player.y + player.height - player.vy <= enemy.y + 20) {
                    enemy.y = 9999; player.vy = -14; score += 5; updateHUD();
                } else if (!player.invincible) {
                    health--; updateHUD();
                    player.invincible = true;
                    setTimeout(() => player.invincible = false, 1500); 
                    if (health <= 0) gameState = 'GAMEOVER';
                }
            }
        });

        if (isColliding(player, levelData.finishLine)) gameState = 'LEVEL_CLEAR';

        cameraX = Math.max(0, Math.min(player.x - 400, levelData.finishLine.x - 400));
        ctx.clearRect(0, 0, 800, 600);

        // Fundo dinâmico e cortado
        if (assets.bg.complete && assets.bg.naturalHeight > 0) {
            let sWidth = assets.bg.naturalWidth;
            let sHeight = assets.bg.naturalHeight * 0.85; 
            let ratio = 600 / sHeight;
            let bgW = sWidth * ratio;
            for(let i = 0; i < levelData.finishLine.x + 800; i += bgW) {
                ctx.drawImage(assets.bg, 0, 0, sWidth, sHeight, i - cameraX, 0, bgW, 600);
            }
        }

        levelData.platforms.forEach(p => {
            if (p.type === 'chao_invisivel') return;
            ctx.drawImage(assets.arm, p.x - cameraX, p.y, p.width, p.height + 30);
        });

        let floatY = Math.sin(Date.now() / 200) * 5; 
        levelData.items.forEach(it => {
            if (!it.collected) ctx.drawImage(assets.doc, it.x - cameraX, it.y + floatY, it.width, it.height);
        });

        let f = levelData.finishLine;
        ctx.fillStyle = `rgba(46, 204, 113, ${0.3 + 0.3 * Math.sin(Date.now() / 200)})`; 
        ctx.fillRect(f.x - cameraX, f.y, f.width, f.height);
        ctx.fillStyle = "white"; ctx.font = "bold 20px Courier New";
        ctx.fillText("PROXIMA FASE", f.x - cameraX + 10, f.y - 10);

        levelData.enemies.forEach(e => e.draw(ctx, cameraX));
        player.draw(ctx, cameraX);

    } else {
        ctx.fillStyle = "rgba(0,0,0,0.85)"; ctx.fillRect(0,0,800,600);
        ctx.textAlign = "center"; 
        
        let startMsg = "Toque no Ecrã para Começar"; // Mensagem para mobile
        
        if (gameState === 'START') {
            let titleAlpha = 0.6 + 0.4 * Math.sin(Date.now() / 150); 
            ctx.fillStyle = `rgba(241, 196, 15, ${titleAlpha})`; 
            ctx.font = "bold 55px Courier New";
            ctx.fillText("O ARQUIVISTA", 400, 250);
            ctx.fillStyle = "white"; ctx.font = "20px Courier New";
            ctx.fillText(startMsg, 400, 320);
        } else if (gameState === 'LEVEL_CLEAR') {
            ctx.fillStyle = "#2ecc71"; ctx.font = "bold 40px Courier New";
            ctx.fillText(`NÍVEL ${currentLevel} CONCLUÍDO!`, 400, 250);
            ctx.fillStyle = "white"; ctx.font = "20px Courier New";
            ctx.fillText("Toque para o Próximo Nível", 400, 320);
        } else if (gameState === 'GAME_COMPLETED') {
            ctx.fillStyle = "#3498db"; ctx.font = "bold 40px Courier New";
            ctx.fillText("ARQUIVO MESTRE SALVO!", 400, 250);
            ctx.fillStyle = "white"; ctx.font = "20px Courier New";
            ctx.fillText(`Você venceu as 10 Fases com ${score} Pontos!`, 400, 320);
            ctx.fillText("Toque para Jogar Novamente", 400, 370);
        } else if (gameState === 'GAMEOVER') {
            ctx.fillStyle = "#e74c3c"; ctx.font = "bold 45px Courier New";
            ctx.fillText("FIM DE JOGO", 400, 250);
            ctx.fillStyle = "white"; ctx.font = "20px Courier New";
            ctx.fillText("Toque para Tentar Novamente", 400, 320);
        }
    }
    requestAnimationFrame(gameLoop);
}

gameState = 'START';
requestAnimationFrame(gameLoop);
