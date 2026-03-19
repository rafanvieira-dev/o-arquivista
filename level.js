const FLOOR_Y = 582; 

function generateLevel(levelNumber) {
    const bgW = 941; 
    const numChunks = 2 + levelNumber; 
    const levelLength = numChunks * bgW; 
    
    let backgroundToUse = `assets/sprites/fundo${((levelNumber - 1) % 10) + 1}.png`;
    
    let platforms = [{ x: 0, y: FLOOR_Y, width: levelLength + 800, height: 40, type: 'chao_invisivel' }];
    let items = [];
    let enemies = [];
    let flyingEnemies = []; 

    for (let i = 0; i < numChunks; i++) {
        let chunkStart = i * bgW;

        // --- ARMÁRIO 1 ---
        let arm1X = chunkStart + 250;
        let arm1W = 120 + Math.random() * (20 + levelNumber * 10);
        let arm1H = 80 + Math.random() * (30 + levelNumber * 15); 
        platforms.push({ x: arm1X, y: FLOOR_Y - arm1H, width: arm1W, height: arm1H, type: 'armario' });

        let docSize = 70;
        if (Math.random() > 0.3) {
            items.push({ x: arm1X + (arm1W/2) - (docSize/2), y: FLOOR_Y - arm1H - docSize - 5, width: docSize, height: docSize, collected: false });
        }

        // --- ARMÁRIO 2 ---
        let arm2X = chunkStart + 650;
        let arm2W = 120 + Math.random() * (30 + levelNumber * 10);
        let arm2H = 90 + Math.random() * (30 + levelNumber * 15);
        platforms.push({ x: arm2X, y: FLOOR_Y - arm2H, width: arm2W, height: arm2H, type: 'armario' });

        // --- SISTEMA DE RATOS NO CHÃO ---
        let fimDoArmario1 = arm1X + arm1W;
        let espacoLivreChao = arm2X - fimDoArmario1; 
        
        let qtdInimigos = 1 + Math.floor(levelNumber / 3); 
        if (qtdInimigos > 3) qtdInimigos = 3; 

        let espacoPorRato = espacoLivreChao / qtdInimigos;

        for (let j = 0; j < qtdInimigos; j++) {
            let enemyX = fimDoArmario1 + (espacoPorRato * j) + 20; 
            let patrolDist = espacoPorRato - 40; 
            if (patrolDist < 20) patrolDist = 20;

            enemies.push(new Enemy(enemyX, FLOOR_Y - 40, patrolDist, 'ground')); 
        }

        // --- SISTEMA DE BARATAS VOADORAS FIXAS (A partir do nível 3) ---
        if (levelNumber >= 3) {
            // Posiciona a barata a pairar a meio caminho entre a altura do pulo do jogador
            let areaSeguraX = arm2X + arm2W + 60; 
            let barataY = FLOOR_Y - 110; 
            
            // Distância de patrulha a 0 porque ela já não sai do lugar
            flyingEnemies.push(new Enemy(areaSeguraX, barataY, 0, 'flying'));
        }
    }

    let npcType;
    let mod = levelNumber % 4; 
    if (mod === 1) npcType = 'flavio';
    else if (mod === 2) npcType = 'rosale';
    else if (mod === 3) npcType = 'eliezer';
    else npcType = 'igorgak'; 

    let npc = { type: npcType, x: levelLength + 160, y: FLOOR_Y - 75 };

    return {
        bgImage: backgroundToUse,
        platforms: platforms,
        items: items,
        enemies: enemies,
        flyingEnemies: flyingEnemies, 
        npc: npc, 
        finishLine: { x: levelLength, y: FLOOR_Y - 300, width: 120, height: 300 },
        timeLimit: 60 + (levelNumber * 20) 
    };
}
