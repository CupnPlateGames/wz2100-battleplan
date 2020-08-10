
/*
 * This file describes standard stats and strategies of
 * the base (unmodded) game.
 *
 * If you want to make an AI specially designed for your mod, start by
 * making a copy of this file and modifying it according to your mod's rules.
 *
 * Then provide a personality to use the ruleset, similar to
 * how nb_generic.[js|ai] is provided for this ruleset.
 *
 * You may find some useful functions for working with these stats
 * in stats.js .
 *
 */

// a factor for figuring out how large things are in this ruleset,
// or simply a typical radius of a player's base
const baseScale = 20;

// diameter of laser satellite splash/incendiary damage
// for use in lassat.js
const lassatSplash = 4;

// set this to 1 to choose templates randomly, instead of later=>better.
const randomTemplates = 1;

// this function is used for avoiding AI cheats that appear due to
// being able to build droids before designing them
function iCanDesign() {
	if (difficulty === INSANE) // won't make INSANE much worse ...
		return true;
	return countFinishedStructList(structures.hqs) > 0;
}

const structures = {
	factories: [ "A0LightFactory", ],
	templateFactories: [ ],
	vtolFactories: [ "A0VTolFactory1", ],
	labs: [ "A0ResearchFacility", ],
	gens: [ "A0PowerGenerator", ],
	hqs: [ "A0CommandCentre", ],
	vtolPads: [ "A0VtolPad", ],
	derricks: [ "A0ResourceExtractor", ],
	extras: [ "A0RepairCentre1", "A0RepairCentre3", "A0Sat-linkCentre", "A0LasSatCommand", ],
	sensors: [ "Sys-SensoTower02", "Sys-CB-Tower01", "Sys-RadarDetector01", "Sys-SensoTowerWS", ],
};

const oilResources = [ "OilResource", ];

const powerUps = [ "OilDrum", "Crate" ];

// NOTE: you cannot use specific stats as bases, but only stattypes
// probably better make use of .name rather than of .stattype here?
const modules = [
	//{ base: POWER_GEN, module: "A0PowMod1", count: 1, cost: MODULECOST.CHEAP }, // disabled not to explode
	//{ base: FACTORY, module: "A0FacMod1", count: 2, cost: MODULECOST.EXPENSIVE },
	//{ base: VTOL_FACTORY, module: "A0FacMod1", count: 2, cost: MODULECOST.EXPENSIVE },
	//{ base: RESEARCH_LAB, module: "A0ResearchModule1", count: 1, cost: MODULECOST.EXPENSIVE },
];

const targets = []
	.concat(structures.factories)
	.concat(structures.templateFactories)
	.concat(structures.vtolFactories)
	.concat(structures.extras)
;

const miscTargets = []
	.concat(structures.derricks)
;

const sensorTurrets = [
	"SensorTurret1Mk1", // sensor
	"Sensor-WideSpec", // wide spectrum sensor
];

const fundamentalResearch = [
	"R0-L3-Repair1",
	"R0-L2-Repair2",
	"R0-Sys-Autorepair-General",
];

const fastestResearch = [

];

// body and propulsion arrays don't affect fixed template droids
const bodyStats = [
	{ res: "", stat: "B-C3-SP", weight: WEIGHT.LIGHT, usage: BODYUSAGE.UNIVERSAL, armor: BODYCLASS.KINETIC }, // viper
	{ res: "R-Vehicle-Body05", stat: "B-C2-MP", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // cobra
	{ res: "R-Vehicle-Body11", stat: "B-C1-LP", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // python
	{ res: "", stat: "B-B3-SC", weight: WEIGHT.LIGHT, usage: BODYUSAGE.UNIVERSAL, armor: BODYCLASS.KINETIC }, // leopard
	{ res: "R-Vehicle-Body05", stat: "B-B2-MC", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // panther
	{ res: "R-Vehicle-Body11", stat: "B-B1-LC", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // tiger
	{ res: "", stat: "B-D3-SNP", weight: WEIGHT.LIGHT, usage: BODYUSAGE.UNIVERSAL, armor: BODYCLASS.KINETIC }, // bug
	{ res: "R-Vehicle-Body05", stat: "B-D2-MNP", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // scorpion
	{ res: "R-Vehicle-Body11", stat: "B-D1-LNP", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // mantis
	{ res: "R-Vehicle-Body03", stat: "B-A3-SN", weight: WEIGHT.LIGHT, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // retaliation
	{ res: "R-Vehicle-Body07", stat: "B-A2-MN", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // retribution
	{ res: "R-Vehicle-Body10", stat: "B-A1-LN", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // vengeance
];

const classResearch = {
	kinetic: [
		[ // OBJTYPE.TANK
			"R-Vehicle-Metals01",
			"R-Vehicle-Metals02",
			"R-Vehicle-Metals03",
		],
		[ // OBJTYPE.BORG
		],
		[ // OBJTYPE.DEFS
			"R-Defense-WallUpgrade01",
			"R-Defense-WallUpgrade02",
			"R-Defense-WallUpgrade03",
		],
		[ // OBJTYPE.VTOL
		],
	],
	thermal: [ // Same as above
		[
			"R-Vehicle-Metals01",
			"R-Vehicle-Metals02",
			"R-Vehicle-Metals03",
		],
		[
		],
		[
			"R-Defense-WallUpgrade01",
			"R-Defense-WallUpgrade02",
			"R-Defense-WallUpgrade03",
		],
		[
		],
	],
};

// NOTE: Please don't put hover propulsion into the ground list, etc.!
// NOTE: Hover propulsion should be placed AFTER ground propulsion!
// Adaptation code relies on that for discovering map topology.
// Ground propulsions need to be ground only, hover propulsions shouldn't
// be able to cross cliffs, but should be able to cross seas, etc.
const propulsionStats = [
	{ res: "", stat: "wheeled01", usage: PROPULSIONUSAGE.GROUND },
	{ res: "", stat: "tracked01", usage: PROPULSIONUSAGE.GROUND },
	{ res: "", stat: "hover01", usage: PROPULSIONUSAGE.HOVER },
	{ res: "", stat: "V-Tol", usage: PROPULSIONUSAGE.VTOL },
];


const truckTurrets = [
	"Spade1Mk1",
];

const truckTemplates = [
];

const fallbackWeapon = 'machineguns';

// Unlike bodies and propulsions, weapon lines don't have any specific meaning.
// You can make as many weapon lines as you want for your ruleset.
const weaponStats = {
	scout: {
		roles: [ 0.2, 0.0, 0.2, 0.2 ],
		chatalias: "scout",
		micro: MICRO.MELEE,
		weapons: [
			{ res: "", stat: "W-Z11-Scout", weight: WEIGHT.LIGHT },
		],
		vtols: [
			{ res: "", stat: "W-Z11-VTOLScout", weight: WEIGHT.LIGHT },
		],
		defenses: [
			{ res: "", stat: "W-Z11-TowerScout", weight: WEIGHT.LIGHT },
		],
		templates: [],
		extras: [],
	},
	machineguns: {
		// How good weapons of this path are against tanks, borgs, defenses, vtols?
		// The sum of the four should be equal to 1.
		roles: [ 0.8, 0.0, 0.3, 0.3 ],
		// This explains how are human players supposed to call this weapon path in the chat.
		chatalias: "mg",
		// This controls micromanagement of units based on the weapons of this path.
		micro: MICRO.RANGED,
		// Weapons of the path, better weapons below.
		weapons: [
			{ res: "R0-A13-MG1", stat: "W-A13-MG1", weight: WEIGHT.LIGHT, chance: 70 }, // mg
			{ res: "R0-A12-MG2", stat: "W-A12-MG2", weight: WEIGHT.MEDIUM, chance: 50 }, // hmg
			{ res: "R0-A11-MG3", stat: "W-A11-MG3", weight: WEIGHT.HEAVY },
		],
		// VTOL weapons of the path, in the same order.
		vtols: [
			{ res: "", stat: "W-Z11-VTOLScout", weight: WEIGHT.LIGHT },
			{ res: "R0-A13-MG1", stat: "W-A13-VTOLMG1", weight: WEIGHT.LIGHT, chance: 30 }, // vtol mg
			{ res: "R0-A12-MG2", stat: "W-A12-VTOLMG2", weight: WEIGHT.MEDIUM, chance: 50 }, // vtol hmg
			{ res: "R0-A11-MG3", stat: "W-A11-VTOLMG3", weight: WEIGHT.MEDIUM }, // vtol hmg
		],
		// Defensive structures of the path, in the same order.
		// NOTE: a defensive structure is recycled whenever there are at least two structures
		// with the same role available down the list
		defenses: [
			// turtle AI needs early versatile towers, hence duplicate stat
			{ res: "R0-A13-MG1", stat: "S-A13a-MG1Tower", defrole: DEFROLE.GATEWAY }, // mg tower
			{ res: "R0-A13-MG1", stat: "S-A13a-MG1Tower", defrole: DEFROLE.STANDALONE }, // mg tower
			{ res: "R0-A13b-MG1Bunker", stat: "S-A13b-MG1Bunker", defrole: DEFROLE.GATEWAY }, // mg bunker
			{ res: "R0-A13b-MG1Bunker", stat: "S-A13b-MG1Bunker", defrole: DEFROLE.STANDALONE }, // mg bunker
			{ res: "R0-A12-MG2", stat: "S-A12a-MG2Tower", defrole: DEFROLE.GATEWAY }, // hmg tower
			{ res: "R0-A12-MG2", stat: "S-A12a-MG2Tower", defrole: DEFROLE.STANDALONE }, // hmg tower
			{ res: "R0-A12b-MG2Bunker", stat: "S-A12b-MG2Bunker", defrole: DEFROLE.GATEWAY }, // hmg bunker
			{ res: "R0-A12b-MG2Bunker", stat: "S-A12b-MG2Bunker", defrole: DEFROLE.STANDALONE }, // hmg bunker
			{ res: "R0-A11-MG3", stat: "S-A11a-MG3Tower", defrole: DEFROLE.GATEWAY },
			{ res: "R0-A11-MG3", stat: "S-A11a-MG3Tower", defrole: DEFROLE.STANDALONE },
			{ res: "R0-A11b-MG3Bunker", stat: "S-A11b-MG3Bunker", defrole: DEFROLE.GATEWAY },
			{ res: "R0-A11b-MG3Bunker", stat: "S-A11b-MG3Bunker", defrole: DEFROLE.STANDALONE },
		],
		// Cyborg templates, better borgs below, as usual.
		templates: [
		],
		// Extra things to research on this path, even if they don't lead to any new stuff
		extras: [
			"R0-A9-MGUpgrade3",
		],
	},
	machineguns_AA: {
		roles: [ 0.0, 0.0, 0.0, 1.0 ],
		chatalias: "mg",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R0-A22-AAMG2", stat: "W-A22-AAMG2", weight: WEIGHT.MEDIUM }, // mg
		],
		vtols: [
			{ res: "", stat: "W-Z11-VTOLScout", weight: WEIGHT.LIGHT, chance: 0 },
			{ res: "R0-A13-MG1", stat: "W-A13-VTOLMG1", weight: WEIGHT.ULTRALIGHT, chance: 30 }, // vtol mg
			{ res: "R0-A12-MG2", stat: "W-A12-VTOLMG2", weight: WEIGHT.LIGHT, chance: 50 }, // vtol hmg
			{ res: "R0-A11-MG3", stat: "W-A11-VTOLMG3", weight: WEIGHT.MEDIUM }, // vtol hmg
		],
		defenses: [
			{ res: "R0-A22-AAMG2", stat: "S-A22a-AAMG2Empl", defrole: DEFROLE.STANDALONE },
			{ res: "R0-A21-AAMG3", stat: "S-A21a-AAMG3Empl", defrole: DEFROLE.STANDALONE },
		],
		templates: [
		],
		extras: [
		],
	},
	flamers: {
		roles: [ 0.9, 0.0, 0.1, 0.0 ],
		chatalias: "fl",
		micro: MICRO.MELEE,
		weapons: [
			{ res: "R0-B13-Flamer1", stat: "W-B13-Flamer1", weight: WEIGHT.LIGHT, chance: 50 }, // flamer
			{ res: "R0-B12-Flamer2", stat: "W-B12-Flamer2", weight: WEIGHT.HEAVY, chance: 60 }, // inferno
			{ res: "R0-B11-Flamer3", stat: "W-B11-Flamer3", weight: WEIGHT.HEAVY }, // plasmite
		],
		vtols: [
		],
		defenses: [
			{ res: "R0-B13b-Flamer1Bunker", stat: "S-B13b-Flamer1Bunker", defrole: DEFROLE.STANDALONE },
			{ res: "R0-B12b-Flamer2Bunker", stat: "S-B12b-Flamer2Bunker", defrole: DEFROLE.STANDALONE },
			{ res: "R0-B11b-Flamer3Bunker", stat: "S-B11b-Flamer3Bunker", defrole: DEFROLE.STANDALONE },
		],
		templates: [
		],
		extras: [
			"R0-B9-FlamerUpgrade3",
		],
	},
	flamers_AA: {
		roles: [ 0.0, 0.0, 0.0, 1.0],
		chatalias: "flaa",
		micro: MICRO.MELEE,
		weapons: [
			{ res: "", stat: "W-Z11-Scout", weight: WEIGHT.LIGHT },
		],
		vtols: [
			{ res: "R0-B13-Flamer1", stat: "W-B13-VTOLFlamer1", weight: WEIGHT.LIGHT, chance: 30 }, // flamer
			{ res: "R0-B12-Flamer2", stat: "W-B12-VTOLFlamer2", weight: WEIGHT.MEDIUM, chance: 50 }, // inferno
			{ res: "R0-B11-Flamer3", stat: "W-B11-VTOLFlamer3", weight: WEIGHT.HEAVY }, // plasmite
		],
		defenses: [
		],
		templates: [
		],
		extras: [
			"R0-B9-FlamerUpgrade3",
		],
	},
	cannons: {
		roles: [ 0.4, 0.0, 0.6, 0.0 ],
		chatalias: "cn",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R0-C13-Cannon1", stat: "W-C13-Cannon1", weight: WEIGHT.LIGHT, chance: 70 }, // lc
			{ res: "R0-C12-Cannon2", stat: "W-C12-Cannon2", weight: WEIGHT.MEDIUM, chance: 50 }, // mc
			{ res: "R0-C11-Cannon3", stat: "W-C11-Cannon3", weight: WEIGHT.HEAVY }, // hc
		],
		vtols: [
		],
		defenses: [
			{ res: "R0-C13-Cannon1", stat: "S-C13a-Cannon1Tower", defrole: DEFROLE.STANDALONE }, // lc tower
			{ res: "R0-C13b-Cannon1Bunker", stat: "S-C13b-Cannon1Bunker", defrole: DEFROLE.STANDALONE }, // lc tower
			{ res: "R0-C12-Cannon2", stat: "S-C12a-Cannon2Tower", defrole: DEFROLE.STANDALONE }, // mc tower
			{ res: "R0-C12b-Cannon2Bunker", stat: "S-C12b-Cannon2Bunker", defrole: DEFROLE.GATEWAY },
			{ res: "R0-C11-Cannon3", stat: "S-C11a-Cannon3Tower", defrole: DEFROLE.STANDALONE }, // mc tower
			{ res: "R0-C11b-Cannon3Bunker", stat: "S-C11b-Cannon3Bunker", defrole: DEFROLE.GATEWAY },
		],
		templates: [
		],
		extras: [
			"R0-C9-CannonUpgrade3",
		],
	},
	mortars: {
		roles: [ 0.5, 0.0, 0.5, 0.0 ],
		chatalias: "mo",
		micro: MICRO.DUMB,
		weapons: [
			{ res: "R0-F13-Mortar1", stat: "W-F13-Mortar1", weight: WEIGHT.LIGHT, chance: 50 },
			{ res: "R0-F12-Mortar2", stat: "W-F12-Mortar2", weight: WEIGHT.HEAVY, chance: 50 },
			{ res: "R0-F11-Mortar3", stat: "W-F11-Mortar3", weight: WEIGHT.HEAVY },
		],
		vtols: [
			{ res: "R0-F12-Mortar2", stat: "W-F12-VTOLMortar2", weight: WEIGHT.MEDIUM, chance: 50 },
			{ res: "R0-F11-Mortar3", stat: "W-F11-VTOLMortar3", weight: WEIGHT.HEAVY },
		],
		defenses: [
			{ res: "R0-F13-Mortar1", stat: "S-F13a-Mortar1Empl", defrole: DEFROLE.STANDALONE },
			{ res: "R0-F12-Mortar2", stat: "S-F12a-Mortar2Empl", defrole: DEFROLE.STANDALONE },
			{ res: "R0-F11-Mortar3", stat: "S-F11a-Mortar3Empl", defrole: DEFROLE.STANDALONE },
		],
		templates: [
		],
		extras: [
			"R0-F9-MortarUpgrade3",
		],
	},
	howitzers: {
		roles: [ 0.5, 0.0, 0.5, 0.0 ],
		chatalias: "hw",
		micro: MICRO.DUMB,
		weapons: [
			{ res: "R0-G13-Howitzer1", stat: "W-G13-Howitzer1", weight: WEIGHT.LIGHT, chance: 50 },
			{ res: "R0-G12-Howitzer2", stat: "W-G12-Howitzer2", weight: WEIGHT.HEAVY, chance: 50 },
			{ res: "R0-G11-Howitzer3", stat: "W-G11-Howitzer3", weight: WEIGHT.HEAVY },
		],
		vtols: [
		],
		defenses: [
			{ res: "R0-G13-Howitzer1", stat: "S-G13a-Howitzer1Empl", defrole: DEFROLE.STANDALONE },
			{ res: "R0-G12-Howitzer2", stat: "S-G12a-Howitzer2Empl", defrole: DEFROLE.STANDALONE },
			{ res: "R0-G11-Howitzer3", stat: "S-G11a-Howitzer3Empl", defrole: DEFROLE.STANDALONE },
		],
		templates: [
		],
		extras: [
			"R0-F9-HowitzerUpgrade3",
		],
	},
	rockets: {
		roles: [ 0.8, 0.0, 0.3, 0.0 ],
		chatalias: "rx",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R0-E13-Rocket1", stat: "W-E13-Rocket1", weight: WEIGHT.LIGHT, chance: 50 }, // pod
			{ res: "R0-E12-Rocket2", stat: "W-E12-Rocket2", weight: WEIGHT.MEDIUM, chance: 50 }, // mra
			{ res: "R0-E11-Rocket3", stat: "W-E11-Rocket3", weight: WEIGHT.HEAVY }, // mra
		],
		vtols: [
			{ res: "R0-E13-Rocket1", stat: "W-E13-VTOLRocket1", weight: WEIGHT.LIGHT }, // pod
			{ res: "R0-E12-Rocket2", stat: "W-E12-VTOLRocket2", weight: WEIGHT.MEDIUM }, // mra
			{ res: "R0-E11-Rocket3", stat: "W-E11-VTOLRocket3", weight: WEIGHT.HEAVY }, // ripple
		],
		defenses: [
			// rocket turtle AI needs early AT gateway towers, hence duplicate stat
			{ res: "R0-E13-Rocket1", stat: "S-E13a-Rocket1Empl", defrole: DEFROLE.GATEWAY }, // pod
			{ res: "R0-E13-Rocket1", stat: "S-E13a-Rocket1Empl", defrole: DEFROLE.STANDALONE }, // pod
			{ res: "R0-E12-Rocket2", stat: "S-E12a-Rocket2Empl", defrole: DEFROLE.GATEWAY }, // mra
			{ res: "R0-E12-Rocket2", stat: "S-E12a-Rocket2Empl", defrole: DEFROLE.STANDALONE }, // mra
			{ res: "R0-E11-Rocket3", stat: "S-E11a-Rocket3Empl", defrole: DEFROLE.GATEWAY },
			{ res: "R0-E11-Rocket3", stat: "S-E11a-Rocket3Empl", defrole: DEFROLE.STANDALONE },
		],
		templates: [
		],
		extras: [
			"R0-E9-RocketUpgrade3",
		],
	},
	rockets_AA: {
		roles: [ 0.0, 0.0, 0.0, 1.0 ],
		chatalias: "rxaa",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "", stat: "W-Z11-Scout", weight: WEIGHT.LIGHT, chance: 0 },
			{ res: "R0-E22-AARocket2", stat: "W-E22-AARocket2", weight: WEIGHT.MEDIUM },
		],
		vtols: [
			{ res: "R0-E13-Rocket1", stat: "W-E13-VTOLRocket1", weight: WEIGHT.LIGHT, chance: 40 }, // pod
			{ res: "R0-E12-Rocket2", stat: "W-E12-VTOLRocket2", weight: WEIGHT.MEDIUM, chance: 50 }, // mra
			{ res: "R0-E11-Rocket3", stat: "W-E11-VTOLRocket3", weight: WEIGHT.HEAVY }, // ripple
		],
		defenses: [
			{ res: "R0-E22-AARocket2", stat: "S-E22a-AARocket2Empl", defrole: DEFROLE.STANDALONE }, // sunburst
		],
		templates: [],
		extras: [],
	},
	missiles: {
		roles: [ 0.8, 0.0, 0.4, 0.0 ],
		chatalias: "ms",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R0-D13-Missile1", stat: "W-D13-Missile1", weight: WEIGHT.LIGHT, chance: 40 }, // lancer
			{ res: "R0-D12-Missile2", stat: "W-D12-Missile2", weight: WEIGHT.MEDIUM, chance: 50 }, // tk
			{ res: "R0-D11-Missile3", stat: "W-D11-Missile3", weight: WEIGHT.HEAVY }, // tk
		],
		vtols: [
			{ res: "R0-D13-Missile1", stat: "W-D13-VTOLMissile1", weight: WEIGHT.LIGHT, chance: 50 }, // lancer
			{ res: "R0-D12-Missile2", stat: "W-D12-VTOLMissile2", weight: WEIGHT.MEDIUM, chance: 50 }, // tk
			{ res: "R0-D11-Missile3", stat: "W-D11-VTOLMissile3", weight: WEIGHT.HEAVY }, // tk
		],
		defenses: [
			{ res: "R0-D13-Missile1", stat: "S-D13a-Missile1Tower", defrole: DEFROLE.STANDALONE },
			{ res: "R0-D12-Missile2", stat: "S-D12a-Missile2Tower", defrole: DEFROLE.STANDALONE },
			{ res: "R0-D11-Missile3", stat: "S-D11a-Missile3Tower", defrole: DEFROLE.STANDALONE },
			{ res: "R0-D13b-Missile1Bunker", stat: "S-D13b-Missile1Bunker", defrole: DEFROLE.GATEWAY }, // lancer bunker
			{ res: "R0-D12b-Missile2Bunker", stat: "S-D12b-Missile2Bunker", defrole: DEFROLE.GATEWAY }, // tk tower
			{ res: "R0-D11b-Missile3Bunker", stat: "S-D11b-Missile3Bunker", defrole: DEFROLE.GATEWAY }, // tk tower
		],
		templates: [
		],
		extras: [
			"R0-D9-MissileUpgrade3",
		],
	},
	missiles_AA: {
		roles: [ 0.0, 0.0, 0.0, 1.0 ],
		chatalias: "msaa",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R0-D22-AAMissile2", stat: "W-D22-AAMissile2", weight: WEIGHT.MEDIUM, chance: 50 },
			{ res: "R0-D21-AAMissile3", stat: "W-D21-AAMissile3", weight: WEIGHT.HEAVY },
		],
		vtols: [
			{ res: "R0-D13-Missile1", stat: "W-D13-VTOLMissile1", weight: WEIGHT.LIGHT, chance: 50 },
			{ res: "R0-D12-Missile2", stat: "W-D12-VTOLMissile2", weight: WEIGHT.MEDIUM, chance: 50 },
			{ res: "R0-D11-Missile3", stat: "W-D11-VTOLMissile3", weight: WEIGHT.HEAVY },
		],
		defenses: [
			{ res: "R0-D22-AAMissile2", stat: "S-D22a-AAMissile2Empl", defrole: DEFROLE.STANDALONE },
			{ res: "R0-D21-AAMissile3", stat: "S-D21a-AAMissile3Empl", defrole: DEFROLE.STANDALONE },
		],
		templates: [],
		extras: [],
	},
	useless: { // Non designable and scouting turrets that should not be used.
		roles: [ 0.0, 0.0, 0.0, 0.0],
		chatalias: "lol",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "", stat: "W-Z11-TowerScout", weight: WEIGHT.LIGHT },
			{ res: "", stat: "W-A13-TowerMG1", weight: WEIGHT.LIGHT },
			{ res: "", stat: "W-A12-TowerMG2", weight: WEIGHT.LIGHT },
			{ res: "", stat: "W-A11-TowerMG3", weight: WEIGHT.LIGHT },
			{ res: "", stat: "W-C13-TowerCannon1", weight: WEIGHT.LIGHT },
			{ res: "", stat: "W-C12-TowerCannon2", weight: WEIGHT.LIGHT },
			{ res: "", stat: "W-C11-TowerCannon3", weight: WEIGHT.LIGHT },
			{ res: "", stat: "W-D13-TowerMissile1", weight: WEIGHT.LIGHT },
			{ res: "", stat: "W-D12-TowerMissile2", weight: WEIGHT.LIGHT },
			{ res: "", stat: "W-D11-TowerMissile3", weight: WEIGHT.LIGHT },
		],
		vtols: [
		],
		defenses: [],
		templates: [],
		extras: [],
	}
};
