// key events
const KEY_LEFT   = 37, KEY_A = 65;
const KEY_UP     = 38, KEY_W = 87;
const KEY_RIGHT  = 39, KEY_D = 68;
const KEY_DOWN   = 40, KEY_S = 83;
const KEY_PAUSE  = 19; KEY_Q = 81;
const KEY_SPACE  = 32; KEY_E = 69;
const KEY_ESCAPE = 27; KEY_F = 70;
const KEY_ENTER  = 13;
const KEY_LSHIFT = 16;
const KEY_LCTRL  = 17;

const KEY_0 = 48;
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
const KEY_6 = 54;
const KEY_7 = 55;
const KEY_8 = 56;
const KEY_9 = 57;
//

var lastPress = null;
const ZOOM_LEVELS = [1.0, 0.75, 0.5, 0.3];
let zoomIndex = 0; // empieza en 1.0

let drag = {
  isDown: false,
  isDragging: false,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  threshold: 5 // píxeles de pantalla
};

var Input = {
    mouse: {
        x: 0, y: 0,
        dx: 0, dy: 0,
        down: false,
        up: false,
        pressed: false,
        wheelDelta: 0
    },

    keyboard: {
        keyup: {},
        keypressed: {},
        keydown: {}
    },

    IsKeyPressed: function(keycode) {
        return this.keyboard.keypressed[keycode];
    },

    IsKeyDown: function(keycode) {
        return this.keyboard.keydown[keycode];
    },

    IsKeyUp: function (keycode) {
        return this.keyboard.keyup[keycode];
    },

    IsMousePressed: function () {
        return this.mouse.pressed;
    },

    PostUpdate: function () {
        // clean keyboard keydown events
        for (var property in this.keyboard.keydown) {
            if (this.keyboard.keydown.hasOwnProperty(property)) {
                this.keyboard.keydown[property] = false;
            }
        }

        // clean keyboard keyup events
        for (var property in this.keyboard.keyup) {
            if (this.keyboard.keyup.hasOwnProperty(property)) {
                this.keyboard.keyup[property] = false;
            }
        }

        // clean mouse down events
        this.mouse.down = false;
        this.mouse.up = false;
        this.mouse.dx = 0;
        this.mouse.dy = 0;
    }
};

function SetupKeyboardEvents ()
{
    AddEvent(document, "keydown", function (e) {
        //console.log(e.keyCode);
        // avoid when the key is being held down such that it is automatically repeating
        if (!e.repeat) {
            Input.keyboard.keydown[e.keyCode] = true;
            Input.keyboard.keypressed[e.keyCode] = true;
        }
    } );

    AddEvent(document, "keyup", function (e) {
        Input.keyboard.keyup[e.keyCode] = true;
        Input.keyboard.keypressed[e.keyCode] = false;
    } );

    function AddEvent (element, eventName, func)
    {
        if (element.addEventListener)
            element.addEventListener(eventName, func, false);
        else if (element.attachEvent) // IE9
            element.attachEvent(eventName, func);
    }
}

function SetupMouseEvents ()
{
    // mouse click event
    canvas.addEventListener("mousedown", MouseDown, false);
    // mouse move event
    canvas.addEventListener("mousemove", MouseMove, false);
    // mouse up event
    window.addEventListener("mouseup", MouseUp, false);
    // Extra safety measure in case the window loses focus
    window.addEventListener("blur", ForceMouseRelease, false);
    // Wheel scroll
    canvas.addEventListener("wheel", MouseWheel, { passive: false });
    /*canvas.addEventListener("wheel", (e) => {
        e.preventDefault();

        if (!camera) return;

        // mouse en coords de canvas (por si no hubo mousemove antes)
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        // opcional: mantener Input.mouse actualizado
        Input.mouse.x = mx;
        Input.mouse.y = my;

        // rueda abajo => zoom out, rueda arriba => zoom in
        if (e.deltaY > 0) zoomIndex = Math.min(ZOOM_LEVELS.length - 1, zoomIndex + 1);
        else             zoomIndex = Math.max(0, zoomIndex - 1);

        camera.SetZoom(ZOOM_LEVELS[zoomIndex], mx, my);
    }, { passive: false });*/

}

function MouseDown(event) {
  const rect = canvas.getBoundingClientRect();
  const sx = event.clientX - rect.left;
  const sy = event.clientY - rect.top;

  Input.mouse.down = true;
  Input.mouse.pressed = true;
  Input.mouse.x = sx;
  Input.mouse.y = sy;
}

function MouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const sx = event.clientX - rect.left;
  const sy = event.clientY - rect.top;

  // si no existen, inicializa
  if (typeof Input.mouse.dx !== "number") Input.mouse.dx = 0;
  if (typeof Input.mouse.dy !== "number") Input.mouse.dy = 0;

  const dx = sx - Input.mouse.x;
  const dy = sy - Input.mouse.y;

  Input.mouse.dx += dx;
  Input.mouse.dy += dy;

  Input.mouse.x = sx;
  Input.mouse.y = sy;
}

function MouseUp(event) {
  const rect = canvas.getBoundingClientRect();
  const sx = event.clientX - rect.left;
  const sy = event.clientY - rect.top;

  Input.mouse.up = true;
  Input.mouse.pressed = false;
  Input.mouse.x = sx;
  Input.mouse.y = sy;
}

function ForceMouseRelease() {
  Input.mouse.pressed = false;
  Input.mouse.up = true;
  dragState.isDragging = false;
  user.dragControlActive = false;
}


function MouseWheel(event){
    event.preventDefault();

    if (!camera) return;

    // mouse en coords de canvas (por si no hubo mousemove antes)
    const rect = canvas.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    // opcional: mantener Input.mouse actualizado
    Input.mouse.x = mx;
    Input.mouse.y = my;

    // rueda abajo => zoom out, rueda arriba => zoom in
    if (event.deltaY > 0) zoomIndex = Math.min(ZOOM_LEVELS.length - 1, zoomIndex + 1);
    else             zoomIndex = Math.max(0, zoomIndex - 1);

    camera.SetZoom(ZOOM_LEVELS[zoomIndex], mx, my);
}

