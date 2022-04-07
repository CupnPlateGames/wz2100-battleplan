function setupTechLevel(player)
{
	completeResearch("R0-Pulse", player); // Pulse gun
	completeResearch("R-Vehicle-Body01", player); // Light bodies
	completeResearch("R-Vehicle-Prop-Wheels", player); // Propulsions
	//global function, doc/js-functions
	var techLevel = getMultiTechLevel();
	if (techLevel >= 2)
	{
		grantTech(TECH_TWO, player);
	}
	if (techLevel >= 3)
	{
		grantTech(TECH_THREE, player);
	}
	if (techLevel >= 4)
	{
		grantTech(TECH_FOUR, player);
	}
}
