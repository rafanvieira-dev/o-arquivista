const levelData = {
    platforms: [
        // Chão principal (A linha do chão é exatamente no Y = 550)
        { x: 0, y: 550, width: 5000, height: 100, type: 'chao' }, 
        
        // ARMÁRIOS (A base de todos toca perfeitamente no chão 550)
        { x: 400, y: 400, width: 150, height: 150, type: 'armario' }, // 400 + 150 = 550
        { x: 750, y: 450, width: 250, height: 100, type: 'armario' }, // 450 + 100 = 550
        { x: 1200, y: 300, width: 150, height: 250, type: 'armario' },// 300 + 250 = 550
        { x: 1600, y: 350, width: 200, height: 200, type: 'armario' },// 350 + 200 = 550
        { x: 2100, y: 400, width: 150, height: 150, type: 'armario' },// 400 + 150 = 550
        { x: 2500, y: 250, width: 150, height: 300, type: 'armario' },// 250 + 300 = 550
        { x: 3000, y: 450, width: 300, height: 100, type: 'armario' } // 450 + 100 = 550
    ],
    items: [
        // Documentos em cima de alguns armários
        { x: 450, y: 350, width: 50, height: 50, collected: false }, 
        { x: 1250, y: 250, width: 50, height: 50, collected: false },
        { x: 1650, y: 300, width: 50, height: 50, collected: false },
        { x: 2550, y: 200, width: 50, height: 50, collected: false },
        { x: 3100, y: 400, width: 50, height: 50, collected: false } 
    ],
    finishLine: { x: 3800, y: 350, width: 80, height: 200 } 
};
