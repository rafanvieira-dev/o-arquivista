// Onde a madeira começa visualmente
const FLOOR_Y = 540; 

const levelData = {
    platforms: [
        { x: 0, y: FLOOR_Y, width: 5000, height: 60, type: 'chao_invisivel' }, 
        
        // Armários espalhados
        { x: 500, y: FLOOR_Y - 100, width: 150, height: 100, type: 'armario' },
        { x: 900, y: FLOOR_Y - 180, width: 150, height: 180, type: 'armario' },
        { x: 1400, y: FLOOR_Y - 120, width: 200, height: 120, type: 'armario' },
        { x: 2000, y: FLOOR_Y - 220, width: 150, height: 220, type: 'armario' },
        { x: 2800, y: FLOOR_Y - 150, width: 200, height: 150, type: 'armario' }
    ],
    items: [
        { x: 550, y: FLOOR_Y - 140, width: 40, height: 40, collected: false },
        { x: 950, y: FLOOR_Y - 220, width: 40, height: 40, collected: false },
        { x: 2050, y: FLOOR_Y - 260, width: 40, height: 40, collected: false }
    ],
    // O FINAL DA FASE: Uma zona de vitória no final do corredor
    finishLine: { x: 4200, y: FLOOR_Y - 200, width: 100, height: 200 } 
};
