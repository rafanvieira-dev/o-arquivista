const FLOOR_Y = 560; 

function generateLevel(levelNumber) {
    const bgW = 941; 
    const numChunks = 2 + levelNumber; 
    const levelLength = numChunks * bgW; 
    
    let backgroundToUse = `assets/sprites/fundo${levelNumber}.png`;
    
    let platforms = [{ x: 0, y: FLOOR_Y, width: levelLength + 800, height: 40, type: 'chao_invisivel' }];
    let items = [];
    let enemies = [];

    for (let i = 0; i < numChunks; i++) {
        let chunkStart = i * bgW;

        let arm1X = chunkStart + 250;
        let arm1W = 120 + Math.random() * (20 + levelNumber * 10);
        let arm1H = 80 + Math.random() * (30 + levelNumber * 15); 
        platforms.push({ x: arm1X, y: FLOOR_Y - arm1H, width: arm1W, height: arm1H, type: 'armario' });

        let docSize = 70;
        if (Math.random() > 0.3) {
            items.push({ x: arm1X + (arm1W/2) - (docSize/2), y: FLOOR_Y - arm1H - docSize - 5, width: docSize, height: docSize, collected: false });
        }

        let enemyChance = 0.2 + (levelNumber * 0.1); 
        if (Math.random() < enemyChance) {
            enemies.push(new Enemy(chunkStart + 450, FLOOR_Y - 40, 100));
        }

        let arm2X = chunkStart + 650;
        let arm2W = 120 + Math.random() * (30 + levelNumber * 10);
        let arm2H = 90 + Math.random() * (30 + levelNumber * 15);
        platforms.push({ x: arm2X, y: FLOOR_Y - arm2H, width: arm2W, height: arm2H, type: 'armario' });
    }

    let npcType;
    let mod = levelNumber % 3;
    if (mod === 1) npcType = 'flavio';
    else if (mod === 2) npcType = 'rosale';
    else npcType = 'eliezer';

    // A MÁGICA AQUI: O portal (finishLine) começa em 'levelLength' e tem 120 de largura. 
    // Colocamos o NPC no 'levelLength + 160' para ele ficar perfeitamente à espera DEPOIS da porta!
    let npc = { type: npcType, x: levelLength + 160, y: FLOOR_Y };

    return {
        bgImage: backgroundToUse,
        platforms: platforms,
        items: items,
        enemies: enemies,
        npc: npc, 
        finishLine: { x: levelLength, y: FLOOR_Y - 300, width: 120, height: 300 },
        timeLimit: 60 + (levelNumber * 20) 
    };
}
