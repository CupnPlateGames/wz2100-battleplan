// Load the regular Nullbot
NB_PATH = "/multiplay/skirmish/";
include(NB_PATH + "nb_generic.js");

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
		],
		minTanks: 4, becomeHarder: 4, maxTanks: 8,
		minTrucks: 0, minHoverTrucks: 0, maxSensors: 0,
		minMiscTanks: 4, maxMiscTanks: 8,
		vtolness: 0, defensiveness: 0, researchness: 0,
		maxPower: 400,
		repairAt: 0,
	},
}

// this function describes the early build order
// you can rely on personality.chatalias for choosing different build orders for
// different subpersonalities
buildOrder = function() {
	return buildOrder_AllIn();
}
