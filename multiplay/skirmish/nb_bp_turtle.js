// Load the regular Nullbot
NB_PATH = "/multiplay/skirmish/";
include(NB_PATH + "nb_turtle.js");

/* variables defining the personality
 * weaponPaths: weapons to use
 * earlyResearch: fixed research path for the early game
 * minTanks: minimal attack force at game start
 * becomeHarder: how much to increase attack force every 5 minutes
 * maxTanks: maximum for the minTanks value (since it grows at becomeHarder rate)
 * minTrucks: minimal number of trucks around
 * minHoverTrucks: minimal number of hover trucks around
 * maxSensors: number of mobile sensor cars to produce
 * minMiscTanks: number of tanks to start harassing enemy
 * maxMiscTanks: number of tanks used for defense and harass
 * vtolness: the chance % of not making droids when adaptation mechanism chooses vtols
 * defensiveness: same thing for defenses; set this to 100 to enable turtle AI specific code
 * researchness: the chance % of assigning a PU to the lab instead of factories
 * maxPower: build expensive things if we have more than that
 * repairAt: how much % healthy should droid be to join the attack group instead of repairing
 */
subpersonalities = {
	MRH: {
		chatalias: "rh",
		weaponPaths: [
			weaponStats.scout,
			weaponStats.rockets,
			weaponStats.rockets_AA,
			weaponStats.howitzers,
		],
		earlyResearch: [
			"R0-E13-Rocket1",
		],
		minTanks: 6, becomeHarder: 3, maxTanks: 40,
		minTrucks: 2, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 2, maxMiscTanks: 8,
		vtolness: 30, defensiveness: 30, researchness: 10,
		maxPower: 800,
		repairAt: 50,
	},
	CR: {
		chatalias: "mc",
		weaponPaths: [
			weaponStats.scout,
			weaponStats.cannons, 
			weaponStats.rockets, 
			weaponStats.rockets_AA,
		],
		earlyResearch: [
			"R0-C13-Cannon1",
		],
		minTanks: 6, becomeHarder: 4, maxTanks: 40,
		minTrucks: 2, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 3, maxMiscTanks: 10,
		vtolness: 30, defensiveness: 40, researchness: 15,
		maxPower: 800,
		repairAt: 40,
	},
	CMs: {
		chatalias: "cms",
		weaponPaths: [
			weaponStats.scout,
			weaponStats.cannons,
			weaponStats.missiles,
			weaponStats.missiles_AA,
		],
		earlyResearch: [
			"R0-C13-Cannon1",
		],
		minTanks: 6, becomeHarder: 4, maxTanks: 40,
		minTrucks: 2, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 3, maxMiscTanks: 10,
		vtolness: 20, defensiveness: 60, researchness: 20,
		maxPower: 800,
		repairAt: 25,
	},
	MGHw: {
		chatalias: "mhw",
		weaponPaths: [
			weaponStats.scout,
			weaponStats.machineguns,
			weaponStats.howitzers,
			weaponStats.machineguns_AA,
		],
		earlyResearch: [
			"R0-A13-MG1",
		],
		minTanks: 6, becomeHarder: 3, maxTanks: 40,
		minTrucks: 1, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 4, maxMiscTanks: 8,
		vtolness: 20, defensiveness: 60, researchness: 20,
		maxPower: 800,
		repairAt: 50,
	},
	MsMt: {
		chatalias: "msmt",
		weaponPaths: [
			weaponStats.scout,
			weaponStats.missiles,
			weaponStats.mortars,
			weaponStats.missiles_AA,
		],
		earlyResearch: [
			"R0-D13-Missile1",
		],
		minTanks: 6, becomeHarder: 3, maxTanks: 40,
		minTrucks: 1, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 2, maxMiscTanks: 6,
		vtolness: 25, defensiveness: 60, researchness: 15,
		maxPower: 800,
		repairAt: 20,
	},
};

// this function describes the early build order
// you can rely on personality.chatalias for choosing different build orders for
// different subpersonalities
buildOrder = function() {
	return buildOrder_StandardFallback();
}
