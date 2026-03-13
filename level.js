// A linha do chão. Todos os objetos vão usar esta linha como base!
const FLOOR_Y = 500;

const levelData = {
    platforms: [
        // O chão principal
        { x: 0, y: FLOOR_Y, width: 5000, height: 100, type: 'chao' }, 
        
        // APENAS ARMÁRIOS: O Y é sempre "FLOOR_Y - altura". Isto cola-os no chão perfeitamente!
        { x: 400, y: FLOOR_Y - 100, width: 150, height: 100, type: 'armario' }, // Pequeno
        { x: 700, y: FLOOR_Y - 150, width: 200, height: 150, type: 'armario' }, // Médio
        { x: 1050, y: FLOOR_Y - 80, width: 120, height: 80, type: 'armario' },  // Muito baixo
        { x: 1400, y: FLOOR_Y - 200, width: 180, height: 200, type: 'armario' },// Alto
        { x: 1800, y: FLOOR_Y - 120, width: 150, height: 120, type: 'armario' },
        { x: 2200, y: FLOOR_Y - 250, width: 200, height: 250, type: 'armario' },// Gigante
        { x: 2700, y: FLOOR_Y - 100, width: 300, height: 100, type: 'armario' },// Largo
        { x: 3200, y: FLOOR_Y - 180, width: 150, height: 180, type: 'armario' }
    ],
    items: [
        // Documentos colocados em cima dos armários (Y = Altura do armário - altura do item)
        { x: 450, y: FLOOR_Y - 100 - 40, width: 40, height: 40, collected: false }, 
        { x: 750, y: FLOOR_Y - 150 - 40, width: 40, height: 40, collected: false },
        { x: 1450, y: FLOOR_Y - 200 - 40, width: 40, height: 40, collected: false },
        { x: 2250, y: FLOOR_Y - 250 - 40, width: 40, height: 40, collected: false },
        { x: 2800, y: FLOOR_Y - 100 - 40, width: 40, height: 40, collected: false }
    ],
    finishLine: { x: 3800, y: FLOOR_Y - 150, width: 80, height: 150 } 
};
