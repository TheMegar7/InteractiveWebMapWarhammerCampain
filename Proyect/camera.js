
class Camera {
    
    constructor(target) {
        this.target = target;
        
        this.smoothingSpeed = 5;
        
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;

        this.zoom = 1;
        this.minZoom = 0.30;
        this.maxZoom = 1.00;

        // shake no se va a usar de momento
        this.shakingValue = Vector2.Zero();
        this.shakingTime = 0;
        this.shakingSpeed = 40;
        this.shakingSize = 5;
        this.shakeInitRandom = Vector2.Zero();

        this.position = Vector2.Zero();
        this.cleanPos = Vector2.Zero();
        this.targetPosition = Vector2.Zero();

    }

    UpdateBounds() {
        const viewW = canvas.width / this.zoom;
        const viewH = canvas.height / this.zoom;

        this.maxX = Math.max(0, sceneLimits.width - viewW);
        this.maxY = Math.max(0, sceneLimits.height - viewH);
    }
    

    Start() {
        this.UpdateBounds();

        this.position.x = this.target.position.x - canvas.width / 2;
        this.position.y = this.target.position.y - canvas.height / 2;

        if (this.position.x < this.minX) this.position.x = this.minX;
        if (this.position.x > this.maxX) this.position.x = this.maxX;
        if (this.position.y < this.minY) this.position.y = this.minY;
        if (this.position.y > this.maxY) this.position.y = this.maxY;

        this.cleanPos.x = this.position.x;
        this.cleanPos.y = this.position.y;
    }

    Clamp() {
        if (this.position.x < this.minX) this.position.x = this.minX;
        if (this.position.x > this.maxX) this.position.x = this.maxX;
        if (this.position.y < this.minY) this.position.y = this.minY;
        if (this.position.y > this.maxY) this.position.y = this.maxY;
    }

    OnResize() {
        this.UpdateBounds();

        this.Clamp()
    }

    SetZoom(newZoom, screenX, screenY) {
        const oldZoom = this.zoom;

        // punto del mundo bajo el cursor antes del cambio
        const worldX = this.position.x + screenX / oldZoom;
        const worldY = this.position.y + screenY / oldZoom;

        this.zoom = newZoom;

        this.UpdateBounds();

        // mantiene el mismo world point bajo el cursor
        this.position.x = worldX - screenX / newZoom;
        this.position.y = worldY - screenY / newZoom;

        this.Clamp();
    }
    
    Update(deltaTime) {
        this.UpdateBounds();

        this.targetPosition.x = this.target.position.x - canvas.width / 2;
        this.targetPosition.y = this.target.position.y - canvas.height / 2;

        if (this.targetPosition.x < this.minX) this.targetPosition.x = this.minX;
        if (this.targetPosition.x > this.maxX) this.targetPosition.x = this.maxX;
        if (this.targetPosition.y < this.minY) this.targetPosition.y = this.minY;
        if (this.targetPosition.y > this.maxY) this.targetPosition.y = this.maxY;

        //AGITADO
        this.shakingValue.Set(0, 0);
        if (this.shakingTime > 0) {
            this.shakingTime -= deltaTime;

            this.shakingValue.x = Math.cos(this.shakeInitRandom.x + this.shakingTime * this.shakingSpeed) * this.shakingSize;
            this.shakingValue.y = Math.sin(this.shakeInitRandom.y + this.shakingTime * this.shakingSpeed) * this.shakingSize;
        }

        const smoothStep = this.smoothingSpeed * deltaTime;

        this.cleanPos.x += (this.targetPosition.x - this.position.x) * smoothStep;
        this.cleanPos.y += (this.targetPosition.y - this.position.y) * smoothStep;

        this.position.x += ((this.targetPosition.x - this.position.x) * smoothStep) + this.shakingValue.x;
        this.position.y += ((this.targetPosition.y - this.position.y) * smoothStep) + this.shakingValue.y;

        if (this.target.dragControlActive) {
            // follow instantáneo durante drag
            this.position.x = this.targetPosition.x;
            this.position.y = this.targetPosition.y;
            this.cleanPos.x = this.position.x;
            this.cleanPos.y = this.position.y;
            return;
        }
    }

    PreDraw(ctx) {
        ctx.save();

        ctx.setTransform(
            this.zoom, 0,
            0, this.zoom,
            -this.position.x * this.zoom,
            -this.position.y * this.zoom
        )
        //Esto lo usaba antes del zoom pero lo guardo por si el zoom explota
        //ctx.translate(-this.position.x, -this.position.y);
    }

    PostDraw(ctx) {
        ctx.restore();
    }

    Shake(time, speed, size) {
        this.shakingTime = time;
        this.shakingSpeed = speed;
        this.shakingSize = size;
        this.shakeInitRandom.Random();
    }

}