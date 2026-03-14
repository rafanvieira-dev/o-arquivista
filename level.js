const FLOOR_Y = 560; 

function generateLevel(levelNumber) {
    // Largura visual exata do cenário após o corte no ecrã 4:3
    const bgW = 941; 
    const numChunks = 2 + levelNumber; // Vai adicionando mais frames ao longo das fases
    const levelLength = numChunks * bgW; 
    
    let backgroundToUse = `assets/sprites/fundo${levelNumber}.png`;
    
    let platforms = [{ x: 0, y: FLOOR_Y, width: levelLength + 800, height: 40, type: 'chao_invisivel' }];
    let items = [];
    let enemies = [];

    // LÓGICA DE DISTRIBUIÇÃO SEGURA (NUNCA nas divisas das imagens)
    for (let i = 0; i < numChunks; i++) {
        let chunkStart = i * bgW;

        // Armário 1: No meio-início do frame (aos 250px)
        let arm1X = chunkStart + 250;
        let arm1W = 120 + Math.random() * (20 + levelNumber * 10);
        let arm1H = 80 + Math.random() * (30 + levelNumber * 15); 
        platforms.push({ x: arm1X, y: FLOOR_Y - arm1H, width: arm1W, height: arm1H, type: 'armario' });

        let docSize = 70;
        if (Math.random() > 0.3) {
            items.push({ x: arm1X + (arm1W/2) - (docSize/2), y: FLOOR_Y - arm1H - docSize - 5, width: docSize, height: docSize, collected: false });
        }

        // Rato solto no chão no espaço morto do meio
        let enemyChance = 0.2 + (levelNumber * 0.1); 
        if (Math.random() < enemyChance) {
            enemies.push(new Enemy(chunkStart + 450, FLOOR_Y - 40, 100));
        }

        // Armário 2: No meio-fim do frame (aos 650px)
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
