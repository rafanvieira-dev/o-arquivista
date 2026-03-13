// ... (mantenha o carregamento de imagens e variáveis iniciais)

function resolvePhysics() {
    // 1. Movimento Horizontal e Colisão Lateral
    player.x += player.vx;
    levelData.platforms.forEach(plat => {
        if (checkRectOverlap(player, plat)) {
            if (player.vx > 0) player.x = plat.x - player.width;
            if (player.vx < 0) player.x = plat.x + plat.width;
        }
    });

    // 2. Movimento Vertical e Chão
    player.y += player.vy;
    player.grounded = false;
    levelData.platforms.forEach(plat => {
        if (checkRectOverlap(player, plat)) {
            if (player.vy > 0) { // Caindo
                player.y = plat.y - player.height;
                player.vy = 0;
                player.grounded = true;
            } else if (player.vy < 0) { // Batendo no teto
                player.y = plat.y + plat.height;
                player.vy = 0;
            }
        }
    });
}

function checkRectOverlap(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
           a.y < b.y + b.height && a.y + a.height > b.y;
}

function gameLoop(timeStamp) {
    let deltaTime = timeStamp - (lastTime || timeStamp);
    lastTime = timeStamp;

    if (gameState === 'PLAYING') {
        player.update(keys, deltaTime);
        resolvePhysics(); // RESOLUÇÃO DE FÍSICA SEPARADA
        
        // Atualiza animação baseado no estado real
        if (!player.grounded) player.frameY = 2;
        else if (player.vx !== 0) player.frameY = 1;
        else player.frameY = 0;

        // Desenho dos obstáculos com leve sobreposição no chão para não "voar"
        cameraX = Math.max(0, Math.min(player.x - 350, 3200));
        ctx.clearRect(0, 0, 800, 600);
        ctx.drawImage(bgImage, -(cameraX * 0.2 % 800), 0, 800, 600);

        levelData.platforms.forEach(p => {
            let img = p.type === 'armario' ? armarioImg : p.type === 'escada' ? escadaImg : p.type === 'andaime' ? andaimeImg : chaoImg;
            // Se for armário, desenhamos 5px abaixo para "entrar" no chão e evitar o efeito de voar
            let offset = p.type === 'armario' ? 5 : 0; 
            
            if (p.type === 'chao') {
                for(let i=0; i<p.width; i+=200) ctx.drawImage(chaoImg, p.x+i-cameraX, p.y, 200, p.height);
            } else {
                ctx.drawImage(img, p.x - cameraX, p.y + offset, p.width, p.height);
            }
        });
        
        // ... (resto do loop: itens, inimigos e player.draw)
        enemiesList.forEach(e => { e.update(deltaTime); e.draw(ctx, cameraX); });
        player.draw(ctx, cameraX);
    }
    requestAnimationFrame(gameLoop);
}
