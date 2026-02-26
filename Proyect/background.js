
class Background {
    constructor(width, height, cellSize,) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        
    }
    Update(deltaTime){
        
    }

    Draw(ctx) {
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 2;

        const startX = Math.floor(camera.position.x / this.cellSize) * this.cellSize;
        const endX = camera.position.x + canvas.width;

        const startY = Math.floor(camera.position.y / this.cellSize) * this.cellSize;
        const endY = camera.position.y + canvas.height;

        // horizontales visibles
        for (let y = startY; y <= endY; y += this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(camera.position.x, y);
            ctx.lineTo(camera.position.x + canvas.width, y);
            ctx.stroke();
        }

        // verticales visibles
        for (let x = startX; x <= endX; x += this.cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, camera.position.y);
            ctx.lineTo(x, camera.position.y + canvas.height, x);
            ctx.stroke();
        }
    }

}