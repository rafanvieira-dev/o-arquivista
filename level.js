// Estrutura do mapa combinando com o fundo do Arquivo Central
const levelData = {
    platforms: [
        // Chão do Arquivo (Tom escuro azulado para combinar com as sombras)
        { x: 0, y: 550, width: 2000, height: 50, color: '#141d26' }, 
        
        // Mesas de Leitura (Madeira escura iluminada)
        { x: 250, y: 450, width: 200, height: 20, color: '#4a3b2c' },
        { x: 900, y: 420, width: 220, height: 20, color: '#4a3b2c' },
        
        // Arquivos de Aço Metálicos (Azul/Cinza escuro)
        { x: 600, y: 350, width: 160, height: 30, color: '#293745' },
        { x: 1250, y: 280, width: 140, height: 30, color: '#293745' },
        
        // Prateleiras Superiores / Dutos (Metal escuro)
        { x: 1500, y: 180, width: 150, height: 15, color: '#1c2630' },
        
        // Pilha de caixas antigas
        { x: 1650, y: 380, width: 80, height: 20, color: '#3d3024' }
    ],
    items: [
        { x: 340, y: 410, width: 20, height: 20, collected: false },  // Doc na Mesa 1
        { x: 670, y: 310, width: 20, height: 20, collected: false },  // Doc no Arquivo de Aço
        { x: 1000, y: 380, width: 20, height: 20, collected: false }, // Doc na Mesa 2
        { x: 1310, y: 240, width: 20, height: 20, collected: false }  // Doc no Arquivo Alto
    ],
    finishLine: { x: 1850, y: 450, width: 50, height: 100 } // Porta final
};
