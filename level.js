// A linha exata onde a madeira do seu novo fundo começa
const FLOOR_Y = 480;

const levelData = {
    platforms: [
        // Chão invisível (apenas para a física não deixar o boneco cair)
        { x: 0, y: FLOOR_Y, width: 5000, height: 120, type: 'chao_invisivel' }, 
        
        // Armários perfeitamente grudados na madeira (Y = FLOOR_Y - altura)
        { x: 400, y: FLOOR_Y - 100, width: 150, height: 100, type: 'armario' },
        { x: 750, y: FLOOR_Y - 150, width: 200, height: 150, type: 'armario' },
        { x: 1200, y: FLOOR_Y - 200, width: 150, height: 200, type: 'armario' },
        { x: 1650, y: FLOOR_Y - 100, width: 250, height: 100, type: 'armario' },
        { x: 2100, y: FLOOR_Y - 250, width: 150, height: 250, type: 'armario' },
        { x: 2500, y: FLOOR_Y - 120, width: 200, height: 120, type: 'armario' },
        { x: 3000, y: FLOOR_Y - 220, width: 300, height: 220, type: 'armario' }
    ],
    items: [
        // Documentos em cima dos armários
        { x: 450, y: FLOOR_Y - 100 - 40, width: 40, height: 40, collected: false }, 
        { x: 800, y: FLOOR_Y - 150 - 40, width: 40, height: 40, collected: false },
        { x: 1250, y: FLOOR_Y - 200 - 40, width: 40, height: 40, collected: false },
        { x: 2150, y: FLOOR_Y - 250 - 40, width: 40, height: 40, collected: false },
        { x: 3100, y: FLOOR_Y - 220 - 40, width: 40, height: 40, collected: false }
    ],
    finishLine: { x: 3800, y: FLOOR_Y - 150, width: 80, height: 150 } 
};
