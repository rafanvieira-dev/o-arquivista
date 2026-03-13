// Estrutura do mapa da fase 1
const levelData = {
    platforms: [
        { x: 0, y: 550, width: 2000, height: 50, color: '#5c4033' }, // Chão principal
        { x: 300, y: 450, width: 150, height: 20, color: '#8b5a2b' }, // Estante 1
        { x: 550, y: 350, width: 200, height: 20, color: '#8b5a2b' }, // Estante 2
        { x: 200, y: 250, width: 150, height: 20, color: '#8b5a2b' }, // Estante 3
        { x: 850, y: 400, width: 150, height: 20, color: '#8b5a2b' }, // Estante 4
        { x: 1100, y: 300, width: 200, height: 20, color: '#8b5a2b' }, // Estante 5
        { x: 1400, y: 200, width: 150, height: 20, color: '#8b5a2b' }  // Estante 6
    ],
    items: [
        { x: 350, y: 410, width: 20, height: 20, collected: false }, // Documento raro
        { x: 600, y: 310, width: 20, height: 20, collected: false },
        { x: 250, y: 210, width: 20, height: 20, collected: false },
        { x: 1150, y: 260, width: 20, height: 20, collected: false }
    ],
    finishLine: { x: 1800, y: 450, width: 50, height: 100 } // Porta final
};
