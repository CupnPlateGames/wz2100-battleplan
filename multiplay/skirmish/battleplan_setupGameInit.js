// This is the replaced function from rules.js
// that defines which components and technologies are available from start.

function removeModules(playnum)
{
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
				name = "A0ResearchFacility";
				break;
			case FACTORY:
				name = "A0LightFactory"
				break;
			case POWER_GEN:
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

function addStartingScout(playnum)
{
	// Put it near the CC
	var structs = enumStruct(playnum, HQ);
	if (structs.length == 0)
		return;
	var ccPos = {x: structs[0].x, y: structs[0].y};
	var tries = 0;
	var offset_y = 0;
	var offset_x = 0;
	while (tries < 12)
	{
		if (tries < 4)
			offset_y = 2
		else if (tries < 6)
			offset_y = 1
		else if (tries < 8)
			offset_y = 0
		else
			offset_y = -1
		if (tries < 4 || tries >= 8)
			offset_x = 2 - (tries % 4)
		else if (tries < 8)
			offset_x = 2 - (tries % 2) * 3
		if (addDroid(playnum, (ccPos.x + offset_x) - 1, (ccPos.y + offset_y) - 1,
				"Scout", "Body4ABT", "hover01", 0, 0, "Scout") == null)
			tries++;
		else
			return;
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
		enableStructure("A0ResourceExtractor", playnum);
		enableStructure("A0PowerGenerator", playnum);
		enableStructure("A0ResearchFacility", playnum);

		setStructureLimits("A0LightFactory", 10, playnum);	// set structure limits
		setStructureLimits("A0PowerGenerator", 8, playnum);
		setStructureLimits("A0ResearchFacility", 5, playnum);
		setStructureLimits("A0CommandCentre", 1, playnum);
		setStructureLimits("A0ComDroidControl", 1, playnum);
		setStructureLimits("A0CyborgFactory", 0, playnum);
		setStructureLimits("A0VTolFactory1", 5, playnum);
	}
	applyLimitSet();	// set limit options

	const numCleanTech = 9;	// do x for clean
	const numBaseTech = numCleanTech + 4; // do x for base
	var techlist = new Array(
		"R-Vehicle-Prop-Wheels",
		"R-Vehicle-Prop-Tracks",
		"R-Vehicle-Prop-Hover",
		"R-Vehicle-Prop-VTOL",
		"R-Vehicle-Body04",
		"R-Vehicle-Body01",
		"R-Vehicle-Body02",
		"R-Sys-Spade1Mk1",
		"R-Sys-Autorepair-General",

		"R-Wpn-MG1Mk1",
		"R-Wpn-Cannon1Mk1",
		"R-Wpn-Rocket05-MiniPod",
		"R-Defense-TankTrap01",

		"R-Wpn-Flamer01Mk1",
		"R-Wpn-Rocket01-LtAT",
		"R-Wpn-Mortar01Lt",
		"R-Wpn-HowitzerMk1",
		"R-Defense-HardcreteWall",
		"R-Defense-Tower01",
		"R-Defense-Tower-Cannon1Mk1",
		"R-Defense-Tower06");

	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		makeComponentAvailable("Scout", playnum);
		makeComponentAvailable("Scout-VTOL", playnum);
		for (var technum = numCleanTech; technum < numBaseTech; technum++) {
			enableResearch(techlist[technum]);
		}
		enableResearch("R-Wpn-Rocket01-LtAT");
		enableResearch("R-Wpn-Mortar01Lt");
		enableResearch("R-Wpn-HowitzerMk1");
		enableResearch("R-Struc-RepairFacility");

		if (baseType == CAMP_CLEAN)
		{
			setPower(1300, playnum);
			for (var count = 0; count < numCleanTech; count++)
			{
				completeResearch(techlist[count], playnum);
			}
			var structs = enumStruct(playnum);
			var lab_count = 0;
			for (var i = 0; i < structs.length; i++)
			{
				var s = structs[i];
				if (s.stattype != HQ && (playerData[playnum].difficulty != INSANE
				    || (s.stattype != WALL && s.stattype != DEFENSE && s.stattype != GATE
				        && s.stattype != RESOURCE_EXTRACTOR)))
				{
					if (s.stattype != RESEARCH_LAB)
						removeObject(s, false);
					else
					{
						lab_count++;
						if (lab_count > 1)
							removeObject(s, false);
					}
				}
			}
			removeModules(playnum);
			limitStartingFacilities(playnum);
		}
		else if (baseType == CAMP_BASE)
		{
			setPower(2500, playnum);
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
			setPower(2500, playnum);
			for (var count = 0; count < techlist.length; count++)
			{
				completeResearch(techlist[count], playnum);
			}
			removeModules(s, playnum);
		}
		addStartingScout(playnum);
	}

	var techLevel = getMultiTechLevel();
	if (techLevel == 2)
	{
		grantTech(TECH_TWO);
	}
	else if (techLevel == 3)
	{
		grantTech(TECH_THREE);
	}

	hackNetOn();
	setTimer("checkEndConditions", 3000);
	if (tilesetType === "URBAN" || tilesetType === "ROCKIES")
	{
		setTimer("weatherCycle", 45000);
	}
}
