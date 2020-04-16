
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

// variables defining the personality
var subpersonalities = {
	MR: {
		chatalias: "mr",
		weaponPaths: [ // weapons to use; put late-game paths below!
			weaponStats.machineguns,
			weaponStats.machineguns_AA,
			weaponStats.rockets,
			weaponStats.rockets_AA, 
		],
		earlyResearch: [ // fixed research path for the early game
			"R0-A13-MG1",
			"R0-E13-Rocket1",
		],
		minTanks: 2, // minimal attack force at game start
		becomeHarder: 2, // how much to increase attack force every 5 minutes
		maxTanks: 16, // maximum for the minTanks value (since it grows at becomeHarder rate)
		minTrucks: 2, // minimal number of trucks around
		minHoverTrucks: 1, // minimal number of hover trucks around
		maxSensors: 1, // number of mobile sensor cars to produce
		minMiscTanks: 1, // number of tanks to start harassing enemy
		maxMiscTanks: 5, // number of tanks used for defense and harass
		vtolness: 25, // the chance % of not making droids when adaptation mechanism chooses vtols
		defensiveness: 30, // same thing for defenses; set this to 100 to enable turtle AI specific code
		maxPower: 800, // build expensive things if we have more than that
		repairAt: 0, // how much % healthy should droid be to join the attack group instead of repairing
	},
	MC: {
		chatalias: "mc",
		weaponPaths: [
			weaponStats.cannons, 
			weaponStats.machineguns, 
			weaponStats.machineguns_AA,
		],
		earlyResearch: [
			"R0-A13-MG1",
			"R0-C13-Cannon1",
		],
		minTanks: 4, becomeHarder: 2, maxTanks: 16,
		minTrucks: 2, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 1, maxMiscTanks: 2,
		vtolness: 20, defensiveness: 40,
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
			"R0-E13-Rocket1",
		],
		minTanks: 4, becomeHarder: 2, maxTanks: 16,
		minTrucks: 2, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 1, maxMiscTanks: 2,
		vtolness: 20, defensiveness: 60,
		maxPower: 800,
		repairAt: 0,
	},
	FR: {
		chatalias: "fr",
		weaponPaths: [
			weaponStats.flamers,
			weaponStats.rockets,
			weaponStats.rockets_AA,
		],
		earlyResearch: [
			"R0-B13-Flamer1",
			"R0-E13-Rocket1",
		],
		minTanks: 2, becomeHarder: 2, maxTanks: 16,
		minTrucks: 2, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 1, maxMiscTanks: 2,
		vtolness: 30, defensiveness: 10,
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
			"R0-G13-Howitzer1",
		],
		minTanks: 3, becomeHarder: 3, maxTanks: 16,
		minTrucks: 1, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 1, maxMiscTanks: 2,
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
			"R0-G13-Howitzer1",
		],
		minTanks: 3, becomeHarder: 3, maxTanks: 16,
		minTrucks: 1, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 1, maxMiscTanks: 2,
		vtolness: 0, defensiveness: 40,
		maxPower: 800,
		repairAt: 0,
	},
	melee: {
		chatalias: "melee",
		weaponPaths: [
			weaponStats.flamers,
			weaponStats.missiles,
			weaponStats.missiles_AA,
		],
		earlyResearch: [
			"R0-B13-Flamer1",
			"R0-D13-Missile1",
		],
		minTanks: 2, becomeHarder: 2, maxTanks: 20,
		minTrucks: 2, minHoverTrucks: 0, maxSensors: 0,
		minMiscTanks: 1, maxMiscTanks: 2,
		vtolness: 0, defensiveness: 25,
		maxPower: 800,
		repairAt: 0,
	},
	arti: {
		chatalias: "art",
		weaponPaths: [
			weaponStats.cannons,
			weaponStats.rockets,
			weaponStats.rockets_AA,
			weaponStats.mortars,
			weaponStats.howitzers,
		],
		earlyResearch: [
			"R0-C13-Cannon1",
			"R0-E13-Rocket1",
		],
		minTanks: 4, becomeHarder: 2, maxTanks: 20,
		minTrucks: 2, minHoverTrucks: 2, maxSensors: 1,
		minMiscTanks: 1, maxMiscTanks: 2,
		vtolness: 0, defensiveness: 60,
		maxPower: 800,
		repairAt: 0,
	},
	random: {
		chatalias: "rnd",
		weaponPaths: [
			weaponStats.machineguns,
			weaponStats.machineguns_AA,
			weaponStats.flamers,
			weaponStats.flamers_AA,
			weaponStats.cannons,
			weaponStats.missiles,
			weaponStats.missiles_AA,
			weaponStats.rockets,
			weaponStats.rockets_AA,
			weaponStats.mortars,
			weaponStats.mortars_AA,
			weaponStats.howitzers,
		],
		earlyResearch: [
		],
		minTanks: 4, becomeHarder: 2, maxTanks: 10,
		minTrucks: 1, minHoverTrucks: 0, maxSensors: 1,
		minMiscTanks: 1, maxMiscTanks: 2,
		vtolness: 0, defensiveness: 50,
		maxPower: 800,
		repairAt: 0,
	},
};

// this function describes the early build order
// you can rely on personality.chatalias for choosing different build orders for
// different subpersonalities
function buildOrder() {
	return buildOrder_StandardFallback();
}



////////////////////////////////////////////////////////////////////////////////////////////
// Proceed with the main code

include(NB_INCLUDES + "_main.js");
