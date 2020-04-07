
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
	{ res: "R-Vehicle-Body01", stat: "Body1REC", weight: WEIGHT.LIGHT, usage: BODYUSAGE.UNIVERSAL, armor: BODYCLASS.KINETIC }, // viper
	{ res: "R-Struc-Factory-Module", stat: "Body5REC", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // cobra
//	{ res: "R-Vehicle-Body11", stat: "Body11ABT", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // python
	{ res: "R-Vehicle-Body02", stat: "Body2SUP", weight: WEIGHT.LIGHT, usage: BODYUSAGE.UNIVERSAL, armor: BODYCLASS.KINETIC }, // leopard
	{ res: "R-Struc-Factory-Module", stat: "Body6SUPP", weight: WEIGHT.MEDIUM, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.KINETIC }, // panther
//	{ res: "R-Vehicle-Body09", stat: "Body9REC", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.KINETIC }, // tiger
	{ res: "R-Vehicle-Body04", stat: "Body4ABT", weight: WEIGHT.LIGHT, usage: BODYUSAGE.UNIVERSAL, armor: BODYCLASS.THERMAL }, // bug
	{ res: "R-Struc-Factory-Module", stat: "Body8MBT", weight: WEIGHT.HEAVY, usage: BODYUSAGE.COMBAT, armor: BODYCLASS.THERMAL }, // scorpion
//	{ res: "R-Vehicle-Body12", stat: "Body12SUP", weight: WEIGHT.HEAVY, usage: BODYUSAGE.GROUND, armor: BODYCLASS.THERMAL }, // mantis
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
	{ res: "R-Vehicle-Prop-Wheels", stat: "wheeled01", usage: PROPULSIONUSAGE.GROUND },
	{ res: "R-Vehicle-Prop-Halftracks", stat: "HalfTrack", usage: PROPULSIONUSAGE.GROUND },
	{ res: "R-Vehicle-Prop-Tracks", stat: "tracked01", usage: PROPULSIONUSAGE.GROUND },
	{ res: "R-Vehicle-Prop-Hover", stat: "hover01", usage: PROPULSIONUSAGE.HOVER },
	{ res: "R-Vehicle-Prop-VTOL", stat: "V-Tol", usage: PROPULSIONUSAGE.VTOL },
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
		],
		// VTOL weapons of the path, in the same order.
		vtols: [
			{ res: "R-Wpn-MG1Mk1", stat: "MG1-VTOL", weight: WEIGHT.LIGHT }, // vtol mg
			{ res: "R-Wpn-MG3Mk1", stat: "MG3-VTOL", weight: WEIGHT.MEDIUM }, // vtol hmg
		],
		// Defensive structures of the path, in the same order.
		// NOTE: a defensive structure is recycled whenever there are at least two structures
		// with the same role available down the list
		defenses: [
			// turtle AI needs early versatile towers, hence duplicate stat
			{ res: "R-Defense-Tower01", stat: "GuardTower1", defrole: DEFROLE.GATEWAY }, // hmg tower
			{ res: "R-Defense-Tower01", stat: "GuardTower1", defrole: DEFROLE.STANDALONE }, // hmg tower
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
		],
		vtols: [],
		defenses: [
		],
		templates: [
		],
		extras: [
			"R-Wpn-Flamer-ROF03",
			"R-Wpn-Flamer-Damage09",
		],
	},
	cannons: {
		roles: [ 0.5, 0.0, 0.5, 0.0 ],
		chatalias: "cn",
		micro: MICRO.RANGED,
		weapons: [
			{ res: "R-Wpn-Cannon1Mk1", stat: "Cannon1Mk1", weight: WEIGHT.LIGHT }, // lc
			{ res: "R-Wpn-Cannon2Mk1", stat: "Cannon2A-TMk1", weight: WEIGHT.MEDIUM }, // mc
		],
		vtols: [
		],
		defenses: [
			{ res: "R-Defense-Tower-Cannon1Mk1", stat: "GuardTowerLightCannon", defrole: DEFROLE.STANDALONE }, // lc tower
			{ res: "R-Defense-Tower-Cannon1Mk1", stat: "GuardTowerLightCannon", defrole: DEFROLE.STANDALONE }, // lc tower
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
		],
		vtols: [
		],
		defenses: [
			{ res: "R-Wpn-Mortar01Lt", stat: "Emplacement-MortarPit01", defrole: DEFROLE.STANDALONE },
			{ res: "R-Wpn-Mortar02Hvy", stat: "Emplacement-MortarPit02", defrole: DEFROLE.STANDALONE },
			{ res: "R-Wpn-HowitzerMk1", stat: "Emplacement-Howitzer105", defrole: DEFROLE.STANDALONE },
			{ res: "R-Wpn-HvyHowitzer", stat: "Emplacement-Howitzer150", defrole: DEFROLE.STANDALONE },
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
		],
		vtols: [
			{ res: "R-Wpn-Rocket05-MiniPod", stat: "Rocket-VTOL-Pod", weight: WEIGHT.LIGHT }, // pod
			{ res: "R-Wpn-Rocket01-LtAT", stat: "Rocket-VTOL-LtA-T", weight: WEIGHT.LIGHT }, // lancer
			{ res: "R-Wpn-Rocket07-Tank-Killer", stat: "Rocket-VTOL-HvyA-T", weight: WEIGHT.MEDIUM }, // tk
		],
		defenses: [
			// rocket turtle AI needs early AT gateway towers, hence duplicate stat
			{ res: "R-Wpn-Rocket05-MiniPod", stat: "GuardTower6", defrole: DEFROLE.GATEWAY }, // pod tower
			{ res: "R-Wpn-Rocket05-MiniPod", stat: "GuardTower6", defrole: DEFROLE.STANDALONE }, // pod tower
		],
		templates: [
		],
		extras: [
			"R-Wpn-Missile-ROF03",
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
			{ res: "R-Wpn-Sunburst", stat: "Rocket-VTOL-Sunburst", weight: WEIGHT.LIGHT }, // sunburst a2a
		],
		defenses: [
			{ res: "R-Wpn-Sunburst", stat: "P0-AASite-Sunburst", defrole: DEFROLE.STANDALONE }, // sunburst
			{ res: "R-Wpn-Missile-LtSAM", stat: "P0-AASite-SAM1", defrole: DEFROLE.STANDALONE }, // avenger
		],
		templates: [],
		extras: [],
	},
};
