const FLOOR_Y = 582; 

function generateLevel(levelNumber) {
    const bgW = 941; 
    const numChunks = 2 + levelNumber; 
    const levelLength = numChunks * bgW; 
    
    let backgroundToUse = `assets/sprites/fundo${levelNumber}.png`;
    
    let platforms = [{ x: 0, y: FLOOR_Y, width: levelLength + 800, height: 40, type: 'chao_invisivel' }];
    let items = [];
    let enemies = [];
    let flyingEnemies = []; // Adicionada a lista para inimigos voadores

    for (let i = 0; i < numChunks; i++) {
        let chunkStart = i * bgW;

        // Armário 1
        let arm1X = chunkStart + 250;
        let arm1W = 120 + Math.random() * (20 + levelNumber * 10);
        let arm1H = 80 + Math.random() * (30 + levelNumber * 15); 
        platforms.push({ x: arm1X, y: FLOOR_Y - arm1H, width: arm1W, height: arm1H, type: 'armario' });

        let docSize = 70;
        if (Math.random() > 0.3) {
            items.push({ x: arm1X + (arm1W/2) - (docSize/2), y: FLOOR_Y - arm1H - docSize - 5, width: docSize, height: docSize, collected: false });
        }

        // --- SISTEMA DE INIMIGOS PROGRESSIVOS NO CHÃO ---
        // Calcula a quantidade de inimigos (aumenta a cada nível)
        let qtdInimigos = 1 + Math.floor(levelNumber / 3); 
        let espacoDisponivel = 160; 
        let passo = espacoDisponivel / qtdInimigos;

        for (let j = 0; j < qtdInimigos; j++) {
            let enemyX = chunkStart + 400 + (j * passo); // Espalha os ratos entre o armário 1 e 2
            enemies.push(new Enemy(enemyX, FLOOR_Y - 40, 50)); // Distância de patrulha ajustada
        }

        // Armário 2
        let arm2X = chunkStart + 650;
        let arm2W = 120 + Math.random() * (30 + levelNumber * 10);
        let arm2H = 90 + Math.random() * (30 + levelNumber * 15);
        platforms.push({ x: arm2X, y: FLOOR_Y - arm2H, width: arm2W, height: arm2H, type: 'armario' });

        // --- ADICIONA BARATAS VOADORAS A PARTIR DA FASE 3 ---
        // Elas ficam onde não tem rato no chão (zona segura após o armário 2)
        if (levelNumber >= 3) {
            // Zona segura é entre o fim do Armário 2 e o fim do Chunk
            let areaSeguraX = arm2X + arm2W;
            let barataX = areaSeguraX + 50; // Centraliza um pouco na área segura
            
            // Posição Y alta no ar (acima do chao e acima de um pulo)
            let barataY = FLOOR_Y - 200; 
            
            // Adiciona a barata voadora com tipo 'flying' e patrulha curta
            flyingEnemies.push(new Enemy(barataX, barataY, 80, 'flying'));
        }
    }

    // ... (restante da lógica de NPC e finishLine permanece inalterada)

    return {
        bgImage: backgroundToUse,
        platforms: platforms,
        items: items,
        enemies: enemies,
        flyingEnemies: flyingEnemies, // Retorna a lista de inimigos voadores
        npc: npc, 
        finishLine: { x: levelLength, y: FLOOR_Y - 300, width: 120, height: 300 },
        timeLimit: 60 + (levelNumber * 20) 
    };
}
