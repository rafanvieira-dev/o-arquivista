const firebaseConfig = {
    apiKey: "AIzaSyBi9zuGjblDXhXpKLAqf9nTj_Ki-fOar2I",
    authDomain: "o-arquivista-69d2b.firebaseapp.com",
    projectId: "o-arquivista-69d2b",
    storageBucket: "o-arquivista-69d2b.firebasestorage.app",
    messagingSenderId: "659470982011",
    appId: "1:659470982011:web:36619b8666f20cb82cfbde",
    measurementId: "G-BL9BENVQJC"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
let topScores = [];

function fetchRecordes() {
    db.collection("recordes").orderBy("pontuacao", "desc").limit(5).get()
    .then((querySnapshot) => {
        topScores = [];
        querySnapshot.forEach((doc) => topScores.push(doc.data()));
    })
    .catch(err => console.log("Sem conexão aos recordes ainda..."));
}
fetchRecordes(); 

function salvarProgresso() {
    let playerName = localStorage.getItem("arquivista_nome") || "Anônimo";
    
    db.collection("recordes").doc(playerName).get().then((docSnapshot) => {
        let melhorPontuacao = score;
        let melhorFase = currentLevel;
        
        if (docSnapshot.exists) {
            let dados = docSnapshot.data();
            if (dados.pontuacao > score) melhorPontuacao = dados.pontuacao;
            if (dados.fase_alcancada > currentLevel) melhorFase = dados.fase_alcancada;
        }

        db.collection("recordes").doc(playerName).set({
            nome: playerName,
            fase_alcancada: melhorFase,
            pontuacao: melhorPontuacao,
            ultima_partida: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).then(() => fetchRecordes());
    });
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const titleElement = document.getElementById('game-title');

const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const healthDisplay = document.getElementById('healthDisplay');
const timerDisplay = document.getElementById('timerDisplay');

const assets = { 
    bg: new Image(), arm: new Image(), doc: new Image(),
    flavio: new Image(), rosale: new Image(), eliezer: new Image(), igorgak: new Image()
};
assets.arm.src = 'assets/sprites/armario.png';
assets.doc.src = 'assets/sprites/documento.png';
assets.flavio.src = 'assets/sprites/flavio.png';
assets.rosale.src = 'assets/sprites/rosale.png';
assets.eliezer.src = 'assets/sprites/eliezer.png';
assets.igorgak.src = 'assets/sprites/igorgak.png';

let player, cameraX, score, health, timer, timerAccumulator, gameState;
let currentLevel = 1;
const MAX_LEVELS = 10;
let levelData = {}; 

let keys = { left: false, right: false, up: false };
let jumpJustPressed = false; let lastTime = 0;

window.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') keys.left = true;
    if (e.code === 'ArrowRight') keys.right = true;
    if (e.code === 'Space') { if (!keys.up) jumpJustPressed = true; keys.up = true; }
    
    // NOVA REGRA DO PORTAL PELO TECLADO
    if (e.code === 'Enter') {
        if (gameState === 'PLAYING' && player.canExit) {
            gameState = 'LEVEL_CLEAR';
            salvarProgresso();
        } else {
            checkMenuProgression();
        }
    }
});
window.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') keys.left = false;
    if (e.code === 'ArrowRight') keys.right = false;
    if (e.code === 'Space') keys.up = false;
});

function iniciarComNome() {
    let playerName = localStorage.getItem("arquivista_nome");
    if (!playerName) {
        playerName = prompt("Bem-vindo! Qual é o seu nome para o Placar de Recordes?");
        if (playerName && playerName.trim() !== "") {
            localStorage.setItem("arquivista_nome", playerName.trim());
        } else {
            localStorage.setItem("arquivista_nome", "Anônimo");
        }
    }
    resetGame();
}

function checkMenuProgression() {
    if (gameState === 'START' || gameState === 'GAMEOVER' || gameState === 'GAME_COMPLETED') {
        iniciarComNome();
    } else if (gameState === 'LEVEL_CLEAR') {
        nextLevel();
    }
}

function handleTouch(e) {
    if (gameState !== 'PLAYING') {
        if (e.type === 'touchstart') checkMenuProgression();
        return;
    }
    
    // NOVA REGRA DO PORTAL PELO TOQUE NO CELULAR
    if (gameState === 'PLAYING' && player.canExit && e.type === 'touchstart') {
        gameState = 'LEVEL_CLEAR';
        salvarProgresso();
        return;
    }

    e.preventDefault(); 
    keys.left = false; keys.right = false;
    let isJumping = false;
    const screenWidth = window.innerWidth;

    for (let i = 0; i < e.touches.length; i++) {
        let touchX = e.touches[i].clientX;
        if (touchX < screenWidth * 0.25) keys.left = true;
        else if (touchX >= screenWidth * 0.25 && touchX < screenWidth * 0.5) keys.right = true;
        else if (touchX >= screenWidth * 0.5) isJumping = true;
    }
    if (isJumping && !keys.up) jumpJustPressed = true;
    keys.up = isJumping;
}

window.addEventListener('touchstart', handleTouch, { passive: false });
window.addEventListener('touchmove', handleTouch, { passive: false });
window.addEventListener('touchend', handleTouch, { passive: false });
window.addEventListener('touchcancel', handleTouch, { passive: false });

function initLevel(lvl) {
    levelData = generateLevel(lvl);
    assets.bg.src = levelData.bgImage; 

    if (levelData.npc) {
        levelData.npcInstance = new NPC(levelData.npc.x, levelData.npc.y, levelData.npc.type);
    }
    
    player = new Player(100, 300);
    player.canExit = false;
    cameraX = 0; timer = levelData.timeLimit; timerAccumulator = 0;
    gameState = 'PLAYING';
    levelDisplay.innerText = `Nível: ${currentLevel}`;
    updateHUD();
}

function resetGame() {
    currentLevel = 1; score = 0; health = 3; initLevel(currentLevel);
}

function nextLevel() {
    currentLevel++;
    if (currentLevel > MAX_LEVELS) {
        gameState = 'GAME_COMPLETED';
        salvarProgresso();
    } else {
        initLevel(currentLevel);
        salvarProgresso();
    }
}

function updateHUD() {
    scoreDisplay.innerText = `Pontuação: ${score}`;
    timerDisplay.innerText = `⏳ ${timer}`;
    healthDisplay.innerText = `Vidas: ${'❤️'.repeat(Math.max(0, health))}`;
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
    titleElement.style.display = (gameState === 'START') ? 'block' : 'none';

    if (gameState === 'PLAYING') {
        timerAccumulator += deltaTime;
        if (timerAccumulator >= 1000) { 
            timer--; updateHUD(); timerAccumulator = 0; 
            if (timer <= 0) { gameState = 'GAMEOVER'; salvarProgresso(); }
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
                    enemy.y = 9999; player.vy = -14; score += 15; updateHUD();
                } else if (!player.invincible) {
                    health--; updateHUD(); player.invincible = true;
                    setTimeout(() => player.invincible = false, 1500); 
                    if (health <= 0) { gameState = 'GAMEOVER'; salvarProgresso(); }
                }
            }
        });

        // VERIFICA SE ESTÁ NO PORTAL
        player.canExit = isColliding(player, levelData.finishLine);

        cameraX = Math.max(0, Math.min(player.x - 400, levelData.finishLine.x - 400));
        ctx.clearRect(0, 0, 800, 600);

        // FUNDO CORRIGIDO: Desenha 100% da imagem (sem corte de 0.85)
        if (assets.bg.complete && assets.bg.naturalHeight > 0) {
            let sWidth = assets.bg.naturalWidth;
            let sHeight = assets.bg.naturalHeight; 
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

        // DESENHO DO PORTAL COM A MENSAGEM
        let f = levelData.finishLine;
        ctx.fillStyle = `rgba(46, 204, 113, ${0.3 + 0.3 * Math.sin(Date.now() / 200)})`; 
        ctx.fillRect(f.x - cameraX, f.y, f.width, f.height);
        
        if (player.canExit) {
            ctx.fillStyle = "white"; 
            ctx.font = "bold 18px Courier New";
            ctx.textAlign = "center";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            
            let txt1 = "APERTE [ENTER]";
            let txt2 = "OU TOQUE P/ PASSAR";
            
            ctx.strokeText(txt1, f.x - cameraX + f.width/2, f.y + 120);
            ctx.fillText(txt1, f.x - cameraX + f.width/2, f.y + 120);
            
            ctx.strokeText(txt2, f.x - cameraX + f.width/2, f.y + 150);
            ctx.fillText(txt2, f.x - cameraX + f.width/2, f.y + 150);
        } else {
            ctx.fillStyle = "white"; ctx.font = "bold 20px Courier New";
            ctx.fillText("PORTAL", f.x - cameraX + f.width/2, f.y - 10);
        }

        if (levelData.npcInstance) {
            levelData.npcInstance.update(deltaTime);
            levelData.npcInstance.draw(ctx, cameraX);
        }

        levelData.enemies.forEach(e => e.draw(ctx, cameraX));
        player.draw(ctx, cameraX);

    } else {
        ctx.fillStyle = "rgba(0,0,0,0.85)"; ctx.fillRect(0,0,800,600);
        ctx.textAlign = "center"; 
        
        if (gameState === 'START') {
            ctx.fillStyle = "white"; ctx.font = "16px Courier New";
            ctx.fillText("💻 PC: ← → Andar | ESPAÇO Pular", 400, 260);
            ctx.fillText("📱 CELULAR: Toque Esquerda p/ Andar | Direita p/ Pular", 400, 290);
            
            ctx.fillStyle = "#2ecc71"; ctx.font = "bold 20px Courier New";
            ctx.fillText("Toque na tela ou ENTER para Começar", 400, 340);

            ctx.fillStyle = "#f1c40f"; ctx.font = "bold 22px Courier New";
            ctx.fillText("🏆 TOP 5 RECORDES 🏆", 400, 420);
            ctx.fillStyle = "white"; ctx.font = "16px Courier New";
            
            if (topScores.length === 0) {
                ctx.fillText("A carregar recordes do Firebase...", 400, 450);
            } else {
                topScores.forEach((rec, index) => {
                    ctx.fillText(`${index + 1}. ${rec.nome} - ${rec.pontuacao} pts (Nível ${rec.fase_alcancada})`, 400, 455 + (index * 22));
                });
            }
        } 
        else if (gameState === 'LEVEL_CLEAR') {
            ctx.fillStyle = "#2ecc71"; ctx.font = "bold 40px Courier New";
            ctx.fillText(`NÍVEL ${currentLevel} CONCLUÍDO!`, 400, 250);
            ctx.fillStyle = "white"; ctx.font = "22px Courier New";
            ctx.fillText("Progresso salvo. Toque para Avançar", 400, 320);
        } else if (gameState === 'GAME_COMPLETED') {
            ctx.fillStyle = "#3498db"; ctx.font = "bold 40px Courier New";
            ctx.fillText("ARQUIVO MESTRE SALVO!", 400, 250);
            ctx.fillStyle = "white"; ctx.font = "22px Courier New";
            ctx.fillText(`Venceu com ${score} Pontos (Salvo na Nuvem)!`, 400, 320);
            ctx.fillText("Toque para Jogar Novamente", 400, 370);
        } else if (gameState === 'GAMEOVER') {
            ctx.fillStyle = "#e74c3c"; ctx.font = "bold 50px Courier New";
            ctx.fillText("FIM DE JOGO", 400, 250);
            ctx.fillStyle = "white"; ctx.font = "22px Courier New";
            ctx.fillText("Pontuação Salva. Toque para Tentar Novamente", 400, 320);
        }
    }
    requestAnimationFrame(gameLoop);
}

gameState = 'START';
requestAnimationFrame(gameLoop);
