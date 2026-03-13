const levelData = {
    platforms: [
        // Chão (Y=550) - Base de tudo
        { x: 0, y: 550, width: 4000, height: 50, type: 'chao' }, 
        
        // ZONA 1: Objetos com alturas variadas (Y + Height sempre = 550)
        { x: 400, y: 430, width: 180, height: 120, type: 'armario' }, // Médio
        { x: 800, y: 470, width: 150, height: 80, type: 'armario' },  // Baixo
        { x: 1100, y: 350, width: 120, height: 200, type: 'escada' }, // Escada
        
        // ZONA 2: Estruturas no ar e armários altos
        { x: 1400, y: 250, width: 140, height: 300, type: 'armario' }, 
        { x: 1650, y: 320, width: 300, height: 40, type: 'andaime' },  
        { x: 2100, y: 150, width: 100, height: 400, type: 'escada' },  
        
        // ZONA 3: Reta final
        { x: 2600, y: 400, width: 250, height: 150, type: 'andaime' },
        { x: 3100, y: 300, width: 140, height: 250, type: 'armario' },
        { x: 3500, y: 480, width: 200, height: 70, type: 'mesa' }
    ],
    items: [
        { x: 470, y: 380, width: 35, height: 35, collected: false },
        { x: 850, y: 420, width: 35, height: 35, collected: false },
        { x: 1450, y: 200, width: 35, height: 35, collected: false },
        { x: 1750, y: 270, width: 35, height: 35, collected: false },
        { x: 2130, y: 100, width: 35, height: 35, collected: false },
        { x: 3150, y: 250, width: 35, height: 35, collected: false }
    ],
    finishLine: { x: 3850, y: 450, width: 60, height: 100 }
};
