
class User {

    constructor(initialPosition) {
        //esto se utilizará en caso de querer meter un indicador en el centro de la camara this.img = img;

        this.position = initialPosition;
        this.boundingRadius = 0;
        //this.attacking = false;
        this.moving = false;
        this.lastFrameMoving = false;
        this.goingRight = true;
        this.goingRightModifier = 1;
        this.framesCount = 0;
        this.gnocchi = 0;

        //stats la mitad no se utilizan por que vienen de reciclar una clase llamada player
        this.speed = 600;
        this.speedMult = 1.5;
        this.movement = {
            movementX : 0,
            movementY : 0
        }
        
    }

    Update(deltaTime) {
        this.framesCount++;

        // movement
        this.movement.movementX = 0;
        this.movement.movementY = 0;


        if (Input.IsKeyPressed(KEY_A) || Input.IsKeyPressed(KEY_LEFT)) {
            this.movement.movementX -= 1;
            this.goingRight = false;
            this.goingRightModifier = -1;
        }
        if (Input.IsKeyPressed(KEY_D) || Input.IsKeyPressed(KEY_RIGHT)) {
            this.movement.movementX += 1;
            this.goingRight = true;
            this.goingRightModifier = 1;
        }
        if (Input.IsKeyPressed(KEY_W) || Input.IsKeyPressed(KEY_UP)) {
            this.movement.movementY -= 1;
        }
        if (Input.IsKeyPressed(KEY_S) || Input.IsKeyPressed(KEY_DOWN)) {
            this.movement.movementY += 1;
        }


        if(this.movement.movementX != 0){
            this.moving = true;
            
        }
        else{
            this.moving = false;
        }
        
        this.lastFrameMoving = this.moving;

        // apply the movement
        this.position.x += this.movement.movementX * this.speed * deltaTime;
        this.position.y += this.movement.movementY * this.speed * deltaTime;
        

        
        if (this.position.x < sceneLimits.x + this.boundingRadius)
            this.position.x = sceneLimits.x + this.boundingRadius;
        if (this.position.x > sceneLimits.x + sceneLimits.width - this.boundingRadius)
            this.position.x = sceneLimits.x + sceneLimits.width - this.boundingRadius;
        if (this.position.y < sceneLimits.y + this.boundingRadius)
            this.position.y = sceneLimits.y + this.boundingRadius;
        if (this.position.y > sceneLimits.y + sceneLimits.height - this.boundingRadius)
            this.position.y = sceneLimits.y + sceneLimits.height - this.boundingRadius;
        
    }

    Draw(ctx) {

        ctx.save();

        ctx.fillStyle = "crimson";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.position.x - 18, this.position.y);
        ctx.lineTo(this.position.x + 18, this.position.y);
        ctx.moveTo(this.position.x, this.position.y - 18);
        ctx.lineTo(this.position.x, this.position.y + 18);
        ctx.stroke();

        ctx.restore();

    }

}
