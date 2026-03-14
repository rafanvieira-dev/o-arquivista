const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const timerDisplay = document.getElementById('timerDisplay');

const assets = { bg: new Image(), arm: new Image(), doc: new Image() };
assets.bg.src = 'assets/sprites/fundo.png'; 
assets.arm.src = 'assets/sprites/armario.png';
assets.doc.src = 'assets/sprites/documento.png';

let player, cameraX, score, health, timer, timerAccumulator, gameState;
let currentLevel = 1;
const MAX_LEVELS = 10;
let levelData = {}; // Carregado dinamicamente agora!

let keys = { left: false, right: false, up: false };
let jumpJustPressed = false; let lastTime = 0;

window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') { if (!keys.up) jumpJustPressed = true; keys.up = true; }
    
    // Controles de Menus
    if (e.code === 'Enter') {
        if (gameState === 'START' || gameState === 'GAMEOVER') resetGame();
        else if (gameState === 'LEVEL_CLEAR') nextLevel();
        else if (gameState === 'GAME_COMPLETED') resetGame();
    }
});
window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.up = false;
});

function initLevel(lvl) {
    levelData = generateLevel(lvl);
    player = new Player(100, 300);
    cameraX = 0;
    timer = levelData.timeLimit;
    timerAccumulator = 0;
    gameState = 'PLAYING';
    
    levelDisplay.innerText = `Nível: ${currentLevel}`;
    updateHUD();
}

function resetGame() {
    currentLevel = 1;
    score = 0;
    health = 3;
    initLevel(currentLevel);
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > MAX_LEVELS) {
        gameState = 'GAME_COMPLETED';
    } else {
        initLevel(currentLevel);
    }
}

function updateHUD() {
    scoreDisplay.innerText = `Documentos: ${score}`;
    timerDisplay.innerText = `Tempo: ${timer}`;
    healthDisplay.innerText = `Vidas: ${health}`;
}

function isColliding(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function applyPhysics() {
    player.x += player.vx;
    // Impede ir para trás do começo do nível
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
            timer--; 
            updateHUD();
            timerAccumulator = 0; 
            if (timer <= 0) gameState = 'GAMEOVER';
        }

        player.update(keys, deltaTime, jumpJustPressed); jumpJustPressed = false;
        applyPhysics();
        levelData.enemies.forEach(e => e.update(deltaTime));
        
        // Coleta Documentos
        levelData.items.forEach(it => {
            if (!it.collected && isColliding(player, it)) {
                it.collected = true; score += 10; updateHUD();
            }
        });

        // Dano Inimigo
        levelData.enemies.forEach(enemy => {
            if (isColliding(player, enemy)) {
                if (player.vy > 0 && player.y + player.height - player.vy <= enemy.y + 20) {
                    // Pulo no rato! Mata o rato!
                    enemy.y = 9999; player.vy = -12; score += 5; updateHUD();
                } else if (!player.invincible) {
                    health--; updateHUD();
                    player.invincible = true;
                    setTimeout(() => player.invincible = false, 1500);
                    if (health <= 0) gameState = 'GAMEOVER';
                }
            }
        });

        // Passar de Fase
        if (isColliding(player, levelData.finishLine)) {
            gameState = 'LEVEL_CLEAR';
        }

        cameraX = Math.max(0, Math.min(player.x - 400, levelData.finishLine.x - 400));
        ctx.clearRect(0, 0, 800, 600);

        if (assets.bg.complete) {
            let ratio = 600 / assets.bg.naturalHeight;
            let bgW = assets.bg.naturalWidth * ratio;
            for(let i = 0; i < levelData.finishLine.x + 800; i += bgW) {
                ctx.drawImage(assets.bg, i - cameraX, 0, bgW, 600);
            }
        }

        levelData.platforms.forEach(p => {
            if (p.type === 'chao_invisivel') return;
            ctx.drawImage(assets.arm, p.x - cameraX, p.y, p.width, p.height + 20);
        });

        let animTime = Date.now();
        let floatY = Math.sin(animTime / 200) * 5; 
        levelData.items.forEach(it => {
            if (!it.collected) ctx.drawImage(assets.doc, it.x - cameraX, it.y + floatY, it.width, it.height);
        });

        let f = levelData.finishLine;
        ctx.fillStyle = "rgba(46, 204, 113, 0.4)";
        ctx.fillRect(f.x - cameraX, f.y, f.width, f.height);
        ctx.fillStyle = "white"; ctx.font = "bold 20px Courier New";
        ctx.fillText("PROXIMA FASE", f.x - cameraX + 10, f.y - 10);

        levelData.enemies.forEach(e => e.draw(ctx, cameraX));
        player.draw(ctx, cameraX);

    } else {
        // MENUS
        ctx.fillStyle = "rgba(0,0,0,0.85)"; ctx.fillRect(0,0,800,600);
        ctx.fillStyle = "white"; ctx.textAlign = "center"; 
        
        if (gameState === 'START') {
            ctx.fillStyle = "#f1c40f"; ctx.font = "bold 40px Courier New";
            ctx.fillText("O ARQUIVISTA", 400, 250);
            ctx.fillStyle = "white"; ctx.font = "20px Courier New";
            ctx.fillText("Pressione ENTER para Começar", 400, 320);
        } else if (gameState === 'LEVEL_CLEAR') {
            ctx.fillStyle = "#2ecc71"; ctx.font = "bold 40px Courier New";
            ctx.fillText(`NÍVEL ${currentLevel} CONCLUÍDO!`, 400, 250);
            ctx.fillStyle = "white"; ctx.font = "20px Courier New";
            ctx.fillText("Pressione ENTER para o Próximo Nível", 400, 320);
        } else if (gameState === 'GAME_COMPLETED') {
            ctx.fillStyle = "#3498db"; ctx.font = "bold 40px Courier New";
            ctx.fillText("ARQUIVO MESTRE SALVO!", 400, 250);
            ctx.fillStyle = "white"; ctx.font = "20px Courier New";
            ctx.fillText(`Você venceu as 10 Fases com ${score} Pontos!`, 400, 320);
            ctx.fillText("Pressione ENTER para Jogar Novamente", 400, 370);
        } else if (gameState === 'GAMEOVER') {
            ctx.fillStyle = "#e74c3c"; ctx.font = "bold 40px Courier New";
            ctx.fillText("FIM DE JOGO", 400, 250);
            ctx.fillStyle = "white"; ctx.font = "20px Courier New";
            ctx.fillText("Pressione ENTER para Tentar Novamente", 400, 320);
        }
    }
    requestAnimationFrame(gameLoop);
}

// Inicia a aplicação
gameState = 'START';
requestAnimationFrame(gameLoop);
