const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');

let player = new Player(50, 400);
let cameraX = 0;
let score = 0;
let health = 3;
let gameState = 'START';

const keys = { left: false, right: false, up: false, shift: false, action: false };

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') keys.up = true;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.shift = true;
    if (e.code === 'KeyE') keys.action = true;
    
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
    if (e.code === 'KeyE') keys.action = false;
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
    scoreDisplay.innerText = `Documentos: ${score}`;
    healthDisplay.innerText = `Vidas: ${health}`;
    levelData.items.forEach(i => i.collected = false);
    enemiesList[0].x = enemiesList[0].startX; enemiesList[0].y = 530;
    enemiesList[1].x = enemiesList[1].startX; enemiesList[1].y = 530;
    enemiesList[2].x = enemiesList[2].startX; enemiesList[2].y = 330;
}

function drawTextCenter(text, size, color, offset = 0) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Courier New`;
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + offset);
}

// Variável para calcular o tempo da animação
let lastTime = 0;

function gameLoop(timeStamp) {
    // Calculando o deltaTime (tempo que passou desde o último frame)
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'START') {
        drawTextCenter('O ARQUIVISTA', 50, 'white', -40);
        drawTextCenter('Pressione ENTER para Começar', 20, '#f1c40f', 20);
        drawTextCenter('Setas p/ Mover | Espaço p/ Pular | Shift p/ Correr', 16, '#bdc3c7', 60);
    } 
    else if (gameState === 'GAMEOVER') {
        drawTextCenter('FIM DE JOGO', 50, '#e74c3c', -20);
        drawTextCenter('Pressione ENTER para Tentar Novamente', 20, 'white', 30);
    }
    else if (gameState === 'WIN') {
        drawTextCenter('ARQUIVO SALVO!', 50, '#2ecc71', -20);
        drawTextCenter(`Pontuação Final: ${score}`, 25, 'white', 30);
        drawTextCenter('Pressione ENTER para Jogar Novamente', 20, '#f1c40f', 70);
    }
    else if (gameState === 'PLAYING') {
        // Passando o deltaTime para o player
        player.update(keys, deltaTime);
        checkCollisions();
        
        // AQUI ESTÁ A ATUALIZAÇÃO DOS INIMIGOS: passando o deltaTime
        enemiesList.forEach(e => e.update(deltaTime));
        checkItemsAndEnemies();

        cameraX = player.x - canvas.width / 2 + player.width / 2;
        if (cameraX < 0) cameraX = 0; 
        if (cameraX > 2000 - canvas.width) cameraX = 2000 - canvas.width; 

        for (let plat of levelData.platforms) {
            ctx.fillStyle = plat.color;
            ctx.fillRect(plat.x - cameraX, plat.y, plat.width, plat.height);
        }

        let finish = levelData.finishLine;
        ctx.fillStyle = '#27ae60'; 
        ctx.fillRect(finish.x - cameraX, finish.y, finish.width, finish.height);

        for (let item of levelData.items) {
            if (!item.collected) {
                ctx.fillStyle = '#f1c40f'; 
                ctx.fillRect(item.x - cameraX, item.y, item.width, item.height);
            }
        }

        enemiesList.forEach(e => e.draw(ctx, cameraX));

        player.draw(ctx, cameraX);
        
        if (player.y > canvas.height) {
            health = 0;
            gameState = 'GAMEOVER';
        }
    }

    // O requestAnimationFrame injeta automaticamente o timeStamp na função
    requestAnimationFrame(gameLoop);
}

// Inicia o loop (passando 0 como tempo inicial para evitar erros no primeiro frame)
requestAnimationFrame(gameLoop);
