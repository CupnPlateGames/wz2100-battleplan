
/*
 * This file defines a standard AI personality for the base game. 
 * 
 * It relies on ruleset definition in /rulesets/ to provide
 * standard strategy descriptions and necessary game stat information.
 * 
 * Then it passes control to the main code.
 * 
 */

// You can redefine these paths when you make a customized AI
// for a map or a challenge.
NB_PATH = "/multiplay/skirmish/";
NB_INCLUDES = NB_PATH + "nb_includes/";
NB_RULESETS = NB_PATH + "nb_rulesets/";
NB_COMMON = NB_PATH + "nb_common/";

// please don't touch this line
include(NB_INCLUDES + "_head.js");

////////////////////////////////////////////////////////////////////////////////////////////
// Start the actual personality definition

// the rules in which this personality plays
include(NB_RULESETS + "standard.js");
include(NB_COMMON + "standard_build_order.js");

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
 * maxPower: build expensive things if we have more than that
 * repairAt: how much % healthy should droid be to join the attack group instead of repairing
 */
var subpersonalities = {
	allin: {
		chatalias: "allin",
		weaponPaths: [
			weaponStats.scoutonly,
		],
		minTanks: 4, becomeHarder: 4, maxTanks: 8,
		minTrucks: 0, minHoverTrucks: 0, maxSensors: 0,
		minMiscTanks: 4, maxMiscTanks: 8,
		vtolness: 0, defensiveness: 0,
		maxPower: 400,
		repairAt: 0,
	},
	MR: {
		chatalias: "mr",
		weaponPaths: [
			weaponStats.machineguns,
			weaponStats.machineguns_AA,
			weaponStats.rockets,
			weaponStats.rockets_AA, 
		],
		earlyResearch: [
			"R0-A13-MG1",
		],
		minTanks: 2, becomeHarder: 3, maxTanks: 20,
		minTrucks: 2, minHoverTrucks: 1, maxSensors: 1,
		minMiscTanks: 2, maxMiscTanks: 8,
		vtolness: 25, defensiveness: 30,
		maxPower: 800,
		repairAt: 0,
	},
	CR: {
		chatalias: "mc",
		weaponPaths: [
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
		vtolness: 20, defensiveness: 60,
		maxPower: 800,
		repairAt: 0,
	},
	CMs: {
		chatalias: "cms",
		weaponPaths: [
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
		vtolness: 20, defensiveness: 60,
		maxPower: 800,
		repairAt: 0,
	},
	FHw: {
		chatalias: "fhw",
		weaponPaths: [
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
		vtolness: 0, defensiveness: 40,
		maxPower: 800,
		repairAt: 0,
	},
	MGHw: {
		chatalias: "mhw",
		weaponPaths: [
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
		vtolness: 10, defensiveness: 40,
		maxPower: 800,
		repairAt: 0,
	},
	MsMt: {
		chatalias: "msmt",
		weaponPaths: [
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
		vtolness: 0, defensiveness: 40,
		maxPower: 800,
		repairAt: 0,
	},
};

// this function describes the early build order
// you can rely on personality.chatalias for choosing different build orders for
// different subpersonalities
function buildOrder() {
	if (personality.chatalias == "allin") {
		return buildOrder_AllIn();
	}
	return buildOrder_StandardFallback();
}



////////////////////////////////////////////////////////////////////////////////////////////
// Proceed with the main code

include(NB_INCLUDES + "_main.js");
