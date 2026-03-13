const levelData = {
    platforms: [
        // Chão principal expandido
        { x: 0, y: 550, width: 5000, height: 100, type: 'chao' }, 
        
        // ZONA 1
        { x: 400, y: 400, width: 150, height: 150, type: 'armario' }, 
        { x: 750, y: 450, width: 250, height: 100, type: 'armario' }, 
        
        // ZONA 2
        { x: 1100, y: 300, width: 100, height: 250, type: 'escada' }, 
        { x: 1350, y: 350, width: 300, height: 40, type: 'andaime' }, 
        
        // ZONA 3
        { x: 1850, y: 250, width: 150, height: 300, type: 'armario' },
        { x: 2300, y: 350, width: 250, height: 40, type: 'andaime' },
        { x: 2800, y: 200, width: 100, height: 350, type: 'escada' },
        { x: 3200, y: 450, width: 200, height: 100, type: 'armario' }
    ],
    items: [
        // Documentos gigantes (50x50). Posição Y = Altura da plataforma - 50
        { x: 450, y: 350, width: 50, height: 50, collected: false }, 
        { x: 1125, y: 250, width: 50, height: 50, collected: false },
        { x: 1475, y: 300, width: 50, height: 50, collected: false },
        { x: 2400, y: 300, width: 50, height: 50, collected: false },
        { x: 3250, y: 400, width: 50, height: 50, collected: false }
    ],
    // Portal Final!
    finishLine: { x: 4000, y: 350, width: 80, height: 200 } 
};
