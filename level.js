const FLOOR_Y = 580; 

function generateLevel(levelNumber) {
    const levelLength = 2500 + (levelNumber * 800); 
    
    // COMO MUDAR OS FUNDOS:
    // O jogo verifica em qual nível você está e escolhe o nome do ficheiro da imagem!
    let backgroundToUse = 'assets/sprites/fundo.jpg'; // Fundo Padrão
    
    if (levelNumber >= 4 && levelNumber <= 7) {
        // Para usar isso, guarde uma imagem chamada "fundo2.jpg" na pasta de sprites!
        // backgroundToUse = 'assets/sprites/fundo2.jpg'; 
    } else if (levelNumber >= 8) {
        // backgroundToUse = 'assets/sprites/fundo3.jpg';
    }
    
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

        // COMO COLOCAR MAIS INIMIGOS:
        // Math.random() gera um número entre 0.0 e 1.0. 
        // Se você quiser MUITOS ratos, mude o 0.2 inicial para 0.6 ou 0.8!
        let enemyChance = 0.2 + (levelNumber * 0.12); 
        
        if (Math.random() < enemyChance && gap > 120) {
            enemies.push(new Enemy(currentX - gap + 20, FLOOR_Y - 40, gap - 40));
            // Quer ainda mais ratos? Descomente a linha de baixo para criar DOIS ratos por buraco!
            // enemies.push(new Enemy(currentX - gap + 50, FLOOR_Y - 40, gap - 40));
        }

        currentX += armW;
    }

    return {
        bgImage: backgroundToUse, // Envia o nome da imagem para o game.js
        platforms: platforms,
        items: items,
        enemies: enemies,
        finishLine: { x: levelLength, y: FLOOR_Y - 300, width: 120, height: 300 },
        timeLimit: 60 + (levelNumber * 25) 
    };
}
