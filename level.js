// Onde a madeira começa (ignorando o preto no fundo)
const FLOOR_Y = 560; 

const levelData = {
    platforms: [
        { x: 0, y: FLOOR_Y, width: 5000, height: 40, type: 'chao_invisivel' }, 
        
        // Obstáculos (Armários)
        { x: 500, y: FLOOR_Y - 100, width: 150, height: 100, type: 'armario' },
        { x: 900, y: FLOOR_Y - 180, width: 150, height: 180, type: 'armario' },
        { x: 1500, y: FLOOR_Y - 120, width: 200, height: 120, type: 'armario' },
        { x: 2200, y: FLOOR_Y - 250, width: 150, height: 250, type: 'armario' },
        { x: 3000, y: FLOOR_Y - 150, width: 250, height: 150, type: 'armario' }
    ],
    items: [
        { x: 550, y: FLOOR_Y - 140, width: 40, height: 40, collected: false },
        { x: 950, y: FLOOR_Y - 220, width: 40, height: 40, collected: false },
        { x: 2250, y: FLOOR_Y - 290, width: 40, height: 40, collected: false }
    ],
    // FINAL DA FASE: Chegue aqui para vencer!
    finishLine: { x: 4200, y: FLOOR_Y - 300, width: 120, height: 300 } 
};
