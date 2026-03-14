const FLOOR_Y = 560; // Linha da madeira ajustada

function generateLevel(levelNumber) {
    // Níveis ficam enormes conforme você avança (até 10.000 pixels de comprimento)
    const levelLength = 2500 + (levelNumber * 800); 
    
    let platforms = [
        { x: 0, y: FLOOR_Y, width: levelLength + 800, height: 40, type: 'chao_invisivel' }
    ];
    let items = [];
    let enemies = [];

    let currentX = 400;

    // Construção Procedural do cenário
    while (currentX < levelLength - 600) {
        // O buraco (distância) entre armários aumenta a cada fase
        let gap = 120 + Math.random() * (100 + levelNumber * 18);
        currentX += gap;

        // Armários ficam mais altos e largos
        let armW = 130 + Math.random() * 100;
        let armH = 80 + Math.random() * (80 + levelNumber * 20);

        platforms.push({ x: currentX, y: FLOOR_Y - armH, width: armW, height: armH, type: 'armario' });

        // Documentos Maiores (70x70) no topo dos armários
        let docSize = 70;
        if (Math.random() > 0.2) {
            items.push({ x: currentX + (armW/2) - (docSize/2), y: FLOOR_Y - armH - docSize - 5, width: docSize, height: docSize, collected: false });
        }

        // Infestação de Ratos nas fases altas!
        let enemyChance = 0.2 + (levelNumber * 0.12); 
        if (Math.random() < enemyChance && gap > 120) {
            enemies.push(new Enemy(currentX - gap + 20, FLOOR_Y - 40, gap - 40));
        }

        currentX += armW;
    }

    return {
        platforms: platforms,
        items: items,
        enemies: enemies,
        finishLine: { x: levelLength, y: FLOOR_Y - 300, width: 120, height: 300 },
        timeLimit: 60 + (levelNumber * 25) 
    };
}
