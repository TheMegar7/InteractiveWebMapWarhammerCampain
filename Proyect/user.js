
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
        this.speed = 200;
        this.speedMult = 1.5;
        this.movement = {
            movementX : 0,
            movementY : 0
        }
        
        /*
        this.maxHp = _life;
        this.hp = this.maxHp;
        this.extenuation = 800; //mas o menos 8 segs
        this.extenuationAux = 1000;
        */
        
    }

    Update(deltaTime) {
        this.framesCount++;

        // movement
        this.movement.movementX = 0;
        this.movementY = 0;


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
        let animFrame = Math.trunc(this.framesCount/10);
        let gnocchiFrame = Math.trunc(this.gnocchi/10);
        let fastFrame = Math.trunc(this.framesCount/5);

        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.scale(this.goingRightModifier, 1);

        /*
        if(this.attacking){
            //Column 4
            ctx.drawImage(this.img, 96 * 4, 96*fastFrame, 192, 96, -46, -96, 192 , 96);
        }
        else if(this.running){
            //Column 2
            ctx.drawImage(this.img, 96 * 2, 96*fastFrame, 96, 96, -46, -96, 96 , 96);
        }
        else if (this.moving){
            //Column 1
            ctx.drawImage(this.img, 96 * 1, 96*animFrame, 96, 96, -46, -96, 96 , 96);
        }
        else if(this.framesCount >= 120){
            //Column 0
            ctx.drawImage(this.img, 96 * 0, 96 * gnocchiFrame, 96, 96, -46, -96, 96 , 96);
        }
        // Column 0
        else ctx.drawImage(this.img, 96 * 0, 0, 96, 96, -46, -96, 96 , 96);
        */

        ctx.restore();

        /*ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.boundingRadius, 0, Math.PI * 2, false);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.rect(this.position.x - this.box.x/2, this.position.y - this.box.y, this.box.x, this.box.y);
        ctx.fill();*/

        //this.weapon.Draw(animFrame, ctx);

    }

}
