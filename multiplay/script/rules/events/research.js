function eventResearched(research, structure, player)
{
	// Auto research all available bunkers when hardcreete walls are researched
	if (research.name == "R-Defense-HardcreteWall")
	{
		var weaponTechs = Object.keys(BUNKER_PAIRS);
		for (var i = 0; i < weaponTechs.length; i++)
		{
			var weaponTech = weaponTechs[i];
			if (findResearch(weaponTech, player).length == 0)
			{
				hackNetOff();
				completeResearch(BUNKER_PAIRS[weaponTech], player);
				hackNetOn();
				break;
			}
		}
		return true;
	}
	// Auto research bunker when a weapon is researched with hardcrete wall researched
	if (findResearch("R-Defense-HardcreteWall", player).length > 0)
	{
		return false;
	}
	if (research.name in BUNKER_PAIRS)
	{
		hackNetOff();
		completeResearch(BUNKER_PAIRS[research.name], player);
		hackNetOn();
		return true;
	}
	return false;
}
