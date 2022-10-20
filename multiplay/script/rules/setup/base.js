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
	var max_labs = 0;
	var max_facto = 0;
	var max_vtol = 0;
	var max_cyb = 0;
	var max_derricks = 2;
	var count_labs = 0;
	var count_facto = 0;
	var count_vtol = 0;
	var count_cyb = 0;
	var structs = enumStruct(player, RESEARCH_LAB);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		count_labs++;
		if (count_labs > max_labs)
			removeObject(s);
	}
	var structs = enumStruct(player, VTOL_FACTORY);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		count_vtol++;
		if (count_vtol > max_cyb)
			removeObject(s);
	}
	structs = enumStruct(player, FACTORY);
	for (var i = 0; i < structs.length; i++)
	{
		var s = structs[i];
		count_facto++;
		if (count_facto > max_facto)
			removeObject(s);
	}
	structs = enumStruct(player, RESOURCE_EXTRACTOR);
	if (structs.length > max_derricks)
	{
		var base = startPositions[player];
		structs.sort(function(one, two) {
			return distBetweenTwoPoints(one.x, one.y, base.x, base.y) - distBetweenTwoPoints(two.x, two.y, base.x, base.y);
		});
		for (var i = max_derricks; i < structs.length; i++)
		{
			removeObject(structs[i]);
		}
	}
	structs = enumStruct(player);
	for (var i = 0; i < structs.length; i++)
	{
		// Remove all defenses in all cases for maps that have those
		if (s.stattype == WALL || s.stattype == DEFENSE || s.stattype == GATE)
			removeObject(s, false);
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
