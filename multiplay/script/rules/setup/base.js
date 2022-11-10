function removeModules(player)
{
	var keepFactory = false;
	var keepLab = false;
	var keepPower = false;
	var structs = enumStruct(player);
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
					name = "A0VTolFactory1";
				break;
			case POWER_GEN:
				if (!keepPower)
					name = "A0PowerGenerator";
				break;
			}
			if (name != "")
			{
				removeObject(s);
				addStructure(name, player, x, y);
			}
		}
	}
}

function limitStartingFacilities(player)
{
	switch (baseType)
	{
	case CAMP_CLEAN:
		// Remove all
		var structs = enumStruct(player);
		for (var i = 0; i < structs.length; i++)
			removeObject(structs[i], false);
		return;
	case CAMP_WALLS:
		// Keep everything
		return;
	}
	// CAMP_BASE: keep power gen, command centre and 2 derricks
	var keep = new Map();
	keep.set(HQ, 1);
	keep.set(POWER_GEN, 1);
	keep.set(RESOURCE_EXTRACTOR, 2);
	var kept_structs = {};
	var base = startPositions[player];
	for (const [stattype, keep_max] of keep.entries()) {
		var structs = enumStruct(player, stattype);
		structs.sort(function(one, two) {
			return distBetweenTwoPoints(one.x, one.y, base.x, base.y) - distBetweenTwoPoints(two.x, two.y, base.x, base.y);
		});
		for (var i = 0; i < structs.length; i++) {
			if (i < keep_max) {
				kept_structs[structs[i].id] = true;
			} else {
				break;
			}
		}
	}
	var structs = enumStruct(player);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		if (!kept_structs[s.id]) {
			removeObject(s);
		}
	}
}

function setupBase(player)	// inside hackNetOff()
{
	switch (baseType)
	{
	case CAMP_BASE:
		setPower(800, player); // Starting point
		break;
	case CAMP_CLEAN:
		setPower(800 + 500 + 400 + 2 * 150, player); // Starting point with removed structures cost
		break;
	case CAMP_WALLS:
		setPower(300 + 200 + 500); // Enough to start a research, build a tank and produce a facility
		break;
	}
	removeModules(player);
	limitStartingFacilities(player);
	setMainReticule(); // Force update after removing structures
}
