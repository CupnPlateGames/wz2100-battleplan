
const TECH_TWO = [
	"R-Wpn-MG1Mk1",
	"R-Wpn-Cannon1Mk1",
	"R-Wpn-Rocket05-MiniPod",
	"R-Wpn-Flamer01Mk1",
	"R-Wpn-Rocket01-LtAT",
	"R-Wpn-Mortar01Lt",
	"R-Wpn-HowitzerMk1",

	"R-Defense-TankTrap01",
	"R-Defense-HardcreteWall",
	"R-Defense-Tower01",
	"R-Defense-Tower-Cannon1Mk1",

	"R-Wpn-AAGun03",
	"R-Wpn-Sunburst",
	"R-Wpn-Missile-LtSAM",

	"R-Struc-RepairFacility",
	"R-Sys-MobileRepairTurret01",

	"R-Struc-Factory-Module",

	"R-Wpn-MG3Mk1",
	"R-Wpn-Flame2",
	"R-Wpn-Cannon2Mk1",
	"R-Wpn-Rocket02-MRL",
	"R-Wpn-Rocket07-Tank-Killer",
	"R-Wpn-Mortar02Hvy",
	"R-Wpn-HvyHowitzer",

	"R-Wpn-MG-ROF01",
	"R-Wpn-Flamer-ROF01",
	"R-Wpn-Cannon-ROF01",
	"R-Wpn-Rocket-ROF01",
	"R-Wpn-Missile-ROF01",
	"R-Wpn-Mortar-ROF01",
	"R-Wpn-Howitzer-ROF01"
];

const TECH_THREE = [

	"R-Wpn-MG-ROF02",
	"R-Wpn-Flamer-ROF02",
	"R-Wpn-Cannon-ROF02",
	"R-Wpn-Rocket-ROF02",
	"R-Wpn-Missile-ROF02",
	"R-Wpn-Mortar-ROF02",
	"R-Wpn-Howitzer-ROF02"
];

//Automatically research these items for the player.
function grantTech(tech)
{
     var len = tech.length;
     for (var c = 0; c < maxPlayers; ++c)
     {
          for (var i = 0; i < len; ++i)
          {
               completeResearch(tech[i], c);
          }
     }
}

//Makes these items available for research.
function enableTech(tech)
{
     var len = tech.length;
     for (var c = 0; c < maxPlayers; ++c)
     {
          for (var i = 0; i < len; ++i)
          {
               enableResearch(tech[i], c);
          }
     }
}
