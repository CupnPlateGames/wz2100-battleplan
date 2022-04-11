/** List of techs that can be researched from start */
const TECH_STARTERS = [
	"R0-A13-MG1",
	"R0-C13-Cannon1",
	"R0-E13-Rocket1",
	"R-Defense-HardcreteWall",
	"R0-B13-Flamer1",
	"R0-D13-Missile1",
	"R0-F13-Mortar1",
	"R0-G13-Howitzer1",
	"R0-L3-Repair1",
	"R-Vehicle-Body05",
	"R-Vehicle-Body03",
	"R-Sys-Sensor-Turret01",
];

/** List of techs already researched when playing with an established base */
const TECH_BASE = [
	"R0-A13-MG1",
	"R0-C13-Cannon1",
	"R0-E13-Rocket1",
	"R-Defense-HardcreteWall",
]

/** List of further techs already researched when playing with an advanced (walled) base */
const TECH_ADVANCED_BASE = [
	"R0-B13-Flamer1",
	"R0-D13-Missile1",
	"R0-F13-Mortar1",
	"R0-G13-Howitzer1",
	"R0-A22-AAMG2",
	"R0-E22-AARocket2",
	"R0-D22-AAMissile2",
	"R-Vehicle-Body05",
	"R-Vehicle-Body03",
	"R-Sys-Sensor-Turret01"
];

/** List of techs already researched when starting from tech level 2 */
const TECH_TWO = [
	"R0-A13-MG1",
	"R0-B13-Flamer1",
	"R0-C13-Cannon1",
	"R0-D13-Missile1",
	"R0-E13-Rocket1",
	"R0-F13-Mortar1",
	"R0-G13-Howitzer1",

	"R-Defense-HardcreteWall",
	"R0-A13b-MG1Bunker",
	"R0-B13b-Flamer1Bunker",
	"R0-C13b-Cannon1Bunker",
	"R0-D13b-Missile1Bunker",

	"R0-A22-AAMG2",
	"R0-E22-AARocket2",
	"R0-D22-AAMissile2",

	"R-Sys-Sensor-Turret01",
	"R0-L3-Repair1",

	"R-Vehicle-Body05",

	"R0-A12-MG2",
	"R0-B12-Flamer2",
	"R0-C12-Cannon2",
	"R0-E12-Rocket2",
	"R0-D12-Missile2",
	"R0-F12-Mortar2",
	"R0-G12-Howitzer2",

	"R0-A12b-MG2Bunker",
	"R0-B12b-Flamer2Bunker",
	"R0-C12b-Cannon2Bunker",
	"R0-D12b-Missile2Bunker",

	"R-Defense-WallUpgrade01",

	"R0-A9-MGUpgrade1",
	"R0-B9-FlamerUpgrade1",
	"R0-C9-CannonUpgrade1",
	"R0-D9-MissileUpgrade1",
	"R0-E9-RocketUpgrade1",
	"R0-F9-MortarUpgrade1",
	"R0-G9-HowitzerUpgrade1"
];

/** List of techs already researched when starting from tech level 3 */
const TECH_THREE = [
	"R-Vehicle-Metals01",
	"R-Defense-WallUpgrade02",
	"R-Vehicle-Body11",

	"R0-A21-AAMG3",
	"R0-D21-AAMissile3",

	"R0-A11-MG3",
	"R0-B11-Flamer3",
	"R0-C11-Cannon3",
	"R0-E11-Rocket3",
	"R0-D11-Missile3",
	"R0-F11-Mortar3",
	"R0-G11-Howitzer3",

	"R0-A11b-MG3Bunker",
	"R0-B11b-Flamer3Bunker",
	"R0-C11b-Cannon3Bunker",
	"R0-D11b-Missile3Bunker",

	"R0-A9-MGUpgrade2",
	"R0-B9-FlamerUpgrade2",
	"R0-C9-CannonUpgrade2",
	"R0-D9-MissileUpgrade2",
	"R0-E9-RocketUpgrade2",
	"R0-F9-MortarUpgrade2",
	"R0-G9-HowitzerUpgrade2",

	"R-Sys-CBSensor-Turret01",
	"R0-L2-Repair2",
];

/** List of techs already researched when starting from tech level 4 */
const TECH_FOUR = [
	"R-Vehicle-Metals02",
	"R-Vehicle-Metals03",
	"R-Defense-WallUpgrade03",
	"R-Vehicle-Body03",
	"R-Vehicle-Body07",
	"R-Vehicle-Body10",

	"R0-A9-MGUpgrade3",
	"R0-B9-FlamerUpgrade3",
	"R0-C9-CannonUpgrade3",
	"R0-D9-MissileUpgrade3",
	"R0-E9-RocketUpgrade3",
	"R0-F9-MortarUpgrade3",
	"R0-G9-HowitzerUpgrade3",

	"R-Sys-Autorepair-General",
	"R-Sys-Sensor-WS",
	"R-Sys-RadarDetector01"
];

/** List of bunkers researches sorted by weapon research */
const BUNKER_PAIRS = {
	"R0-A13-MG1": "R0-A13b-MG1Bunker",
	"R0-C13-Cannon1": "R0-C13b-Cannon1Bunker",
	"R0-B13-Flamer1": "R0-B13b-Flamer1Bunker",
	"R0-D13-Missile1": "R0-D13b-Missile1Bunker",

	"R0-A12-MG2": "R0-A12b-MG2Bunker",
	"R0-B12-Flamer2": "R0-B12b-Flamer2Bunker",
	"R0-C12-Cannon2": "R0-C12b-Cannon2Bunker",
	"R0-D12-Missile2": "R0-D12b-Missile2Bunker",

	"R0-A11-MG3": "R0-A11b-MG3Bunker",
	"R0-B11-Flamer3": "R0-B11b-Flamer3Bunker",
	"R0-C11-Cannon3": "R0-C11b-Cannon3Bunker",
	"R0-D11-Missile3": "R0-D11b-Missile3Bunker",
};

/** Makes an array of techs available for research for a player */
function enableTech(tech, playnum)
{
	for (var i = 0; i < tech.length; i++)
	{
		enableResearch(tech[i], playnum);
	}
}

/** Complete research of an array of techs for a player */
function grantTech(tech, playnum)
{
	for (var i = 0; i < tech.length; i++)
	{
		completeResearch(tech[i], playnum);
	}
}
