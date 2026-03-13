const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const timerDisplay = document.getElementById('timerDisplay'); 

// --- CARREGAMENTO DE IMAGENS ---
const bgImage = new Image(); bgImage.src = 'assets/sprites/fundo.png';
const armarioImg = new Image(); armarioImg.src = 'assets/sprites/armario.png'; 
const escadaImg = new Image(); escadaImg.src = 'assets/sprites/escada.png';
const andaimeImg = new Image(); andaimeImg.src = 'assets/sprites/andaime.png';
const docImg = new Image(); docImg.src = 'assets/sprites/documentos.png';
const chaoImg = new Image(); chaoImg.src = 'assets/sprites/chao.png'; 

let player = new Player(50, 400);
let cameraX = 0;
let score = 0;
let health = 3;
let gameState = 'START';

// Variáveis do Temporizador
let timeLeft = 190;
let timerAccumulator = 0;

const keys = { left: false, right: false, up: false, shift: false, action: false };

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') keys.up = true;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.shift = true;
    
    if (e.code === 'Enter' && gameState !== 'PLAYING') {
        resetGame();
        gameState = 'PLAYING';
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.up = false;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.shift = false;
});

function checkCollisions() {
    for (let plat of levelData.platforms) {
        if (player.x < plat.x + plat.width &&
            player.x + player.width > plat.x &&
            player.y < plat.y + plat.height &&
            player.y + player.height > plat.y) {
            
            if (player.vy > 0 && player.y + player.height - player.vy <= plat.y + 10) {
                player.grounded = true;
                player.vy = 0;
                player.y = plat.y - player.height;
            } 
            else if (player.vy < 0 && player.y - player.vy >= plat.y + plat.height - 10) {
                player.vy = 0;
                player.y = plat.y + plat.height;
            }
            else {
                if (player.vx > 0) player.x = plat.x - player.width;
                else if (player.vx < 0) player.x = plat.x + plat.width;
            }
        }
    }

    if (player.x < 0) player.x = 0;

    let finish = levelData.finishLine;
    if (player.x < finish.x + finish.width && player.x + player.width > finish.x &&
        player.y < finish.y + finish.height && player.y + player.height > finish.y) {
        gameState = 'WIN';
    }
}

function checkItemsAndEnemies() {
    for (let item of levelData.items) {
        if (!item.collected && 
            player.x < item.x + item.width && player.x + player.width > item.x &&
            player.y < item.y + item.height && player.y + player.height > item.y) {
            item.collected = true;
            score += 10;
            scoreDisplay.innerText = `Documentos: ${score}`;
        }
    }

    for (let enemy of enemiesList) {
        if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
            
            if (player.vy > 0 && player.y + player.height - player.vy <= enemy.y + 10) {
                enemy.y = 9999; 
                player.vy = -8; 
                score += 5;
            } else {
                player.x -= 50; 
                player.vy = -5;
                health -= 1;
                healthDisplay.innerText = `Vidas: ${health}`;
                if (health <= 0) gameState = 'GAMEOVER';
            }
        }
    }
}

function resetGame() {
    player = new Player(50, 400);
    score = 0;
    health = 3;
    timeLeft = 190; 
    timerAccumulator = 0;
    
    scoreDisplay.innerText = `Documentos: ${score}`;
    healthDisplay.innerText = `Vidas: ${health}`;
    timerDisplay.innerText = `Tempo: ${timeLeft}`;
    
    levelData.items.forEach(i => i.collected = false);
    
    enemiesList.forEach(e => {
        e.x = e.startX;
        e.y = e.startY;
        e.vx = Math.abs(e.vx); 
        e.facing = 1;
    });
}

function drawTextCenter(text, size, color, offset = 0) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + offset);
}

let lastTime = 0;

function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'START') {
        drawTextCenter('O ARQUIVISTA', 50, 'white', -40);
        drawTextCenter('Pressione ENTER para Começar', 20, '#f1c40f', 20);
        drawTextCenter('Cuidado com o tempo e com os ratos!', 16, '#bdc3c7', 60);
    } 
    else if (gameState === 'GAMEOVER') {
        drawTextCenter(timeLeft <= 0 ? 'O TEMPO ESGOTOU!' : 'FIM DE JOGO', 50, '#e74c3c', -20);
        drawTextCenter('Pressione ENTER para Tentar Novamente', 20, 'white', 30);
    }
    else if (gameState === 'WIN') {
        drawTextCenter('ARQUIVO SALVO!', 50, '#2ecc71', -20);
        drawTextCenter(`Pontuação: ${score} | Tempo Restante: ${timeLeft}s`, 25, 'white', 30);
        drawTextCenter('Pressione ENTER para Jogar Novamente', 20, '#f1c40f', 70);
    }
    else if (gameState === 'PLAYING') {
        // --- LÓGICA DO TEMPO ---
        timerAccumulator += deltaTime;
        if (timerAccumulator >= 1000) { 
            timeLeft--;
            timerDisplay.innerText = `Tempo: ${timeLeft}`;
            timerAccumulator -= 1000;
            if (timeLeft <= 0) {
                gameState = 'GAMEOVER';
            }
        }

        player.update(keys, deltaTime);
        checkCollisions();
        
        enemiesList.forEach(e => e.update(deltaTime));
        checkItemsAndEnemies();

        cameraX = player.x - canvas.width / 2 + player.width / 2;
        if (cameraX < 0) cameraX = 0; 
        if (cameraX > 4000 - canvas.width) cameraX = 4000 - canvas.width; // 4000 limite de mapa

        if (bgImage.complete && bgImage.naturalWidth > 0) {
            let bgScroll = (cameraX * 0.3) % canvas.width;
            ctx.drawImage(bgImage, -bgScroll, 0, canvas.width, canvas.height);
            ctx.drawImage(bgImage, canvas.width - bgScroll, 0, canvas.width, canvas.height);
        }

        for (let plat of levelData.platforms) {
            let drawn = false;
            
            // Lógica para repetir o piso
            if (plat.type === 'chao' && chaoImg.complete && chaoImg.naturalWidth > 0) {
                for(let i = 0; i < plat.width; i += chaoImg.naturalWidth) {
                    let drawWidth = Math.min(chaoImg.naturalWidth, plat.width - i);
                    ctx.drawImage(chaoImg, 0, 0, drawWidth, chaoImg.naturalHeight, plat.x + i - cameraX, plat.y, drawWidth, plat.height);
                }
                drawn = true;
            } 
            else if (plat.type === 'armario' && armarioImg.complete && armarioImg.naturalWidth > 0) {
                ctx.drawImage(armarioImg, plat.x - cameraX, plat.y, plat.width, plat.height);
                drawn = true;
            } else if (plat.type === 'escada' && escadaImg.complete && escadaImg.naturalWidth > 0) {
                ctx.drawImage(escadaImg, plat.x - cameraX, plat.y, plat.width, plat.height);
                drawn = true;
            } else if (plat.type === 'andaime' && andaimeImg.complete && andaimeImg.naturalWidth > 0) {
                ctx.drawImage(andaimeImg, plat.x - cameraX, plat.y, plat.width, plat.height);
                drawn = true;
            }

            if (!drawn) {
                ctx.fillStyle = plat.color;
                ctx.fillRect(plat.x - cameraX, plat.y, plat.width, plat.height);
            }
        }

        let finish = levelData.finishLine;
        ctx.fillStyle = '#27ae60'; 
        ctx.fillRect(finish.x - cameraX, finish.y, finish.width, finish.height);

        for (let item of levelData.items) {
            if (!item.collected) {
                if (docImg.complete && docImg.naturalWidth > 0) {
                    ctx.drawImage(docImg, item.x - cameraX, item.y, item.width, item.height);
                } else {
                    ctx.fillStyle = '#f1c40f'; 
                    ctx.fillRect(item.x - cameraX, item.y, item.width, item.height);
                }
            }
        }

        enemiesList.forEach(e => e.draw(ctx, cameraX));
        player.draw(ctx, cameraX);
        
        if (player.y > canvas.height) {
            health = 0;
            gameState = 'GAMEOVER';
        }
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
