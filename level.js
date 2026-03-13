const levelData = {
    platforms: [
        // Chão principal (Y=550)
        { x: 0, y: 550, width: 4000, height: 50, type: 'chao' }, 
        
        // ARMÁRIOS DE VÁRIOS TAMANHOS (Sempre encostados no chão)
        { x: 400, y: 300, width: 120, height: 250, type: 'armario' }, // Alto e estreito
        { x: 750, y: 450, width: 220, height: 100, type: 'armario' }, // Baixo e largo
        { x: 1200, y: 350, width: 150, height: 200, type: 'armario' }, // Proporção média
        
        // ZONA 2: Estruturas elevadas
        { x: 1550, y: 320, width: 300, height: 40, type: 'andaime' }, 
        { x: 2000, y: 150, width: 100, height: 400, type: 'escada' },
        { x: 2400, y: 380, width: 140, height: 170, type: 'armario' },
        
        // ZONA 3: Desafio final
        { x: 2800, y: 250, width: 250, height: 40, type: 'andaime' },
        { x: 3300, y: 480, width: 200, height: 70, type: 'mesa' }
    ],
    items: [
        { x: 450, y: 250, width: 35, height: 35, collected: false },
        { x: 850, y: 400, width: 35, height: 35, collected: false },
        { x: 1250, y: 300, width: 35, height: 35, collected: false },
        { x: 3350, y: 430, width: 35, height: 35, collected: false }
    ],
    finishLine: { x: 3850, y: 450, width: 60, height: 100 }
};
