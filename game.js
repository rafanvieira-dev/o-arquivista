const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const assets = { bg: new Image(), arm: new Image(), doc: new Image() };
assets.bg.src = 'assets/sprites/fundo.png'; 
assets.arm.src = 'assets/sprites/armario.png';
assets.doc.src = 'assets/sprites/documento.png';

let player = new Player(100, 300);
let cameraX = 0; let score = 0; let gameState = 'START';
let keys = { left: false, right: false, up: false };
let jumpJustPressed = false; let lastTime = 0;

window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') { if (!keys.up) jumpJustPressed = true; keys.up = true; }
    if (e.code === 'Enter' && gameState !== 'PLAYING') resetGame();
});
window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.up = false;
});

function resetGame() {
    player = new Player(100, 300); score = 0; gameState = 'PLAYING';
    levelData.items.forEach(i => i.collected = false);
}

function isColliding(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

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
            if (player.vy > 0) { player.y = p.y - player.height; player.vy = 0; player.grounded = true; }
            else if (player.vy < 0) { player.y = p.y + p.height; player.vy = 0; }
        }
    });
}

function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime; lastTime = timeStamp;

    if (gameState === 'PLAYING') {
        player.update(keys, deltaTime, jumpJustPressed); jumpJustPressed = false;
        applyPhysics();
        
        if (isColliding(player, levelData.finishLine)) gameState = 'WIN';

        cameraX = Math.max(0, Math.min(player.x - 400, 3800));
        ctx.clearRect(0, 0, 800, 600);

        // Fundo: Esticado para a madeira ficar na base do ecrã
        if (assets.bg.complete) {
            let ratio = 600 / assets.bg.naturalHeight;
            let bgW = assets.bg.naturalWidth * ratio;
            for(let i = 0; i < 5000; i += bgW) ctx.drawImage(assets.bg, i - cameraX, 0, bgW, 600);
        }

        // Armários: Com base extra para não flutuarem
        levelData.platforms.forEach(p => {
            if (p.type === 'chao_invisivel') return;
            ctx.drawImage(assets.arm, p.x - cameraX, p.y, p.width, p.height + 20);
        });

        // Itens
        levelData.items.forEach(it => {
            if (!it.collected) ctx.drawImage(assets.doc, it.x - cameraX, it.y, it.width, it.height);
        });

        // Final da Fase (Visual)
        let f = levelData.finishLine;
        ctx.fillStyle = "rgba(46, 204, 113, 0.4)";
        ctx.fillRect(f.x - cameraX, f.y, f.width, f.height);
        ctx.fillStyle = "white"; ctx.font = "20px Arial";
        ctx.fillText("ARQUIVO FINAL", f.x - cameraX, f.y - 10);

        player.draw(ctx, cameraX);
    } else {
        ctx.fillStyle = "black"; ctx.fillRect(0,0,800,600);
        ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.font = "30px Arial";
        ctx.fillText(gameState === 'WIN' ? "ARQUIVO SALVO COM SUCESSO!" : "O ARQUIVISTA - ENTER", 400, 300);
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
