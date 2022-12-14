
////////////////////////////////////////////////////////////////////////////////
// Nexus personality definitions.
// A personality is a highly moddable set of information that can create new
// and interesting game-play.
////////////////////////////////////////////////////////////////////////////////

var branch; // what branch personality is being used. A string.
var nexusBranch = {
	generic1: {
		"type": "land",
		"name": "generic1",
		"minimums": {
			scouts: 1,
			defenders: 0,
			attackers: 4,
		},
		"maximums" : {
			scouts: 3,
			defenders: 0,
			attackers: MAX_DROID_LIMIT,
		},
		"numVtolGroups": 1,
		"numVtolsPerGroup": 10,
		"numVtolDefenders": 3,
		"maxVTOLs": 13,
		//.stattype
		"vtolTargets": [
			{structure: HQ, weight: 10},
			{structure: FACTORY, weight: 80},
			{structure: VTOL_FACTORY, weight: 100},
			{structure: LASSAT, weight: 90},
			{structure: SAT_UPLINK, weight: 10},
			{structure: RESEARCH_LAB, weight: 10},
			{structure: POWER_GEN, weight: 15},
			{structure: RESOURCE_EXTRACTOR, weight: 200},
			{structure: REPAIR_FACILITY, weight: 10},
		],
		// How many tiles away from scout base to expand ~every minute, if safe
		"tileExpandRate": 32,
		// Research to prioritize first
		"earlyResearch": [
			"R0-A13-MG1",
			"R0-E13-Rocket1",
		],
		"factoryPreference": [
			FACTORY,
			VTOL_FACTORY,
		],
		//The minimum amount of certain base structures this personality will build, in order.
		"buildOrder": [
			{stat: "F", count: 1},
			{stat: "R", count: 1},
			{stat: "F", count: 2},
		],
		"moduleOrder": [
		],
	},
	vtol1: {
		"type": "air",
		"name": "vtol1",
		"minimums": {
			scouts: 1,
			defenders: 6,
			attackers: 0,
		},
		"maximums" : {
			scouts: 3,
			defenders: 12,
			attackers: MAX_DROID_LIMIT,
		},
		"numVtolGroups": 3,
		"numVtolsPerGroup": 10,
		"numVtolDefenders": 5,
		"maxVTOLs": 35,
		"vtolTargets": [
			{structure: HQ, weight: 10},
			{structure: FACTORY, weight: 80},
			{structure: VTOL_FACTORY, weight: 100},
			{structure: LASSAT, weight: 90},
			{structure: SAT_UPLINK, weight: 10},
			{structure: RESEARCH_LAB, weight: 10},
			{structure: POWER_GEN, weight: 15},
			{structure: RESOURCE_EXTRACTOR, weight: 200},
			{structure: REPAIR_FACILITY, weight: 10},
		],
		"tileExpandRate": 32,
		"earlyResearch": [
			"R0-A13-MG1",
			"R0-E13-Rocket1",
		],
		"factoryPreference": [
			VTOL_FACTORY,
			FACTORY,
		],
		"buildOrder": [
			{stat: "V", count: 1},
			{stat: "R", count: 1},
			{stat: "F", count: 1},
			{stat: "V", count: 2},
			{stat: "R", count: 2},
		],
		"moduleOrder": [
		],
	},
};
