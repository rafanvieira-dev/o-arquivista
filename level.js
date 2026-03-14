// A linha exata da madeira
const FLOOR_Y = 560; 

function generateLevel(levelNumber) {
    // Cada nível fica 800 pixels maior
    const levelLength = 2000 + (levelNumber * 800); 
    
    let platforms = [
        { x: 0, y: FLOOR_Y, width: levelLength + 800, height: 40, type: 'chao_invisivel' }
    ];
    let items = [];
    let enemies = [];

    let currentX = 400;

    // Gerador Procedural: Vai colocando armários e itens até chegar ao fim da fase
    while (currentX < levelLength - 500) {
        // Distância aleatória entre armários (espaço para pular)
        let gap = 150 + Math.random() * 200;
        currentX += gap;

        // Tamanho aleatório do armário
        let armW = 150 + Math.random() * 100;
        let armH = 100 + Math.random() * 150;

        platforms.push({ x: currentX, y: FLOOR_Y - armH, width: armW, height: armH, type: 'armario' });

        // Gera Documentos em cima dos armários (mais frequente em níveis altos)
        if (Math.random() > 0.2) {
            items.push({ x: currentX + (armW/2) - 20, y: FLOOR_Y - armH - 45, width: 40, height: 40, collected: false });
        }

        // Gera Ratos no chão, entre os armários (Aumenta a chance a cada nível)
        let enemyChance = 0.2 + (levelNumber * 0.05); // Nível 10 = muitos ratos!
        if (Math.random() < enemyChance) {
            enemies.push(new Enemy(currentX - gap + 20, FLOOR_Y - 30, gap - 40));
        }

        currentX += armW;
    }

    return {
        platforms: platforms,
        items: items,
        enemies: enemies,
        finishLine: { x: levelLength, y: FLOOR_Y - 300, width: 100, height: 300 },
        // Dá mais tempo de acordo com o tamanho do nível
        timeLimit: 60 + (levelNumber * 20) 
    };
}
