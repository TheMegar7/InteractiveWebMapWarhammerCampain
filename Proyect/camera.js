
class Camera {
    ///Este escrip de camara esta echa para una situación en la que solo se navega en horizontal, pero hay que expandirla para una navegación vertical.
    constructor(target) {
        this.target = target;
        
        this.smoothingSpeed = 5;

        // shake no se va a usar de momento
        this.shakingValue = Vector2.Zero();
        this.shakingTime = 0;
        this.shakingSpeed = 40;
        this.shakingSize = 5;
        this.shakeInitRandom = Vector2.Zero();

        this.position = Vector2.Zero();
        this.cleanPos = Vector2.Zero();
        this.targetPosition = Vector2.Zero();

        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;
    }

    UpdateBounds() {
        this.maxX = Math.max(0, sceneLimits.width - canvas.width);
        this.maxY = Math.max(0, sceneLimits.height - canvas.height);
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

    OnResize() {
        this.UpdateBounds();

        if (this.position.x < this.minX) this.position.x = this.minX;
        if (this.position.x > this.maxX) this.position.x = this.maxX;
        if (this.position.y < this.minY) this.position.y = this.minY;
        if (this.position.y > this.maxY) this.position.y = this.maxY;
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
    }

    PreDraw(ctx) {
        ctx.save();

        ctx.translate(-this.position.x, -this.position.y);
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