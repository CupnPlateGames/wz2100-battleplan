// This is the replaced function from rules.js
// that defines which components and technologies are available from start.

function removeUnusedBuildings(playnum)
{
	var structs = enumStruct(playnum);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		if (s.stattype == CYBORG_FACTORY || s.stattype == COMMAND_CONTROL)
			removeObject(s, false);
	}
}

function removeModules(playnum)
{
	var keepFactory = false;
	var keepLab = false;
	var keepPower = false;
	var structs = enumStruct(playnum);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		if (s.modules > 0)
		{
			var x = s.x * 128;
			var y = s.y * 128;
			var type = s.stattype;
			var name = "";
			switch (s.stattype)
			{
			case RESEARCH_LAB:
				if (!keepLab)
					name = "A0ResearchFacility";
				break;
			case FACTORY:
				if (!keepFactory)
					name = "A0LightFactory";
				break;
			case VTOL_FACTORY:
				if (!keepFactory)
					name = "A0VtolFactory1";
				break;
			case POWER_GEN:
				if (!keepPower)
					name = "A0PowerGenerator";
				break;
			}
			if (name != "")
			{
				removeObject(s);
				addStructure(name, playnum, x, y);
			}
		}
	}
}

function limitStartingFacilities(playnum)
{
	var max_labs = 1;
	var max_facto = 1;
	var max_vtol = 1;
	var max_cyb = 0;
	switch (baseType)
	{
	case CAMP_CLEAN:
		max_labs = 1;
		max_facto = 0;
		max_vtol = 0;
		break;
	case CAMP_BASE:
		max_labs = 1;
		max_facto = 1;
		max_vtol = 1;
		break;
	default:
		return;
	}
	var count_labs = 0;
	var count_facto = 0;
	var count_vtol = 0;
	var count_cyb = 0;
	var structs = enumStruct(playnum, RESEARCH_LAB);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		count_labs++;
		if (count_labs > max_labs)
			removeObject(s);
	}
	var structs = enumStruct(playnum, CYBORG_FACTORY);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		count_cyb++;
		if (count_cyb > max_cyb)
			removeObject(s);
	}
	var structs = enumStruct(playnum, VTOL_FACTORY);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		count_vtol++;
		if (count_vtol > max_cyb)
			removeObject(s);
	}
	structs = enumStruct(playnum, FACTORY);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		count_facto++;
		if (count_facto > max_facto)
		{
			var x = s.x * 128;
			var y = s.y * 128;
			removeObject(s);
			if (count_cyb < max_cyb)
			{
				addStructure("A0CyborgFactory", playnum, x, y);
				count_vtol++;
			}
			else if (count_vtol < max_vtol)
			{
				addStructure("A0VTolFactory1", playnum, x, y);
				count_vtol++;
			}
		}
	}

}

function eventGameInit()
{
	setupGame();

	// always at least one oil drum, and one more for every 64x64 tiles of map area
	maxOilDrums = (mapWidth * mapHeight) >> 12; // replace float division with shift for sync-safety
	for (var i = 0; i < maxOilDrums; ++i)
	{
		queue("placeOilDrum", 10000 * i);
	}

	hackNetOff();
	makeComponentAvailable("B4body-sml-trike01", scavengerPlayer);
	makeComponentAvailable("B3body-sml-buggy01", scavengerPlayer);
	makeComponentAvailable("B2JeepBody", scavengerPlayer);
	makeComponentAvailable("BusBody", scavengerPlayer);
	makeComponentAvailable("FireBody", scavengerPlayer);
	makeComponentAvailable("B1BaBaPerson01", scavengerPlayer);
	makeComponentAvailable("BaBaProp", scavengerPlayer);
	makeComponentAvailable("BaBaLegs", scavengerPlayer);
	makeComponentAvailable("bTrikeMG", scavengerPlayer);
	makeComponentAvailable("BuggyMG", scavengerPlayer);
	makeComponentAvailable("BJeepMG", scavengerPlayer);
	makeComponentAvailable("BusCannon", scavengerPlayer);
	makeComponentAvailable("BabaFlame", scavengerPlayer);
	makeComponentAvailable("BaBaMG", scavengerPlayer);
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		if (powerType == 0)
		{
			setPowerModifier(85, playnum);
		}
		else if (powerType == 2)
		{
			setPowerModifier(125, playnum);
		}

		// insane difficulty is meant to be insane...
		if (playerData[playnum].difficulty == INSANE)
		{
			setPowerModifier(200 + 15 * powerType, playnum);
		}
		else if (playerData[playnum].difficulty == EASY)
		{
			setPowerModifier(70 + 5 * powerType, playnum);
		}

		setDroidLimit(playnum, 150, DROID_ANY);
		setDroidLimit(playnum, 10, DROID_COMMAND);
		setDroidLimit(playnum, 15, DROID_CONSTRUCT);

		enableStructure("A0CommandCentre", playnum);		// make structures available to build
		enableStructure("A0LightFactory", playnum);
		enableStructure("A0VTolFactory1", playnum);
		enableStructure("A0VtolPad", playnum);
		enableStructure("A0ResourceExtractor", playnum);
		enableStructure("A0PowerGenerator", playnum);
		enableStructure("A0PowMod1", playnum);
		enableStructure("A0ResearchFacility", playnum);
		enableStructure("A0TankTrap", playnum);
		enableStructure("LookOutTower", playnum);

		makeComponentAvailable("wheeled01", playnum);
		makeComponentAvailable("hover01", playnum);
		makeComponentAvailable("tracked01", playnum);
		makeComponentAvailable("V-Tol", playnum);

		makeComponentAvailable("B-D3-SNP", playnum);
		makeComponentAvailable("B-C3-SP", playnum);
		makeComponentAvailable("B-B3-SC", playnum);
		makeComponentAvailable("Spade1Mk1", playnum);
		makeComponentAvailable("W-Z11-Scout", playnum);
		makeComponentAvailable("W-Z11-VTOLScout", playnum);

		setStructureLimits("A0LightFactory", 10, playnum);	// set structure limits
		setStructureLimits("A0PowerGenerator", 8, playnum);
		setStructureLimits("A0ResearchFacility", 5, playnum);
		setStructureLimits("A0CommandCentre", 1, playnum);
		setStructureLimits("A0ComDroidControl", 1, playnum);
		setStructureLimits("A0CyborgFactory", 0, playnum);
		setStructureLimits("A0VTolFactory1", 5, playnum);
	}
	applyLimitSet();	// set limit options

	const numBaseTech = 4; // do x for base
	var techlist = new Array(
		"R0-A13-MG1",
		"R0-C13-Cannon1",
		"R0-E13-Rocket1",
		"R-Defense-HardcreteWall",

		"R0-B13-Flamer1",
		"R0-D13-Missile1",
		"R0-F13-Mortar1",
		"R0-G13-Howitzer1",
		"R0-A22-AAMG2",
		"R0-E22-AARocket2",
		"R0-D22-AAMissile2");

	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		for (var technum = 0; technum < numBaseTech; technum++) {
			enableResearch(techlist[technum], playnum);
		}
		enableResearch("R0-B13-Flamer1", playnum);
		enableResearch("R0-D13-Missile1", playnum);
		enableResearch("R0-E13-Rocket1", playnum);
		enableResearch("R0-F13-Mortar1", playnum);
		enableResearch("R0-G13-Howitzer1", playnum);
		enableResearch("R0-L3-Repair1", playnum);
		enableResearch("R-Vehicle-Body05", playnum);
		enableResearch("R-Sys-Sensor-Turret01", playnum);

		if (baseType == CAMP_CLEAN)
		{
			setPower(2000, playnum);
			var structs = enumStruct(playnum);
			var lab_count = 0;
			for (var i = 0; i < structs.length; i++)
			{
				var s = structs[i];
				if (s.stattype != HQ
					&& s.stattype != POWER_GEN
					&& s.stattype != RESEARCH_LAB
					&& (playerData[playnum].difficulty != INSANE
						|| (s.stattype != WALL && s.stattype != DEFENSE && s.stattype != GATE
					        && s.stattype != RESOURCE_EXTRACTOR)))
				{
					removeObject(s, false);
				}
			}
			removeModules(playnum);
			limitStartingFacilities(playnum);
		}
		else if (baseType == CAMP_BASE)
		{
			setPower(1250, playnum);
			for (var count = 0; count < numBaseTech; count++)
			{
				completeResearch(techlist[count], playnum);
			}
			// Keep only some structures
			var structs = enumStruct(playnum);
			for (var i = 0; i < structs.length; i++)
			{
				var s = structs[i];
				if ((playerData[playnum].difficulty != INSANE && (s.stattype == WALL || s.stattype == DEFENSE))
				    || s.stattype == GATE || s.stattype == CYBORG_FACTORY || s.stattype == COMMAND_CONTROL)
				{
					removeObject(s, false);
				}
			}
			removeModules(playnum);
			limitStartingFacilities(playnum);
		}
		else // CAMP_WALLS
		{
			setPower(1000, playnum);
			for (var count = 0; count < techlist.length; count++)
			{
				completeResearch(techlist[count], playnum);
			}
			removeModules(playnum);
		}
		removeUnusedBuildings(playnum);
	}

	var techLevel = getMultiTechLevel();
	if (techLevel == 2)
	{
		grantTech(TECH_TWO);
	}
	else if (techLevel == 3)
	{
		grantTech(TECH_TWO);
		grantTech(TECH_THREE);
	}

	hackNetOn();
	setTimer("checkEndConditions", 3000);
	if (tilesetType === "URBAN" || tilesetType === "ROCKIES")
	{
		setTimer("weatherCycle", 45000);
	}
}
