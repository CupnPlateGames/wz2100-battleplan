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
	var max_labs = 1;
	var max_facto = 1;
	var max_vtol = 1;
	var max_cyb = 0;
	switch (baseType)
	{
	case CAMP_CLEAN:
		max_labs = 0;
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

}

function setupBase(player)	// inside hackNetOff()
{
	if (baseType == CAMP_CLEAN)
	{
		setPower(2000, player);
		var structs = enumStruct(player);
		for (var i = 0; i < structs.length; i++)
		{
			var s = structs[i];
			if (s.stattype != HQ
				&& s.stattype != POWER_GEN
				&& s.stattype != RESEARCH_LAB
				&& (playerData[player].difficulty != INSANE
					|| (s.stattype != WALL && s.stattype != DEFENSE && s.stattype != GATE
				        && s.stattype != RESOURCE_EXTRACTOR)))
			{
				removeObject(s, false);
			}
		}
	}
	else if (baseType == CAMP_BASE)
	{
		setPower(1250, player);
		grantTech(TECH_BASE, player);
		// Keep only some structures
		var structs = enumStruct(player);
		for (var i = 0; i < structs.length; i++)
		{
			var s = structs[i];
			if ((playerData[player].difficulty != INSANE && (s.stattype == WALL || s.stattype == DEFENSE))
			    || s.stattype == GATE)
			{
				removeObject(s, false);
			}
		}
	}
	else // CAMP_WALLS
	{
		setPower(1000, player);
		grantTech(TECH_BASE, player);
		grantTech(TECH_ADVANCED_BASE, player);
	}
	removeModules(player);
	limitStartingFacilities(player);
	setMainReticule(); // Force update after removing structures
}
