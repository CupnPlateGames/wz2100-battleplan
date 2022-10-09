function setupPowerModifier(player)
{
	var powerModifier = 100;
	if (powerType == 0)
		powerModifier = 66;
	else if (powerType == 2)
		powerModifier = 133
	setPowerModifier(powerModifier, player);

	// difficult AI gets a free power module because they play badly
	if (playerData[player].difficulty == HARD)
	{
		setPowerModifier(powerModifier * 1.5, player);
	}
	// insane difficulty is meant to be insane...
	if (playerData[player].difficulty == INSANE)
	{
		setPowerModifier(powerModifier * 2, player);
	}
	else if (playerData[player].difficulty == EASY)
	{
		setPowerModifier(powerModifier * 0.67, player);
	}
}
