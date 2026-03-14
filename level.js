const FLOOR_Y = 560; 

function generateLevel(levelNumber) {
    const levelLength = 2500 + (levelNumber * 1000); 
    
    let platforms = [
        { x: 0, y: FLOOR_Y, width: levelLength + 800, height: 40, type: 'chao_invisivel' }
    ];
    let items = [];
    let enemies = [];

    let currentX = 400;

    while (currentX < levelLength - 500) {
        // Aumenta a distância (buracos maiores) conforme o nível sobe
        let gap = 120 + Math.random() * (100 + levelNumber * 15);
        currentX += gap;

        // Armários ficam mais altos conforme o nível sobe!
        let armW = 120 + Math.random() * 120;
        let armH = 80 + Math.random() * (80 + levelNumber * 15);

        platforms.push({ x: currentX, y: FLOOR_Y - armH, width: armW, height: armH, type: 'armario' });

        // Documentos maiores (60x60)
        let docSize = 60;
        if (Math.random() > 0.3) {
            items.push({ x: currentX + (armW/2) - (docSize/2), y: FLOOR_Y - armH - docSize - 5, width: docSize, height: docSize, collected: false });
        }

        // Mais ratos nas fases difíceis! O "enemyChance" cresce muito.
        let enemyChance = 0.3 + (levelNumber * 0.1); 
        if (Math.random() < enemyChance && gap > 100) {
            // Rato nasce no chão (FLOOR_Y - altura do rato [40])
            enemies.push(new Enemy(currentX - gap + 20, FLOOR_Y - 40, gap - 40));
        }

        currentX += armW;
    }

    return {
        platforms: platforms,
        items: items,
        enemies: enemies,
        finishLine: { x: levelLength, y: FLOOR_Y - 300, width: 100, height: 300 },
        timeLimit: 80 + (levelNumber * 30) // Mais tempo para níveis gigantes
    };
}
