
class User {

    constructor(initialPosition) {
        //esto se utilizará en caso de querer meter un indicador en el centro de la camara this.img = img;

        this.position = initialPosition;
        //this.attacking = false;
        this.moving = false;
        this.lastFrameMoving = false;
        this.running = false;
        this.lastFrameRunning = false;
        this.goingRight = true;
        this.goingRightModifier = 1;
        this.framesCount = 0;
        this.gnocchi = 0;

        //stats la mitad no se utilizan por que vienen de reciclar una clase llamada player
        this.speed = 200;
        this.speedMult = 1.5;
        this.movement = 0;
        /*
        this.maxHp = _life;
        this.hp = this.maxHp;
        this.extenuation = 800; //mas o menos 8 segs
        this.extenuationAux = 1000;
        */
        
    }

    Update(deltaTime) {
        this.framesCount++;
        
        // attack
        //#region attack
        
        if (Input.IsMousePressed() && Input.mouse.y < 382 &&(this.fireRateAux >= this.fireRate)) {
            
        }

        // movement
        this.movement = 0;


        if (Input.IsKeyPressed(KEY_A) || Input.IsKeyPressed(KEY_LEFT)) {
            this.movement -= 1;
            this.goingRight = false;
            this.goingRightModifier = -1;
        }
        if (Input.IsKeyPressed(KEY_D) || Input.IsKeyPressed(KEY_RIGHT)) {
            this.movement += 1;
            this.goingRight = true;
            this.goingRightModifier = 1;
        }


        if(this.movement != 0){
            this.moving = true;
            
        }
        else{
            this.moving = false;
            this.running = false;
        }
        // speed multiply
        /*
        if (Input.IsKeyPressed(KEY_LSHIFT)) {
            if (this.extenuationAux > 1)
            {
                this.movement *= this.speedMult;

                if(this.movement != 0){
                    this.running = true;
                    if(this.extenuationAux > 0) this.extenuationAux -= 2;
                    else this.extenuationAux = 0;
                }
                else {
                    this.running = false;
                    if(this.extenuationAux < this.extenuation) this.extenuationAux += 1;
                    else this.extenuationAux = this.extenuation;
                }
            }
            else this.running = false;
        }
        else {
            if(this.extenuationAux < this.extenuation) this.extenuationAux += 1;
            else this.extenuationAux = this.extenuation;
            this.running = false;
        }
        */
        /*
        if(!this.attacking){
            if (!this.lastFrameMoving && !this.moving && this.framesCount > (120 + 120)) {
                this.framesCount = 0;
                this.gnocchi = 0;
            }
            else if (this.lastFrameMoving != this.moving) {
                this.framesCount = 0;
                this.gnocchi = 0;
            }// empieza o deja de moverse
            else if (this.lastFrameRunning != this.running) {
                this.framesCount = 0;
                this.gnocchi = 0;
            } //empieza o deja de correr
            else if (this.lastFrameMoving && this.moving && this.framesCount >= 60) {
                this.framesCount = 0;
                this.gnocchi = 0;
            }//60 duración movingAnim
            else if (this.lastFrameRunning && this.running && this.framesCount >= 30) {
                this.framesCount = 0;
                this.gnocchi = 0;
            }//60 duración runningAnim

            if (this.framesCount > 120) this.gnocchi++;
        }
        */

        this.lastFrameMoving = this.moving;
        this.lastFrameRunning = this.running;

        // apply the movement
        this.position.x += this.movement * this.speed * deltaTime;
        

        
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
