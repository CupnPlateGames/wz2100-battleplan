
const BASE_STRUCTURES = {
	factories: [ "A0LightFactory", ],
	templateFactories: [ ],
	vtolFactories: [ "A0VTolFactory1", ],
	labs: [ "A0ResearchFacility", ],
	gens: [ "A0PowerGenerator", ],
	hqs: [ "A0CommandCentre", ],
	vtolPads: [ "A0VtolPad", ],
	derricks: [ "A0ResourceExtractor", ],
	uplinks: [ "A0Sat-linkCentre", ],
	repairBays: [ "A0RepairCentre3", ],
	lassats: [ "A0LasSatCommand", ],
	sensors: [ "Sys-SensoTower02", "Sys-SensoTowerWS", ],
};

const FEATURE_STATS = {
	oils: [ "OilResource", ],
};

const STANDARD_TARGET_WEIGHTS = [
	{stat: FACTORY, value: 10,},
	{stat: VTOL_FACTORY, value: 9,},
	{stat: RESOURCE_EXTRACTOR, value: 20,},
	{stat: HQ, value: 8,},
	{stat: RESEARCH_LAB, value: 7,},
	{stat: POWER_GEN, value: 7,},
	{stat: LASSAT, value: 6,},
	{stat: SAT_UPLINK, value: 6,},
	{stat: REARM_PAD, value: 5,},
	{stat: REPAIR_FACILITY, value: 5,},
];

const STANDARD_MORTAR_DEFENSES = [
	"S-F13a-Mortar1Empl",
	"S-F12a-Mortar2Empl",
	"S-F11a-Mortar3Empl",
];

const STANDARD_HOWITZER_DEFENSES = [
	"S-G13a-Howitzer1Empl",
	"S-G12a-Howitzer2Empl",
	"S-G11a-Howitzer3Empl",
];

const STANDARD_INCENDIARIES = [
];

const STANDARD_ANTI_AIR_DEFENSES = [
	"LookOutTower",
	"S-A22a-AAMG2Empl",
	"S-E22a-AARocket2Empl",
	"S-D22a-AAMissile2Empl",
	"S-A21a-AAMG3Empl",
	"S-D21a-AAMissile3Empl",
];

//Always builds one of these structures in base.
const STANDARD_BUILD_FUNDAMENTALS = [
	"A0LightFactory",
	"A0ResearchFacility",
	"A0PowerGenerator",
	"A0CommandCentre",
	"A0RepairCentre3",
	"Sys-CB-Tower01",
	"A0LasSatCommand",
	"A0Sat-linkCentre",
];

//NOTE: Nexus estimates the "bounds" of an ally base by enumerating all of these. Kind of like "territory".
const STANDARD_BASE_STRUCTURES = [
	"A0PowerGenerator",
	"A0LightFactory",
	"A0CommandCentre",
	"A0ResearchFacility",
	"A0LasSatCommand",
	"A0Sat-linkCentre",
	"A0VTolFactory1",
];

// NOTE: Apparently, these are randomly selected to an extend.
const STANDARD_BASIC_DEFENSES = [
	"LookOutTower",
	"S-A13a-MG1Tower",
	"S-A13b-MG1Bunker",
	"S-B13a-Flamer1Tower",
	"S-B13b-Flamer1Bunker",
	"S-C13a-Cannon1Tower",
	"S-C13b-Cannon1Bunker",
	"S-E13a-Rocket1Empl",
	"S-D13a-Missile1Tower",
	"S-D13b-Missile1Bunker",
	"S-F13a-Mortar1Empl",
	"S-G13a-Howitzer1Empl",
	"S-A12a-MG2Tower",
	"S-A12b-MG2Bunker",
	"S-B12a-Flamer2Tower",
	"S-B12b-Flamer2Bunker",
	"S-C12a-Cannon2Tower",
	"S-C12b-Cannon2Bunker",
	"S-E12a-Rocket2Empl",
	"S-D12a-Missile2Tower",
	"S-D12b-Missile2Bunker",
	"S-F12a-Mortar2Empl",
	"S-G12a-Howitzer2Empl",
	"S-A11a-MG3Tower",
	"S-A11b-MG3Bunker",
	"S-B11a-Flamer3Tower",
	"S-B11b-Flamer3Bunker",
	"S-C11a-Cannon3Tower",
	"S-C11b-Cannon3Bunker",
	"S-E11a-Rocket3Empl",
	"S-D11a-Missile3Tower",
	"S-D11b-Missile3Bunker",
	"S-F11a-Mortar3Empl",
	"S-G11a-Howitzer3Empl",
];

// NOTE: build on the ourskirt of the base "territory"
const STANDARD_FORTIFY_DEFENSES = [
	"S-A13a-MG1Tower",
	"S-A13b-MG1Bunker",
	"S-C13a-Cannon1Tower",
	"S-C13b-Cannon1Bunker",
	"S-D13a-Missile1Tower",
	"S-D13b-Missile1Bunker",
	"S-A12a-MG2Tower",
	"S-A12b-MG2Bunker",
	"S-C12a-Cannon2Tower",
	"S-C12b-Cannon2Bunker",
	"S-D12a-Missile2Tower",
	"S-D12b-Missile2Bunker",
	"S-A11a-MG3Tower",
	"S-A11b-MG3Bunker",
	"S-C11a-Cannon3Tower",
	"S-C11b-Cannon3Bunker",
	"S-D11a-Missile3Tower",
	"S-D11b-Missile3Bunker",
];

//NOTE: if any of these are destroyed, requeue them for a rebuilt at that spot.
const STANDARD_REBUILD_STRUCTURES = [
	{type: WALL, stat: "A0TankTrap", name: "Tank Traps"},
	{type: WALL, stat: "A0HardcreteMk1Wall", name: "Hardcrete Wall"},
	{type: WALL, stat: "A0HardcreteMk1CWall", name: "Hardcrete Corner Wall"},
];
