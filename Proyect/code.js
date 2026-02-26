var canvas = /** @type {HTMLCanvasElement} */(null);
var ctx = /** @type {CanvasRenderingContext2D} */(null);

//Time Variables
var time = 0,
    fps = 0,
    framesAcum = 0,
    acumDelta = 0;
var targetDT = 1/60; // 60 fps
var globalDT;


var user = null;
var camera = null;

//Assets
var assets = {
    map:{
        img: null,
        path: "./assets/Map.png"
    },
    mouse:{
        img: null,
        path: "./assets/Feather.png"
    },
}
var audios= {
    soundtrack: null,
}

////////  Logic  ////////

function LoadImages(assets, onloaded){
    let imagesToLoad = 0;
    const onload = () => --imagesToLoad === 0 && onloaded();
    // iterate through the object of assets and load every image
    for (let asset in assets) {
        if (assets.hasOwnProperty(asset)) {
            imagesToLoad++; // one more image to load

            // create the new image and set its path and onload event
            const img = assets[asset].img = new Image;
            img.src = assets[asset].path;
            img.onload = onload;
        }
    }
    
    return assets;
}

// base estructural logic

function Init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    // input setup
    SetupKeyboardEvents();
    SetupMouseEvents();
    
    // assets loading
    LoadImages(assets, () => {
        audios.soundtrack = document.getElementById("Soundtrack");
        Start();
        Loop();
    });
}

// Start/Turn on logic
function Start() {
    time = performance.now();

    alert("Mapa to guapo, derechos a quien le pertenezcan");

    audios.soundtrack.play();
    
    // initialize the player //Aqui tengo que meter la ubicación de inicio del player y la imagen (?) del player.
    user = new User(new Vector2(canvas.width / 2, canvas.height / 2));
    
    camera = new Camera(user);
    
    camera.Start();

    // one enemy //esto tengo que borrarlo
    //enemy = new Enemy(assets.villagers.img, new Vector2 (3456, 336), 4/*hp*/, wall, player, home);
    //enemy spawn for the moment
    //let enemy = new Enemy(assets.malandro.img, new Vector2 (3456, 336), 4/*hp*/, wall, player, home);
    //enemies.push(enemy);
}

function Loop() {
    requestAnimationFrame(Loop);

    let now = performance.now();
    let deltaTime = (now - time) / 1000;
    globalDT = deltaTime;
    
    // Update the games logic
    Update(deltaTime);
    // Draw the game elements
    Draw();
}


function Update(deltaTime) {
    
    // Use to ajust cells
    //enemies.forEach(enemy => enemy.Update(deltaTime));
    
    //background.Update(deltaTime);
    
    //Update the User
    user.Update(deltaTime);
    // update the camera
    camera.Update(deltaTime);

}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    ctx.fillStyle = "rgba(0, 0, 100, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    camera.PreDraw(ctx); //De qeui pabajo todo lo que pase en escena //////////////////////////////////////////////////////////
    
    // grid
    //background.Draw(ctx);
    
    //NPCS
    //nanianos.forEach(naniano => naniano.Draw(ctx));
    
    // draw the player
    //User.Draw(ctx);

    camera.PostDraw(ctx); //De aqui parriba todo lo que pase en escena //////////////////////////////////////////////////////////

    //Clock(ctx);

    //Healbar(ctx);

    // mouse
    ctx.drawImage(assets.mouse.img, Input.mouse.x, Input.mouse.y - 16*3);

    // draw the fps
    DrawStats(ctx)
}

function DrawStats(ctx) {
    ctx.textAlign = "start";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(2, 2, 110, 54);
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    
    
    ctx.fillText("FPS: " + fps, 6, 14);
    ctx.fillText("FPS (dt): " + (1 / globalDT).toFixed(2), 6, 32);
    ctx.fillText("deltaTime: " + (globalDT).toFixed(4), 6, 50);
}

function Clock(ctx){
    ctx.drawImage(assets.clock.img, 1029 - 96/2, 48 -96/2);
    ctx.fillStyle = "rgba(150, 150, 255, 1)";
    ctx.beginPath();
    ctx.arc(1029, 48, 42, Math.PI, - clock.dayAuxTime * Math.PI);
    ctx.lineTo(1029, 48);
    ctx.fill();
    ctx.fillStyle = "rgba(0, 0, 255, 1)";
    ctx.beginPath();
    ctx.arc(1029, 48, 42, 0, clock.nightTimeAux * Math.PI);
    ctx.lineTo(1029, 48);
    ctx.fill();
    ctx.drawImage(assets.clockFront.img, 1029 - 96/2, 48 -96/2);
}

function Healbar(ctx){
    ctx.drawImage(assets.healbar.img, 0, 4);
    ctx.fillStyle = "rgba( 0, 255, 0, 1)";
    ctx.beginPath();
    ctx.rect(6, 64, 10 * user.hp, 12);
    ctx.fill();

    ctx.textAlign = "start";
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    ctx.fillText(user.hp, 10 + (10 *user.hp), 74);

    ctx.fillStyle = "rgba( 100, 170, 255, 1)";
    ctx.beginPath();
    ctx.rect(6, 88, user.extenuationAux/25 * 6, 6);
    ctx.fill();
}


window.onload = Init;