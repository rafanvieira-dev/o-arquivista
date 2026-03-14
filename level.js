const FLOOR_Y = 560; 

function generateLevel(levelNumber) {
    const levelLength = 2500 + (levelNumber * 800); 
    
    // CARREGA O FICHEIRO EXATO DA FASE ATUAL!
    let backgroundToUse = `assets/sprites/fundo${levelNumber}.png`;
    
    let platforms = [{ x: 0, y: FLOOR_Y, width: levelLength + 800, height: 40, type: 'chao_invisivel' }];
    let items = [];
    let enemies = [];
    let currentX = 400;

    while (currentX < levelLength - 600) {
        let gap = 120 + Math.random() * (100 + levelNumber * 18);
        currentX += gap;

        let armW = 130 + Math.random() * 100;
        let armH = 80 + Math.random() * (80 + levelNumber * 20);

        platforms.push({ x: currentX, y: FLOOR_Y - armH, width: armW, height: armH, type: 'armario' });

        let docSize = 70;
        if (Math.random() > 0.2) {
            items.push({ x: currentX + (armW/2) - (docSize/2), y: FLOOR_Y - armH - docSize - 5, width: docSize, height: docSize, collected: false });
        }

        let enemyChance = 0.2 + (levelNumber * 0.12); 
        if (Math.random() < enemyChance && gap > 120) {
            enemies.push(new Enemy(currentX - gap + 20, FLOOR_Y - 40, gap - 40));
        }

        currentX += armW;
    }

    return {
        bgImage: backgroundToUse, // Passa a imagem correta para o motor do jogo
        platforms: platforms,
        items: items,
        enemies: enemies,
        finishLine: { x: levelLength, y: FLOOR_Y - 300, width: 120, height: 300 },
        timeLimit: 60 + (levelNumber * 25) 
    };
}
