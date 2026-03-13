class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        this.width = 64;  
        this.height = 85; 
        
        // Físicas (Mais ágeis e menos "flutuantes")
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;       
        this.runSpeed = 8;    
        this.jumpForce = -15; 
        this.gravity = 0.8;   
        this.grounded = false;
        
        this.facing = 1; 

        this.image = new Image();
        this.image.src = 'assets/sprites/arquivista.png'; 
        
        this.frameX = 0; 
        this.frameY = 0; 
        this.maxFrame = 3; 
        
        this.fps = 8; 
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    update(keys, deltaTime) {
        let currentSpeed = keys.shift ? this.runSpeed : this.speed;
        
        if (keys.left) {
            this.vx = -currentSpeed;
            this.facing = -1;
        } else if (keys.right) {
            this.vx = currentSpeed;
            this.facing = 1; 
        } else {
            this.vx = 0;
        }

        if (keys.up && this.grounded) {
            this.vy = this.jumpForce;
            this.grounded = false;
        }

        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        this.grounded = false;

        if (!this.grounded && this.vy !== 0) {
            this.frameY = 2; 
            this.maxFrame = 3;
        } else if (this.vx !== 0) {
            this.frameY = 1; 
            this.maxFrame = 3;
        } else {
            this.frameY = 0; 
            this.maxFrame = 2; 
        }

        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltaTime;
        }
    }

    draw(ctx, cameraX) {
        if (this.image.width === 0) return;

        let sWidth = this.image.width / 4;  
        let sHeight = this.image.height / 3; 

        let cropX = this.frameX * sWidth;
        let cropY = this.frameY * sHeight;

        ctx.save();

        if (this.facing === -1) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.image, 
                cropX, cropY, sWidth, sHeight, 
                -(this.x - cameraX + this.width), this.y, this.width, this.height
            );
        } else {
            ctx.drawImage(
                this.image, 
                cropX, cropY, sWidth, sHeight, 
                this.x - cameraX, this.y, this.width, this.height
            );
        }

        ctx.restore();
    }
}
