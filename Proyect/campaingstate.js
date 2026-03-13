campaignState = {
  phase: "setup" | "active",
  revision: 123,
  factions: {
    imperium: { ready: false },
    chaos: { ready: false },
    xenos: { ready: false }
  },
  //planets: { ... },      // PL, infra, fichas en cada planeta/casilla
  //fleets: { ... },       // si las modelas
}