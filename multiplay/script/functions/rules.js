//
// Skirmish Base Script.
//
// contains the rules for starting and ending a game.
// as well as warning messages.
//
// /////////////////////////////////////////////////////////////////

receiveAllEvents(true);  // If doing this in eventGameInit, it seems to be too late in T2/T3, due to some eventResearched events triggering first.

include("multiplay/script/camTechEnabler.js");
include("multiplay/script/weather.js");

var lastHitTime = 0;
var cheatmode = false;
var maxOilDrums = 0;
var mainReticule = false;

const CREATE_LIKE_EVENT = 0;
const DESTROY_LIKE_EVENT = 1;
const TRANSFER_LIKE_EVENT = 2;

function reticuleManufactureCheck()
{
	var structureComplete = false;
	var facs = [FACTORY, CYBORG_FACTORY, VTOL_FACTORY,];

	for (var i = 0, len = facs.length; i < len; ++i)
	{
		var onMapFacs = enumStruct(selectedPlayer, facs[i]);
		for (var j = 0, len2 = onMapFacs.length; j < len2; ++j)
		{
			if (onMapFacs[j].status === BUILT)
			{
				structureComplete = true;
				break;
			}
		}
	}

	if (structureComplete === true)
	{
		setReticuleButton(1, _("Manufacture (F1)"), "image_manufacture_up.png", "image_manufacture_down.png");
	}
	else
	{
		setReticuleButton(1, _("Manufacture - build factory first"), "", "");
	}
}

function reticuleResearchCheck()
{
	var structureComplete = false;
	var labs = [RESEARCH_LAB,];

	for (var i = 0, len = labs.length; i < len; ++i)
	{
		var onMapResLabs = enumStruct(selectedPlayer, labs[i]);
		for (var j = 0, len2 = onMapResLabs.length; j < len2; ++j)
		{
			if (onMapResLabs[j].status === BUILT)
			{
				structureComplete = true;
				break;
			}
		}
	}
	if (structureComplete === true)
	{
		setReticuleButton(2, _("Research (F2)"), "image_research_up.png", "image_research_down.png");
	}
	else
	{
		setReticuleButton(2, _("Research - build research facility first"), "", "");
	}
}

function reticuleBuildCheck()
{
	if (enumDroid(selectedPlayer, DROID_CONSTRUCT).length > 0)
	{
		setReticuleButton(3, _("Build (F3)"), "image_build_up.png", "image_build_down.png");
	}
	else
	{
		setReticuleButton(3, _("Build - manufacture constructor droids first"), "", "");
	}
}

function reticuleDesignCheck()
{
	var structureComplete = false;
	var HQS = [HQ,];

	for (var i = 0, len = HQS.length; i < len; ++i)
	{
		var onMapHQ = enumStruct(selectedPlayer, HQS[i]);
		for (var j = 0, len2 = onMapHQ.length; j < len2; ++j)
		{
			if (onMapHQ[j].status === BUILT)
			{
				structureComplete = true;
				break;
			}
		}
	}
	if (structureComplete === true)
	{
		setReticuleButton(4, _("Design (F4)"), "image_design_up.png", "image_design_down.png");
		setMiniMap(true);
		setDesign(true);
	}
	else
	{
		setReticuleButton(4, _("Design - construct HQ first"), "", "");
		setMiniMap(false);
	}
}

function reticuleCommandCheck()
{
	if (enumDroid(selectedPlayer, DROID_COMMAND).length > 0)
	{
		setReticuleButton(6, _("Commanders (F6)"), "image_commanddroid_up.png", "image_commanddroid_down.png");
	}
	else
	{
		setReticuleButton(6, _("Commanders - manufacture commanders first"), "", "");
	}
}

function setMainReticule()
{
	setReticuleButton(0, _("Close"), "image_cancel_up.png", "image_cancel_down.png");
	reticuleManufactureCheck();
	reticuleResearchCheck();
	reticuleBuildCheck();
	reticuleDesignCheck();
	setReticuleButton(5, _("Intelligence Display (F5)"), "image_intelmap_up.png", "image_intelmap_down.png");
	reticuleCommandCheck();
}

function reticuleUpdate(obj, eventType)
{
	var update_reticule = false;

	if (eventType === TRANSFER_LIKE_EVENT)
	{
		update_reticule = true;
	}
	else if (obj.player === selectedPlayer && obj.type === STRUCTURE)
	{
		if (obj.stattype === HQ || obj.stattype === RESEARCH_LAB || obj.stattype === CYBORG_FACTORY ||
			obj.stattype === VTOL_FACTORY || obj.stattype === FACTORY || obj.stattype === COMMAND_CONTROL)
		{
			update_reticule = true;
		}
	}
	else if (obj.player === selectedPlayer && obj.type === DROID)
	{
		if (obj.droidType === DROID_CONSTRUCT || obj.droidType === DROID_COMMAND)
		{
			update_reticule = true;
		}
	}

	if (mainReticule && update_reticule)
	{
		//Wait a tick for the counts to update
		const TICK_TIME = 100;
		queue("setMainReticule", TICK_TIME);
	}
}

function setupGame()
{
	if (tilesetType == "URBAN")
	{
		replaceTexture("page-8-player-buildings-bases.png", "page-8-player-buildings-bases-urban.png");
		replaceTexture("page-9-player-buildings-bases.png", "page-9-player-buildings-bases-urban.png");
		replaceTexture("page-7-barbarians-arizona.png", "page-7-barbarians-urban.png");
	}
	else if (tilesetType == "ROCKIES")
	{
		replaceTexture("page-8-player-buildings-bases.png", "page-8-player-buildings-bases-rockies.png");
		replaceTexture("page-9-player-buildings-bases.png", "page-9-player-buildings-bases-rockies.png");
		replaceTexture("page-7-barbarians-arizona.png", "page-7-barbarians-kevlar.png");
		// for some reason rockies will use arizona babas
	}
	if (tilesetType != "ARIZONA")
	{
		setSky("texpages/page-25-sky-urban.png", 0.5, 10000.0);
	}
	// Disabled by default
	setMiniMap(false);
	setDesign(false);

	setMainReticule();
	showInterface();
	mainReticule = true;
	hackPlayIngameAudio();
}

function eventGameLoaded()
{
	setupGame();
}

include("multiplay/skirmish/battleplan_overcharge.js");
include("multiplay/skirmish/battleplan_setupGameInit.js");

// /////////////////////////////////////////////////////////////////
// END CONDITIONS
function checkEndConditions()
{
	var factories = countStruct("A0LightFactory") + countStruct("A0VTolFactory1");
	var droids = countDroid(DROID_ANY);

	// Losing Conditions
	if (droids == 0 && factories == 0)
	{
		var gameLost = true;

		/* If teams enabled check if all team members have lost  */
		if (alliancesType == ALLIANCES_TEAMS || alliancesType == ALLIANCES_UNSHARED)
		{
			for (var playnum = 0; playnum < maxPlayers; playnum++)
			{
				if (playnum != selectedPlayer && allianceExistsBetween(selectedPlayer, playnum))
				{
					factories = countStruct("A0LightFactory", playnum) + countStruct("A0VTolFactory1", playnum);
					droids = countDroid(DROID_ANY, playnum);
					if (droids > 0 || factories > 0)
					{
						gameLost = false;	// someone from our team still alive
						break;
					}
				}
			}
		}

		if (gameLost)
		{
			gameOverMessage(false);
			removeTimer("checkEndConditions");
			return;
		}
	}

	// Winning Conditions
	var gamewon = true;

	// check if all enemies defeated
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (playnum != selectedPlayer && !allianceExistsBetween(selectedPlayer, playnum))	// checking enemy player
		{
			factories = countStruct("A0LightFactory", playnum) + countStruct("A0VTolFactory1", playnum); // nope
			droids = countDroid(DROID_ANY, playnum);
			if (droids > 0 || factories > 0)
			{
				gamewon = false;	//one of the enemies still alive
				break;
			}
		}
	}

	if (gamewon)
	{
		gameOverMessage(true);
		removeTimer("checkEndConditions");
	}
}

// /////////////////////////////////////////////////////////////////
// WARNING MESSAGES
// Base Under Attack
function eventAttacked(victimObj, attackerObj)
{
	if (gameTime > lastHitTime + 5000 && victimObj.player == selectedPlayer)
	{
		lastHitTime = gameTime;
		if (victimObj.type == STRUCTURE)
		{
			playSound("pcv337.ogg", victimObj.x, victimObj.y, victimObj.z);	// show position if still alive
		}
		else
		{
			playSound("pcv399.ogg", victimObj.x, victimObj.y, victimObj.z);
		}
	}
}

function eventDroidBuilt(droid, structure)
{
	if (droid.player === selectedPlayer)
	{
		reticuleUpdate(droid, CREATE_LIKE_EVENT);
	}
}

function eventStructureBuilt(struct, droid)
{
	if (struct.player === selectedPlayer)
	{
		reticuleUpdate(struct, CREATE_LIKE_EVENT);
	}
}

function eventStructureDemolish(struct, droid)
{
	if (struct.player === selectedPlayer)
	{
		reticuleUpdate(struct, DESTROY_LIKE_EVENT);
	}
}

function eventDestroyed(victim)
{
	if (victim.player === selectedPlayer)
	{
		reticuleUpdate(victim, DESTROY_LIKE_EVENT);
	}
}

function eventObjectTransfer(obj, from)
{
	if (obj.player === selectedPlayer || from === selectedPlayer)
	{
		reticuleUpdate(obj, TRANSFER_LIKE_EVENT);
	}
}

function eventResearched(research, structure, player)
{
	//if (research.name == "") debug("RESEARCH : " + research.fullname + "(" + research.name + ") for " + player);
	// iterate over all results
	for (var i = 0; i < research.results.length; i++)
	{
		var v = research.results[i];
		//if (research.name == "") debug("    RESULT : class=" + v['class'] + " parameter=" + v['parameter'] + " value=" + v['value'] + " filter=" + v['filterParameter'] + " filterval=" + v['filterValue']);
		for (var cname in Upgrades[player][v['class']]) // iterate over all components of this type
		{
			var parameter = v['parameter'];
			var ctype = v['class'];
			var filterparam = v['filterParameter'];
			if ('filterParameter' in v && Stats[ctype][cname][filterparam] != v['filterValue']) // more specific filter
			{
				//if (research.name == "") debug("    skipped param=" + parameter + " cname=" + cname);
				continue;
			}
			if (Stats[ctype][cname][parameter] instanceof Array)
			{
				var dst = Upgrades[player][ctype][cname][parameter].slice();
				for (var x = 0; x < dst.length; x++)
				{
					dst[x] += Math.ceil(Stats[ctype][cname][parameter][x] * v['value'] / 100);
				}
				Upgrades[player][ctype][cname][parameter] = dst;
				//debug("    upgraded to " + dst);
			}
			else if (Stats[ctype][cname][parameter] > 0) // only applies if stat has above zero value already
			{
				Upgrades[player][ctype][cname][parameter] += Math.ceil(Stats[ctype][cname][parameter] * v['value'] / 100);
				//if (research.name == "") debug("      upgraded " + cname + " to " + Upgrades[player][ctype][cname][parameter] + " by " + Math.ceil(Stats[ctype][cname][parameter] * v['value'] / 100));
			}
			//else if (research.name == "") debug("    passed " + Stats[ctype][cname][parameter] + " param=" + parameter + " cname=" + cname);
		}
	}
}

function eventCheatMode(entered)
{
	cheatmode = entered; // remember this setting
}

function eventChat(from, to, message)
{
	if (message == "bettertogether" && cheatmode)
	{
		for (var i in Upgrades[from].Brain)
		{
			if (Upgrades[from].Brain[i].BaseCommandLimit > 0) // is commander
			{
				Upgrades[from].Brain[i].BaseCommandLimit += 4;
				Upgrades[from].Brain[i].CommandLimitByLevel += 2;
				// you must set the thresholds this way, as an array, because of the clunky
				// way that this is implemented behind the scenes
				Upgrades[from].Brain[i].RankThresholds = [ 0, 2, 4, 8, 16, 24, 32, 48, 64 ];
			}
		}
		console("Made player " + from + "'s commanders SUPERIOR!");
	}
	if (message == "makesuperior" && cheatmode)
	{
		for (var i in Upgrades[from].Body)
		{
			if (Upgrades[from].Body[i].bodyClass === 'Droids' || Upgrades[from].Body[i].bodyClass === 'Cyborgs')
			{
				Upgrades[from].Body[i].HitPoints += 500;
				Upgrades[from].Body[i].HitPointPct += 100;
				Upgrades[from].Body[i].Armour += 500;
				Upgrades[from].Body[i].Thermal += 500;
				Upgrades[from].Body[i].Power += 500;
			}
		}
		console("Made player " + from + "'s units SUPERIOR!");
	}
}

function placeOilDrum()
{
	var drums = enumFeature(-1, "OilDrum").length;
	if (drums >= maxOilDrums)
	{
		return;
	}

	var x = syncRandom(mapWidth - 20) + 10;
	var y = syncRandom(mapHeight - 20) + 10;

	// see if the random position is valid
	var occupied = (enumRange(x, y, 2, ALL_PLAYERS, false).length > 0);
	var unreachable = true;
	for (var i = 0; i < maxPlayers; ++i)
	{
		if (propulsionCanReach("wheeled01", x, y, startPositions[i].x, startPositions[i].y))
		{
			unreachable = false;
			break;
		}
	}
	var terrain = terrainType(x, y);
	if (terrain == TER_WATER || terrain == TER_CLIFFFACE)
	{
		unreachable = true;
	}
	if (occupied || unreachable)
	{
		// try again in a different position after 1 second
		queue("placeOilDrum", 1000);
		return;
	}

	addFeature("OilDrum", x, y);
}

function eventPickup(feature, droid)
{
	if (feature.stattype == OIL_DRUM)
	{
		var delay;
		// generate Geom(1/6) distribution for oil drum respawn delay
		for (delay = 0; ; ++delay)
		{
			if (syncRandom(6) == 0)
			{
				break;
			}
		}
		// amounts to 10 minutes average respawn time
		queue("placeOilDrum", delay * 120000);
	}
}