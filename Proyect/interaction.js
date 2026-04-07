// interaction.js
const dragState = {
  isDragging: false,
  startX: 0,
  startY: 0,
  threshold: 5
};

function HandleUIClick(screenX, screenY) {
  // Cuando exista sidebar:
  // - comprobar si (screenX, screenY) cae dentro del rect de la sidebar
  // - y dentro, si cae en un botón concreto
  // - si sí: ejecutar acción y return true
  return false;
}

function PickAnyPlanetPL(wx, wy) {
  for (const idStr in HITBOXES) {
    if (!HITBOXES.hasOwnProperty(idStr)) continue;
    const planetId = parseInt(idStr, 10);
    const hb = HITBOXES[planetId];
    if (!hb || !hb.plRects) continue;

    for (let i = 0; i < hb.plRects.length; i++) {
      const r = hb.plRects[i];
      if (wx >= r.x && wx <= r.x + r.w && wy >= r.y && wy <= r.y + r.h) {
        return { planetId, col: r.col, row: r.row };
      }
    }
  }
  return null;
}

function HandleWorldClick(worldX, worldY) {
  // Aquí irán: PL, infra, órbitas, selección de planeta, etc.
  // Por ahora: detectar PL grid y loguear.
  const hit = PickAnyPlanetPL(worldX, worldY);
  if (!hit) return;

  const { planetId, col, row } = hit;

  const factionIndex = col;     // col 0..2
  const powerLevel = 4 - row;   // row 0 arriba = PL 4

  console.log(`PL click -> planet ${planetId}, faction ${factionIndex}, PL=${powerLevel}`);

  // Más adelante: aplicar al campaignState y registrar evento.
}

function HandleClick(screenX, screenY) {
  // 1) UI (sidebar/HUD) tiene prioridad
  if (HandleUIClick(screenX, screenY)) return;

  // 2) Mundo
  const wx = camera.position.x + screenX / camera.zoom;
  const wy = camera.position.y + screenY / camera.zoom;
  HandleWorldClick(wx, wy);
}

function UpdateInteraction() {
  if (Input.mouse.pressed) console.log("pressed", Input.mouse.x, Input.mouse.y, Input.mouse.dx, Input.mouse.dy);

  // defensivo
  if (!Input || !Input.mouse) return;
  if (!camera || !user) return;

  /// Drag vs Click
  // start press
  if (Input.mouse.down) {
    dragState.isDragging = false;
    dragState.startX = Input.mouse.x;
    dragState.startY = Input.mouse.y;
  }

  // while pressed
  if (Input.mouse.pressed) {
    const dxTotal = Input.mouse.x - dragState.startX;
    const dyTotal = Input.mouse.y - dragState.startY;

    if (!dragState.isDragging) {
      if (Math.abs(dxTotal) > dragState.threshold || Math.abs(dyTotal) > dragState.threshold) {
        dragState.isDragging = true;
        user.dragControlActive = true;
      }
    }

    if (dragState.isDragging) {
      // mueve el "focus" del mundo (user), la cámara lo seguirá
      user.ApplyDragPan(Input.mouse.dx, Input.mouse.dy, camera.zoom);
    }
  }

  // release
  if (Input.mouse.up) {
    const wasDragging = dragState.isDragging;

    dragState.isDragging = false;
    user.dragControlActive = false;

    // reset (because the flys)
    dragState.startX = 0;
    dragState.startY = 0;

    // Si NO era drag, entonces es click
    if (!wasDragging) {
      if (typeof HandleClick === "function") {
        HandleClick(Input.mouse.x, Input.mouse.y); // coords pantalla
      }
    }
  }
}