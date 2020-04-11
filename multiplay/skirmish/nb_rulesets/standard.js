
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
const randomTemplates = 0;

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
	extras: [ "A0RepairCentre3", "A0Sat-linkCentre", "A0LasSatCommand", ],
	sensors: [ "Sys-SensoTower02", "Sys-CB-Tower01", "Sys-RadarDetector01", "Sys-SensoTowerWS", ],
};

const oilResources = [ "OilResource", ];

const powerUps = [ "OilDrum", "Crate" ];

// NOTE: you cannot use specific stats as bases, but only stattypes
// probably better make use of .name rather than of .stattype here?
const modules = [
	{ base: POWER_GEN, module: "A0PowMod1", count: 1, cost: MODULECOST.CHEAP },
	{ base: FACTORY, module: "A0FacMod1", count: 2, cost: MODULECOST.EXPENSIVE },
	{ base: VTOL_FACTORY, module: "A0FacMod1", count: 2, cost: MODULECOST.EXPENSIVE },
	{ base: RESEARCH_LAB, module: "A0ResearchModule1", count: 1, cost: MODULECOST.EXPENSIVE },
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

];

const fastestResearch = [

];

// body and propulsion arrays don't affect fixed template droids
const bodyStats = [
	{ res: "", stat: "Body1REC", weight: WEIGHT.LIGHT, usage: BODYUSAGE.UNIVERSAL, armor: BODYCLASS.KINETIC }, // viper
	{ res: "R-Struc-Factory-Module", stat: "Body5REC", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // cobra
	{ res: "R-Vehicle-Metals01", stat: "Body11ABT", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // python
	{ res: "", stat: "Body2SUP", weight: WEIGHT.LIGHT, usage: BODYUSAGE.UNIVERSAL, armor: BODYCLASS.KINETIC }, // leopard
	{ res: "R-Struc-Factory-Module", stat: "Body6SUPP", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // panther
	{ res: "R-Vehicle-Metals01", stat: "Body9REC", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // tiger
	{ res: "", stat: "Body4ABT", weight: WEIGHT.LIGHT, usage: BODYUSAGE.UNIVERSAL, armor: BODYCLASS.KINETIC }, // bug
	{ res: "R-Struc-Factory-Module", stat: "Body8MBT", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // scorpion
	{ res: "R-Vehicle-Metals01", stat: "Body12SUP", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // mantis
	{ res: "R-Vehicle-Body03", stat: "Body3MBT", weight: WEIGHT.LIGHT, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // retaliation
	{ res: "R-Vehicle-Body07", stat: "Body7ABT", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // retribution
	{ res: "R-Vehicle-Body10", stat: "Body10MBT", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // vengeance
];

const classResearch = {
	kinetic: [
		[ // OBJTYPE.TANK
		],
		[ // OBJTYPE.BORG
		],
		[ // OBJTYPE.DEFS
		],
		[ // OBJTYPE.VTOL
		],
	],
	thermal: [ // Same as above
		[
		],
		[
		],
		[
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
	machineguns: {
		// How good weapons of this path are against tanks, borgs, defenses, vtols?
		// The sum of the four should be equal to 1.
		roles: [ 0.8, 0.0, 0.1, 0.1 ],
		// This explains how are human players supposed to call this weapon path in the chat.
		chatalias: "mg",
		// This controls micromanagement of units based on the weapons of this path.
		micro: MICRO.RANGED,
		// Weapons of the path, better weapons below.
		weapons: [
			{ res: "R-Wpn-MG1Mk1", stat: "MG1Mk1", weight: WEIGHT.LIGHT }, // mg
			{ res: "R-Wpn-MG3Mk1", stat: "MG3Mk1", weight: WEIGHT.MEDIUM }, // hmg
			{ res: "R-Wpn-MG4", stat: "MG4ROTARYMk1", weight: WEIGHT.HEAVY },
		],
		// VTOL weapons of the path, in the same order.
		vtols: [
			{ res: "R-Wpn-MG1Mk1", stat: "MG1-VTOL", weight: WEIGHT.LIGHT }, // vtol mg
			{ res: "R-Wpn-MG3Mk1", stat: "MG3-VTOL", weight: WEIGHT.MEDIUM }, // vtol hmg
			{ res: "R-Wpn-MG4", stat: "MG4ROTARY-VTOL", weight: WEIGHT.MEDIUM }, // vtol hmg
		],
		// Defensive structures of the path, in the same order.
		// NOTE: a defensive structure is recycled whenever there are at least two structures
		// with the same role available down the list
		defenses: [
			// turtle AI needs early versatile towers, hence duplicate stat
			{ res: "R-Wpn-MG1Mk1", stat: "GuardTower1", defrole: DEFROLE.GATEWAY }, // mg tower
			{ res: "R-Wpn-MG1Mk1", stat: "GuardTower1", defrole: DEFROLE.STANDALONE }, // mg tower
			{ res: "R-Defense-Pillbox01", stat: "PillBox1", defrole: DEFROLE.GATEWAY }, // mg bunker
			{ res: "R-Defense-Pillbox01", stat: "PillBox1", defrole: DEFROLE.STANDALONE }, // mg bunker
			{ res: "R-Wpn-MG3Mk1", stat: "GuardTower3", defrole: DEFROLE.GATEWAY }, // hmg tower
			{ res: "R-Wpn-MG3Mk1", stat: "GuardTower3", defrole: DEFROLE.STANDALONE }, // hmg tower
			{ res: "R-Defense-MG3-Bunker", stat: "PillBox3", defrole: DEFROLE.GATEWAY }, // hmg bunker
			{ res: "R-Defense-MG3-Bunker", stat: "PillBox3", defrole: DEFROLE.STANDALONE }, // hmg bunker
		],
		// Cyborg templates, better borgs below, as usual.
		templates: [
		],
		// Extra things to research on this path, even if they don't lead to any new stuff
		extras: [
			"R-Wpn-MG-ROF03",
		],
	},
	machineguns_AA: {
		roles: [ 0.2, 0.0, 0.0, 0.8 ],
		chatalias: "mg",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R-Wpn-AAGun03", stat: "QuadMg1AAGun", weight: WEIGHT.MEDIUM }, // mg
		],
		vtols: [
			{ res: "R-Wpn-MG1Mk1", stat: "MG1-VTOL", weight: WEIGHT.LIGHT }, // vtol mg
			{ res: "R-Wpn-MG3Mk1", stat: "MG3-VTOL", weight: WEIGHT.MEDIUM }, // vtol hmg
			{ res: "R-Wpn-MG4", stat: "MG4ROTARY-VTOL", weight: WEIGHT.MEDIUM }, // vtol hmg
		],
		defenses: [
			{ res: "R-Wpn-AAGun03", stat: "AASite-QuadMg1", defrole: DEFROLE.STANDALONE },
		],
		templates: [
		],
		extras: [
		],
	},
	flamers: {
		roles: [ 1.0, 0.0, 0.0, 0.0 ],
		chatalias: "fl",
		micro: MICRO.MELEE,
		weapons: [
			{ res: "R-Wpn-Flamer01Mk1", stat: "Flame1Mk1", weight: WEIGHT.LIGHT }, // flamer
			{ res: "R-Wpn-Flame2", stat: "Flame2", weight: WEIGHT.MEDIUM }, // inferno
			{ res: "R-Wpn-Plasmite-Flamer", stat: "PlasmiteFlamer", weight: WEIGHT.HEAVY }, // plasmite
		],
		vtols: [],
		defenses: [
			{ res: "R-Defense-Pillbox05", stat: "PillBox5", defrole: DEFROLE.STANDALONE },
			{ res: "R-Defense-HvyFlamer", stat: "Tower-Projector", defrole: DEFROLE.STANDALONE },
			{ res: "R-Defense-PlasmiteFlamer", stat: "Plasmite-flamer-bunker", defrole: DEFROLE.STANDALONE },
		],
		templates: [
		],
		extras: [
			"R-Wpn-Flamer-ROF03",
		],
	},
	cannons: {
		roles: [ 0.5, 0.0, 0.5, 0.0 ],
		chatalias: "cn",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R-Wpn-Cannon1Mk1", stat: "Cannon1Mk1", weight: WEIGHT.LIGHT }, // lc
			{ res: "R-Wpn-Cannon2Mk1", stat: "Cannon2A-TMk1", weight: WEIGHT.MEDIUM }, // mc
			{ res: "R-Wpn-Cannon3Mk1", stat: "Cannon375mmMk1", weight: WEIGHT.HEAVY }, // hc
		],
		vtols: [
		],
		defenses: [
			{ res: "R-Wpn-Cannon1Mk1", stat: "GuardTowerLightCannon", defrole: DEFROLE.STANDALONE }, // lc tower
			{ res: "R-Defense-Pillbox04", stat: "PillBox4", defrole: DEFROLE.STANDALONE }, // lc tower
			{ res: "R-Wpn-Cannon2Mk1", stat: "MediumCannon-Tower", defrole: DEFROLE.STANDALONE }, // mc tower
			{ res: "R-Defense-MediumCannon-Bunker", stat: "MediumCannon-Bunker", defrole: DEFROLE.GATEWAY },
			{ res: "R-Wpn-Cannon3Mk1", stat: "HeavyCannon-Tower", defrole: DEFROLE.STANDALONE }, // mc tower
			{ res: "R-Defense-HeavyCannon-Bunker", stat: "HeavyCannon-Bunker", defrole: DEFROLE.GATEWAY },
		],
		templates: [
		],
		extras: [
			"R-Wpn-Cannon-ROF03",
		],
	},
	mortars: {
		roles: [ 0.5, 0.0, 0.5, 0.0 ],
		chatalias: "mo",
		micro: MICRO.DUMB,
		weapons: [
			{ res: "R-Wpn-Mortar01Lt", stat: "Mortar1Mk1", weight: WEIGHT.LIGHT }, // duplicate stat!
			{ res: "R-Wpn-HowitzerMk1", stat: "Howitzer105Mk1", weight: WEIGHT.LIGHT },
			{ res: "R-Wpn-Mortar02Hvy", stat: "Mortar2Mk1", weight: WEIGHT.MEDIUM },
			{ res: "R-Wpn-HvyHowitzer", stat: "Howitzer150Mk1", weight: WEIGHT.MEDIUM },
			{ res: "R-Wpn-Mortar3", stat: "Mortar3ROTARYMk1", weight: WEIGHT.HEAVY },
			{ res: "R-Wpn-Howitzer03-Rot", stat: "Howitzer03-Rot", weight: WEIGHT.HEAVY },
		],
		vtols: [
		],
		defenses: [
			{ res: "R-Wpn-Mortar01Lt", stat: "Emplacement-MortarPit01", defrole: DEFROLE.STANDALONE },
			{ res: "R-Wpn-Mortar02Hvy", stat: "Emplacement-MortarPit02", defrole: DEFROLE.STANDALONE },
			{ res: "R-Wpn-HowitzerMk1", stat: "Emplacement-Howitzer105", defrole: DEFROLE.STANDALONE },
			{ res: "R-Wpn-HvyHowitzer", stat: "Emplacement-Howitzer150", defrole: DEFROLE.STANDALONE },
			{ res: "R-Wpn-Mortar3", stat: "Emplacement-RotMor", defrole: DEFROLE.STANDALONE },
			{ res: "R-Wpn-Howitzer03-Rot", stat: "Emplacement-RotHow", defrole: DEFROLE.STANDALONE },
		],
		templates: [
		],
		extras: [
			"R-Wpn-Mortar-ROF03",
			"R-Wpn-Howitzer-ROF03",
		],
	},
	rockets_AT: {
		roles: [ 1.0, 0.0, 0.0, 0.0 ],
		chatalias: "rx",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R-Wpn-Rocket05-MiniPod", stat: "Rocket-Pod", weight: WEIGHT.LIGHT }, // pod
			{ res: "R-Wpn-Rocket01-LtAT", stat: "Rocket-LtA-T", weight: WEIGHT.LIGHT }, // lancer
			{ res: "R-Wpn-Rocket02-MRL", stat: "Rocket-MRL", weight: WEIGHT.MEDIUM }, // mra
			{ res: "R-Wpn-Rocket07-Tank-Killer", stat: "Rocket-HvyA-T", weight: WEIGHT.MEDIUM }, // tk
			{ res: "R-Wpn-Rocket06-IDF", stat: "Rocket-IDF", weight: WEIGHT.HEAVY }, // mra
			{ res: "R-Wpn-Missile2A-T", stat: "Missile-A-T", weight: WEIGHT.HEAVY }, // tk
		],
		vtols: [
			{ res: "R-Wpn-Rocket05-MiniPod", stat: "Rocket-VTOL-Pod", weight: WEIGHT.LIGHT }, // pod
			{ res: "R-Wpn-Rocket01-LtAT", stat: "Rocket-VTOL-LtA-T", weight: WEIGHT.LIGHT }, // lancer
			{ res: "R-Wpn-Rocket07-Tank-Killer", stat: "Rocket-VTOL-HvyA-T", weight: WEIGHT.MEDIUM }, // tk
			{ res: "R-Wpn-Missile2A-T", stat: "Missile-VTOL-AT", weight: WEIGHT.HEAVY }, // tk
		],
		defenses: [
			// rocket turtle AI needs early AT gateway towers, hence duplicate stat
			{ res: "R-Defense-Lancer-Bunker", stat: "PillBox6", defrole: DEFROLE.GATEWAY }, // lancer bunker
			{ res: "R-Wpn-Rocket05-MiniPod", stat: "GuardTower6", defrole: DEFROLE.STANDALONE }, // pod
			{ res: "R-Defense-TankKiller-Bunker", stat: "TankKiller-Bunker", defrole: DEFROLE.GATEWAY }, // tk tower
			{ res: "R-Wpn-Rocket02-MRL", stat: "Emplacement-MRL-pit", defrole: DEFROLE.STANDALONE }, // mra
			{ res: "R-Defense-Scourge-Bunker", stat: "Scourge-Bunker", defrole: DEFROLE.GATEWAY }, // tk tower
			{ res: "R-Wpn-Rocket06-IDF", stat: "Emplacement-Rocket06-IDF", defrole: DEFROLE.STANDALONE }, // mra
		],
		templates: [
		],
		extras: [
			"R-Wpn-Missile-ROF03",
			"R-Wpn-Rocket-ROF03",
		],
	},
	rockets_AA: {
		roles: [ 0.0, 0.0, 0.0, 1.0 ],
		chatalias: "rxaa",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R-Wpn-Sunburst", stat: "Rocket-Sunburst", weight: WEIGHT.LIGHT }, // sunburst
			{ res: "R-Wpn-Missile-LtSAM", stat: "Missile-LtSAM", weight: WEIGHT.LIGHT }, // avenger
		],
		vtols: [
			{ res: "R-Wpn-Rocket05-MiniPod", stat: "Rocket-VTOL-Pod", weight: WEIGHT.LIGHT }, // pod
		],
		defenses: [
			{ res: "R-Wpn-Sunburst", stat: "P0-AASite-Sunburst", defrole: DEFROLE.STANDALONE }, // sunburst
			{ res: "R-Wpn-Missile-LtSAM", stat: "P0-AASite-SAM1", defrole: DEFROLE.STANDALONE }, // avenger
		],
		templates: [],
		extras: [],
	},
	useless: {
		roles: [ 0.0, 0.0, 0.0, 0.0],
		chatalias: "lol",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "", stat: "Scout", weight: WEIGHT.LIGHT },
		],
		vtols: [],
		defenses: [],
		templates: [],
		extras: [],
	}
};
