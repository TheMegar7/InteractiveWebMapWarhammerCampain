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
var background = null;
var sceneLimits = {
    x: 0,
    y: 0,
    width: 5400,
    height: 3750
};
var selectedToken = null;

//// Debug and working tools (not for the user)

var measure = {
  enabled: true,
  pointA: null,
  pointB: null,
  center: null,
  radiusPoint: null
};


//Assets
var assets = {
    map:{
        img: null,
        path: "./assets/Map.jpeg"
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

function ResizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (camera != null) {
        camera.OnResize();
    }
}

// base estructural logic

function Init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    ResizeCanvas();
    window.addEventListener("resize", ResizeCanvas);

    // input setup
    SetupKeyboardEvents();
    SetupMouseEvents();
    
    // assets loading
    LoadImages(assets, () => {
        console.log("Assets cargados o procesados");
        audios.soundtrack = document.getElementById("Soundtrack");
        Start();
        Loop();
    });
}

// Start/Turn on logic
function Start() {
    console.log("Start ejecutado");
    time = performance.now();

    alert("Mapa to guapo, derechos a quien le pertenezcan");

    let audioStarted = false;

    function TryStartAudio() {
        if (audioStarted) return;
        audioStarted = true;
        StartAudio();
    }

    window.addEventListener("pointerdown", TryStartAudio, { once: true });
    window.addEventListener("keydown", TryStartAudio, { once: true });

    
    // initialize the player //Aqui tengo que meter la ubicación de inicio del player y la imagen (?) del player.
    user = new User(new Vector2(canvas.width / 2, canvas.height / 2));
    
    camera = new Camera(user);

    background = new Background(sceneLimits.width, sceneLimits.height, 100);
    
    camera.Start();

}

function Loop() {
    requestAnimationFrame(Loop);

    let now = performance.now();
    let deltaTime = (now - time) / 1000;
    globalDT = deltaTime;

    time = now;
    framesAcum++;
    acumDelta += deltaTime;

    if (acumDelta >= 1) {
        fps = framesAcum;
        framesAcum = 0;
        acumDelta -= 1;
    }
    if (deltaTime > 1) return;
    
    // Update the games logic
    Update(deltaTime);
    // Draw the game elements
    Draw();
}


function Update(deltaTime) {
    
    //Update the User
    user.Update(deltaTime);
    
    if (measure.enabled){Measure()};

    // update the camera
    camera.Update(deltaTime);

    //Limpiar flags de un solo frame
    Input.PostUpdate();
}

function Draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    ctx.fillStyle = "rgba(0, 0, 100, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    camera.PreDraw(ctx); //De aqui pabajo todo lo que pase en escena //////////////////////////////////////////////////////////
    
    DrawMap(ctx);

    //maya debug
    ctx.save();
    ctx.globalAlpha = 0.25;
    background.Draw(ctx);
    ctx.restore();
    
    
    user.Draw(ctx);

    camera.PostDraw(ctx); //De aqui parriba todo lo que pase en escena //////////////////////////////////////////////////////////


    // mouse
    DrawCursor();

    // draw the fps
    DrawStats(ctx)
}

function DrawMap(ctx) {
    const img = assets.map?.img;

    // Si no ha cargado todavía, no lo intentes pintar
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.drawImage(img, 0, 0);
}

function DrawStats(ctx) {
    ctx.textAlign = "start";
    ctx.fillStyle = "rgba(122, 122, 122, 0.5)";
    ctx.fillRect(2, 2, 110, 54);
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    
    
    ctx.fillText("FPS: " + fps, 6, 14);
    ctx.fillText("FPS (dt): " + (1 / globalDT).toFixed(2), 6, 32);
    ctx.fillText("deltaTime: " + (globalDT).toFixed(4), 6, 50);

    //Debug
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";

    const wx = user.position.x.toFixed(1);
    const wy = user.position.y.toFixed(1);

    ctx.fillText(`World: x=${wx} y=${wy}`, 20, 80);
}

function Measure(){

    if (Input.IsKeyDown(KEY_1)) { // guardar A
        measure.pointA = { x: user.position.x, y: user.position.y };
        console.log("A =", measure.pointA);
    }

    if (Input.IsKeyDown(KEY_2)) { // guardar B
        measure.pointB = { x: user.position.x, y: user.position.y };
        console.log("B =", measure.pointB);
    }
        
    if (Input.IsKeyDown(KEY_3)) { // centro
        measure.center = { x: user.position.x, y: user.position.y };
        console.log("C =", measure.center);
    }

    if (Input.IsKeyDown(KEY_4)) { // radio
        measure.radiusPoint = { x: user.position.x, y: user.position.y };
        console.log("R =", measure.radiusPoint);
    }

    if (Input.IsKeyDown(KEY_ENTER) && measure.pointA && measure.pointB) {
        const A = measure.pointA;
        const B = measure.pointB;

        const x = Math.min(A.x, B.x);
        const y = Math.min(A.y, B.y);
        const w = Math.abs(A.x - B.x);
        const h = Math.abs(A.y - B.y);

        console.log(`RECT = { x:${x.toFixed(1)}, y:${y.toFixed(1)}, w:${w.toFixed(1)}, h:${h.toFixed(1)} }`);
    }
        
    if (Input.IsKeyDown(KEY_ENTER) && measure.center && measure.radiusPoint) {
        const C = measure.center;
        const R = measure.radiusPoint;

        const dx = R.x - C.x;
        const dy = R.y - C.y;
        const r = Math.sqrt(dx*dx + dy*dy);

        console.log(`CIRCLE = { cx:${C.x.toFixed(1)}, cy:${C.y.toFixed(1)}, r:${r.toFixed(1)} }`);
    }
}


function DrawCursor() {
    if (assets.mouse?.img) {
        ctx.drawImage(assets.mouse.img, Input.mouse.x, Input.mouse.y);
    }
    else {
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(Input.mouse.x, Input.mouse.y, 4, 4);
    }

    /*if (selectedToken && selectedToken.img) {
        ctx.drawImage(selectedToken.img, Input.mouse.x + 12, Input.mouse.y + 12, 32, 32);
    }*/
}

function StartAudio() {
    if (!audios.soundtrack) return;

    audios.soundtrack.volume = 0.2;

    const playPromise = audios.soundtrack.play();
    if (playPromise !== undefined) {
        playPromise.catch((error) => {
            console.log("Audio bloqueado o no disponible:", error);
        });
    }
}

function ScreenToWorld(screenX, screenY) {
  return {
    x: camera.position.x + screenX / camera.zoom,
    y: camera.position.y + screenY / camera.zoom
  };
}



window.onload = Init;