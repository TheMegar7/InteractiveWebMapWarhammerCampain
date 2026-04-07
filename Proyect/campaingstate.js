// campaingstate.js

// Orden FIJO de columnas -> facción
const FACTION_KEYS = ["imperium", "chaos", "xenos"]; // col 0,1,2

function CreateCampaignState() {
  const state = {
    phase: "setup",          // "setup" o "active"
    revision: 0,
    factions: {
      imperium: { ready: false, name: "Imperium" },
      chaos:    { ready: false, name: "Chaos" },
      xenos:    { ready: false, name: "Xenos" },
    },
    planets: {},             // aquí se rellenará
    events: []               // log local (opcional, útil para undo luego)
  };

  // inicializa planetas desde PLANETS (1..13)
  for (const idStr in PLANETS) {
    if (!PLANETS.hasOwnProperty(idStr)) continue;
    const id = parseInt(idStr, 10);

    state.planets[id] = {
      pl: {
        imperium: 0,
        chaos: 0,
        xenos: 0
      },
      // lo dejamos listo para futuro
      infraSlots: [],  // lo rellenarás cuando midas infra
      fleets: []       // cuando implementes flotas
    };
  }

  return state;
}

// Global
var campaignState = CreateCampaignState();