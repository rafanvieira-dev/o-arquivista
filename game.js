const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const assets = { bg: new Image(), arm: new Image(), doc: new Image() };
assets.bg.src = 'assets/sprites/fundo.png';
assets.arm.src = 'assets/sprites/armario.png';
assets.doc.src = 'assets/sprites/documento.png';

// ── HUD ────────────────────────────────────────────────────────────────────
const scoreDisplay  = document.getElementById('scoreDisplay');
const timerDisplay  = document.getElementById('timerDisplay');
const healthDisplay = document.getElementById('healthDisplay');

// ── Estado do jogo ─────────────────────────────────────────────────────────
let player, cameraX, score, health, timer, timerAccumulator, enemies, gameState;
let keys = { left: false, right: false, up: false };
let jumpJustPressed = false;
let lastTime = 0;

// ── Fábrica de inimigos (recria a cada partida) ────────────────────────────
function createEnemies() {
    return [
        new Enemy(600,  FLOOR_Y - 30, 150),
        new Enemy(1400, FLOOR_Y - 30, 200)
    ];
}

// ── Atualiza o HUD ─────────────────────────────────────────────────────────
function updateHUD() {
    scoreDisplay.textContent  = `Documentos: ${score}`;
    timerDisplay.textContent  = `Tempo: ${Math.ceil(timer)}`;
    timerDisplay.style.color  = timer <= 30 ? '#e74c3c' : '#f1c40f';
    healthDisplay.textContent = `Vidas: ${'❤️'.repeat(health)}`;
}

// ── Reinicia o jogo ────────────────────────────────────────────────────────
function resetGame() {
    player           = new Player(100, 300);
    score            = 0;
    health           = 3;
    timer            = 190;
    timerAccumulator = 0;
    cameraX          = 0;
    gameState        = 'PLAYING';
    enemies          = createEnemies();
    levelData.items.forEach(i => i.collected = false);
    updateHUD();
}

// ── Detecção de colisão AABB ───────────────────────────────────────────────
function isColliding(a, b) {
    return a.x < b.x + b.width  &&
           a.x + a.width  > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// ── Física ─────────────────────────────────────────────────────────────────
function applyPhysics() {
    player.x += player.vx;
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
            if (player.vy > 0) {
                player.y = p.y - player.height;
                player.vy = 0;
                player.grounded = true;
            } else if (player.vy < 0) {
                player.y = p.y + p.height;
                player.vy = 0;
            }
        }
    });
}

// ── Coleta de documentos ───────────────────────────────────────────────────
function checkItemCollection() {
    levelData.items.forEach(item => {
        if (!item.collected && isColliding(player, item)) {
            item.collected = true;
            score++;
            updateHUD();
        }
    });
}

// ── Colisão com inimigos ───────────────────────────────────────────────────
function checkEnemyCollision() {
    if (player.invincible) return;
    enemies.forEach(enemy => {
        if (isColliding(player, enemy)) {
            health--;
            player.invincible = true;
            // 2 segundos de invencibilidade após levar dano
            setTimeout(() => { player.invincible = false; }, 2000);
            updateHUD();
            if (health <= 0) gameState = 'GAMEOVER';
        }
    });
}

// ── Controles ──────────────────────────────────────────────────────────────
window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft')  keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') { if (!keys.up) jumpJustPressed = true; keys.up = true; }
    if (e.code === 'Enter' && gameState !== 'PLAYING') resetGame();
});
window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft')  keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.up = false;
});

// ── Tela de menu ───────────────────────────────────────────────────────────
function drawMenu() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 800, 600);
    ctx.textAlign = 'center';

    if (gameState === 'WIN') {
        ctx.fillStyle = '#2ecc71';
        ctx.font = "bold 36px 'Courier New'";
        ctx.fillText('✔ ARQUIVO SALVO COM SUCESSO!', 400, 220);
        ctx.fillStyle = 'white';
        ctx.font = "22px 'Courier New'";
        ctx.fillText(`Documentos coletados: ${score} / ${levelData.items.length}`, 400, 275);
        ctx.fillStyle = '#aaa';
        ctx.font = "18px 'Courier New'";
        ctx.fillText('Pressione ENTER para jogar novamente', 400, 360);

    } else if (gameState === 'GAMEOVER') {
        ctx.fillStyle = '#e74c3c';
        ctx.font = "bold 40px 'Courier New'";
        ctx.fillText(timer <= 0 ? '⏰ TEMPO ESGOTADO!' : '💀 GAME OVER', 400, 220);
        ctx.fillStyle = 'white';
        ctx.font = "22px 'Courier New'";
        ctx.fillText(`Documentos coletados: ${score} / ${levelData.items.length}`, 400, 275);
        ctx.fillStyle = '#aaa';
        ctx.font = "18px 'Courier New'";
        ctx.fillText('Pressione ENTER para tentar novamente', 400, 360);

    } else { // START
        ctx.fillStyle = '#f1c40f';
        ctx.font = "bold 44px 'Courier New'";
        ctx.fillText('O ARQUIVISTA', 400, 180);
        ctx.fillStyle = 'white';
        ctx.font = "18px 'Courier New'";
        ctx.fillText('← →  Mover     ESPAÇO  Pular (duplo!)', 400, 270);
        ctx.fillText('Colete os documentos e chegue ao arquivo final!', 400, 305);
        ctx.fillStyle = '#e74c3c';
        ctx.fillText('Cuidado com os ratos! ❤️❤️❤️', 400, 340);
        ctx.fillStyle = '#2ecc71';
        ctx.font = "bold 22px 'Courier New'";
        ctx.fillText('Pressione ENTER para começar', 400, 420);
    }
}

// ── Loop principal ─────────────────────────────────────────────────────────
function gameLoop(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (gameState === 'PLAYING') {

        // Timer decrescente
        timerAccumulator += deltaTime;
        if (timerAccumulator >= 1000) {
            timer--;
            timerAccumulator -= 1000;
            updateHUD();
            if (timer <= 0) { timer = 0; gameState = 'GAMEOVER'; }
        }

        // Atualiza entidades
        player.update(keys, deltaTime, jumpJustPressed);
        jumpJustPressed = false;
        applyPhysics();
        enemies.forEach(e => e.update(deltaTime));   // ← INIMIGOS ATIVOS

        // Verifica colisões
        checkItemCollection();                        // ← COLETA DOCUMENTOS
        checkEnemyCollision();                        // ← DANO DOS INIMIGOS

        // Vitória
        if (isColliding(player, levelData.finishLine)) gameState = 'WIN';

        // Câmera
        cameraX = Math.max(0, Math.min(player.x - 400, 3800));

        // ── Renderização ──────────────────────────────────────────────────
        ctx.clearRect(0, 0, 800, 600);

        // Fundo
        if (assets.bg.complete && assets.bg.naturalHeight > 0) {
            const ratio = 600 / assets.bg.naturalHeight;
            const bgW   = assets.bg.naturalWidth * ratio;
            for (let i = 0; i < 5000; i += bgW)
                ctx.drawImage(assets.bg, i - cameraX, 0, bgW, 600);
        }

        // Plataformas (armários)
        levelData.platforms.forEach(p => {
            if (p.type === 'chao_invisivel') return;
            ctx.drawImage(assets.arm, p.x - cameraX, p.y, p.width, p.height + 20);
        });

        // Documentos
        levelData.items.forEach(it => {
            if (!it.collected)
                ctx.drawImage(assets.doc, it.x - cameraX, it.y, it.width, it.height);
        });

        // Inimigos
        enemies.forEach(e => e.draw(ctx, cameraX));   // ← INIMIGOS VISÍVEIS

        // Linha de chegada
        const f = levelData.finishLine;
        ctx.fillStyle = 'rgba(46, 204, 113, 0.4)';
        ctx.fillRect(f.x - cameraX, f.y, f.width, f.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('ARQUIVO FINAL', f.x - cameraX, f.y - 10);

        // Jogador
        player.draw(ctx, cameraX);

    } else {
        drawMenu();
    }

    requestAnimationFrame(gameLoop);
}

// ── Inicialização ──────────────────────────────────────────────────────────
gameState = 'START';
requestAnimationFrame(gameLoop);
