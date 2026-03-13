const levelData = {
    platforms: [
        // Chão (O Y é 550)
        { x: 0, y: 550, width: 4000, height: 50, type: 'chao' }, 
        
        // ZONA 1: Obstáculos com alturas diferentes começando no chão (Y + Altura = 550)
        { x: 400, y: 430, width: 180, height: 120, type: 'armario' }, // Médio
        { x: 800, y: 480, width: 150, height: 70, type: 'armario' },  // Baixo
        { x: 1100, y: 400, width: 140, height: 150, type: 'escada' }, // Escada média
        
        // ZONA 2: Estruturas flutuantes (Andaimes) e armários altos
        { x: 1400, y: 250, width: 140, height: 300, type: 'armario' }, // Muito alto
        { x: 1650, y: 320, width: 300, height: 40, type: 'andaime' },  // Plataforma aérea
        { x: 2100, y: 200, width: 100, height: 350, type: 'escada' },  // Escada gigante
        
        // ZONA 3: Desafio Final
        { x: 2600, y: 420, width: 250, height: 130, type: 'andaime' },
        { x: 3100, y: 350, width: 140, height: 200, type: 'armario' },
        { x: 3500, y: 490, width: 200, height: 60, type: 'mesa' }
    ],
    items: [
        { x: 470, y: 390, width: 35, height: 35, collected: false },
        { x: 850, y: 440, width: 35, height: 35, collected: false },
        { x: 1450, y: 210, width: 35, height: 35, collected: false },
        { x: 1750, y: 280, width: 35, height: 35, collected: false },
        { x: 2130, y: 160, width: 35, height: 35, collected: false },
        { x: 3150, y: 310, width: 35, height: 35, collected: false }
    ],
    finishLine: { x: 3850, y: 450, width: 60, height: 100 }
};
