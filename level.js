const levelData = {
    platforms: [
        // Chão do Arquivo (Vai do início ao fim do mega nível)
        { x: 0, y: 550, width: 4000, height: 50, color: '#141d26', type: 'chao' }, 
        
        // Zona 1 (Introdução)
        { x: 250, y: 450, width: 200, height: 20, color: '#4a3b2c', type: 'mesa' },
        { x: 600, y: 350, width: 140, height: 200, color: '#293745', type: 'armario' },
        { x: 900, y: 420, width: 220, height: 20, color: '#4a3b2c', type: 'mesa' },
        
        // Zona 2 (Mais Verticalidade)
        { x: 1250, y: 280, width: 140, height: 270, color: '#293745', type: 'armario' },
        { x: 1500, y: 180, width: 220, height: 40, color: '#1c2630', type: 'andaime' },
        { x: 1750, y: 250, width: 80, height: 300, color: '#3d3024', type: 'escada' },
        
        // Zona 3 (Novos Desafios)
        { x: 2050, y: 380, width: 140, height: 170, color: '#293745', type: 'armario' },
        { x: 2350, y: 280, width: 220, height: 40, color: '#1c2630', type: 'andaime' },
        { x: 2650, y: 150, width: 80, height: 400, color: '#3d3024', type: 'escada' },
        { x: 2850, y: 400, width: 200, height: 20, color: '#4a3b2c', type: 'mesa' },
        
        // Zona 4 (Reta Final)
        { x: 3200, y: 280, width: 140, height: 270, color: '#293745', type: 'armario' },
        { x: 3500, y: 450, width: 200, height: 20, color: '#4a3b2c', type: 'mesa' }
    ],
    items: [
        { x: 340, y: 410, width: 25, height: 25, collected: false },
        { x: 650, y: 310, width: 25, height: 25, collected: false },
        { x: 1000, y: 380, width: 25, height: 25, collected: false },
        { x: 1310, y: 240, width: 25, height: 25, collected: false },
        { x: 1600, y: 140, width: 25, height: 25, collected: false },
        { x: 2100, y: 340, width: 25, height: 25, collected: false },
        { x: 2450, y: 240, width: 25, height: 25, collected: false },
        { x: 2950, y: 360, width: 25, height: 25, collected: false },
        { x: 3250, y: 240, width: 25, height: 25, collected: false },
        { x: 3600, y: 410, width: 25, height: 25, collected: false }
    ],
    finishLine: { x: 3850, y: 450, width: 50, height: 100 } // Porta bem mais longe!
};
