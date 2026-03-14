const FLOOR_Y = 560; 

function generateLevel(levelNumber) {
    // bgW é aproximadamente a largura do fundo na tela após o corte
    const bgW = 941; 
    const numChunks = 2 + levelNumber; // O tamanho da fase aumenta com os níveis
    const levelLength = numChunks * bgW; 
    
    let backgroundToUse = `assets/sprites/fundo${levelNumber}.png`;
    
    let platforms = [{ x: 0, y: FLOOR_Y, width: levelLength + 800, height: 40, type: 'chao_invisivel' }];
    let items = [];
    let enemies = [];

    // LÓGICA NOVA: Para cada frame de cenário, colocamos os armários partindo de pontos fixos no meio!
    for (let i = 0; i < numChunks; i++) {
        let chunkStart = i * bgW;

        // ARMÁRIO 1: Começa SEMPRE aos 250px após o início do frame (Longe das divisas)
        let arm1X = chunkStart + 250;
        let arm1W = 120 + Math.random() * (20 + levelNumber * 10);
        let arm1H = 80 + Math.random() * (30 + levelNumber * 15); // Apenas altura e largura mudam
        platforms.push({ x: arm1X, y: FLOOR_Y - arm1H, width: arm1W, height: arm1H, type: 'armario' });

        // Documento no Armário 1
        let docSize = 70;
        if (Math.random() > 0.3) {
            items.push({ x: arm1X + (arm1W/2) - (docSize/2), y: FLOOR_Y - arm1H - docSize - 5, width: docSize, height: docSize, collected: false });
        }

        // Inimigo no chão, no espaço livre entre os armários
        let enemyChance = 0.2 + (levelNumber * 0.1); 
        if (Math.random() < enemyChance) {
            enemies.push(new Enemy(chunkStart + 450, FLOOR_Y - 40, 100));
        }

        // ARMÁRIO 2: Começa SEMPRE aos 650px após o início do frame (Nunca na divisa)
        let arm2X = chunkStart + 650;
        let arm2W = 120 + Math.random() * (30 + levelNumber * 10);
        let arm2H = 90 + Math.random() * (30 + levelNumber * 15);
        platforms.push({ x: arm2X, y: FLOOR_Y - arm2H, width: arm2W, height: arm2H, type: 'armario' });
    }

    return {
        bgImage: backgroundToUse,
        platforms: platforms,
        items: items,
        enemies: enemies,
        finishLine: { x: levelLength, y: FLOOR_Y - 300, width: 120, height: 300 },
        timeLimit: 60 + (levelNumber * 20) 
    };
}
