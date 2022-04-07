

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
	allin: {
		chatalias: "allin",
		weaponPaths: [
			weaponStats.scout,
			weaponStats.flamers,
			weaponStats.cannons,
			weaponStats.howitzers,
		],
		minTanks: 1, becomeHarder: 2, maxTanks: 50,
		minTrucks: 0, minHoverTrucks: 0, maxSensors: 0,
		minMiscTanks: 0, maxMiscTanks: 0,
		vtolness: 0, defensiveness: 0, researchness: 0,
		maxPower: 1000,
		repairAt: 0,
	},
	MRH: {
		chatalias: "mrh",
		weaponPaths: [
			weaponStats.scout,
			weaponStats.machineguns,
			weaponStats.machineguns_AA,
			weaponStats.rockets,
			weaponStats.rockets_AA,
			weaponStats.howitzers,
		],
		earlyResearch: [
			"R0-A13-MG1",
		],
		minTanks: 2, becomeHarder: 3, maxTanks: 20,
		minTrucks: 2, minHoverTrucks: 1, maxSensors: 1,
		minMiscTanks: 2, maxMiscTanks: 8,
		vtolness: 25, defensiveness: 15, researchness: 10,
		maxPower: 800,
		repairAt: 30,
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
		minTanks: 4, becomeHarder: 4, maxTanks: 20,
		minTrucks: 2, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 3, maxMiscTanks: 10,
		vtolness: 20, defensiveness: 30, researchness: 15,
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
		minTanks: 4, becomeHarder: 4, maxTanks: 20,
		minTrucks: 2, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 3, maxMiscTanks: 10,
		vtolness: 20, defensiveness: 60, researchness: 20,
		maxPower: 800,
		repairAt: 25,
	},
	FHw: {
		chatalias: "fhw",
		weaponPaths: [
			weaponStats.scout,
			weaponStats.flamers,
			weaponStats.howitzers,
			weaponStats.flamers_AA,
		],
		earlyResearch: [
			"R0-B13-Flamer1",
		],
		minTanks: 4, becomeHarder: 3, maxTanks: 12,
		minTrucks: 1, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 3, maxMiscTanks: 6,
		vtolness: 10, defensiveness: 15, researchness: 20,
		maxPower: 800,
		repairAt: 20,
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
		minTanks: 4, becomeHarder: 3, maxTanks: 12,
		minTrucks: 1, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 4, maxMiscTanks: 8,
		vtolness: 20, defensiveness: 30, researchness: 20,
		maxPower: 800,
		repairAt: 40,
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
		minTanks: 3, becomeHarder: 3, maxTanks: 12,
		minTrucks: 1, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 2, maxMiscTanks: 6,
		vtolness: 25, defensiveness: 30, researchness: 15,
		maxPower: 800,
		repairAt: 20,
	},
};

// this function describes the early build order
// you can rely on personality.chatalias for choosing different build orders for
// different subpersonalities
buildOrder = function() {
	if (personality.chatalias == "allin") {
		return buildOrder_AllIn();
	}
	return buildOrder_StandardFallback();
}
