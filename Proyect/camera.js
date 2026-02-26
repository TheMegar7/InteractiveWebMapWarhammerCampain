
class Camera {
    ///Este escrip de camara esta echa para una situación en la que solo se navega en horizontal, pero hay que expandirla para una navegación vertical.
    constructor(target) {
        this.target = target;

        this.minX = -48;
        this.maxX = (sceneLimits.width + 48) - canvas.width;
        
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
    }

    Start() {
        this.position.x = this.target.position.x - canvas.width / 2;
        this.position.y = 0;

        this.cleanPos.x = this.position.x;
        this.cleanPos.y = this.position.y;
    }

    Update(deltaTime) {
        this.targetPosition.x = this.target.position.x - canvas.width / 2;
        this.targetPosition.y = 0;

        if (this.targetPosition.x < this.minX)
            this.targetPosition.x = this.minX;
        
        if (this.targetPosition.x > this.maxX)
            this.targetPosition.x = this.maxX;
        
        if (this.targetPosition.y != 0)
            this.targetPosition.y = 0;
        
        //AGITADO
        this.shakingValue.Set(0, 0);
        if (this.shakingTime > 0) {
            this.shakingTime -= deltaTime;

            this.shakingValue.x = Math.cos(this.shakeInitRandom.x + this.shakingTime * this.shakingSpeed) * this.shakingSize;
            this.shakingValue.y = Math.sin(this.shakeInitRandom.y + this.shakingTime * this.shakingSpeed) * this.shakingSize;
        }

        const smoothStep = this.smoothingSpeed * deltaTime;

        this.cleanPos.x += (this.targetPosition.x - this.position.x) * smoothStep;
        this.cleanPos.y = this.position.y;
        this.position.x += ((this.targetPosition.x - this.position.x) * smoothStep) + this.shakingValue.x;
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