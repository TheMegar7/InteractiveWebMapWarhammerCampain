// hitboxes.js
const HITBOXES = {
  1: { // Noralus
    plGrid: {
      originX: 535,
      originY: 573,
      cols: 3,
      rows: 5,
      cellW: 115,
      cellH: 76,
      gapX: 9,
      gapY: 10,
    },

    // RELLENAS ESTO CUANDO MIDAS LOS CÍRCULOS
    infraSlots: [
      // { cx: ..., cy: ..., r: ... },
      // { cx: ..., cy: ..., r: ... },
      // { cx: ..., cy: ..., r: ... },
    ],

    // Opcional: para seleccionar planeta haciendo click en el círculo del planeta
    planetClick: { cx: 0, cy: 0, r: 0 },

    // Opcional: zona de órbita (si quieres detectar drops/clicks)
    orbit: { cx: 0, cy: 0, r: 0 },
  },

  // 2: { ... Karabas ... }
  // ...
};