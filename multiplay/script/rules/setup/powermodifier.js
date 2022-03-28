function setupPowerModifier(player)
{
	var powerModifier = 100;
	if (powerType == 0)
		powerModifier = 66;
	else if (powerType == 2)
		powerModifier = 133
	setPowerModifier(powerModifier, player);

	// insane difficulty is meant to be insane...
	if (playerData[player].difficulty == INSANE)
	{
		setPowerModifier(powerModifier + 50, player);
	}
	else if (playerData[player].difficulty == EASY)
	{
		setPowerModifier(powerModifier - 33, player);
	}
}
