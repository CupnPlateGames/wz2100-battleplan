function alertPowerModDeterioration(struct) {
	if (struct.player === selectedPlayer && struct.health < 95) {
		chat(struct.player, "WARNING: your power module requires 2 trucks to continuously repair it.");
	}
}

function eventStructureBuilt(struct, droid) {
	if (struct.player === selectedPlayer && struct.stattype == POWER_GEN && struct.modules > 0) {
		queue("alertPowerModDeterioration", 7000, struct)
	}
	// Default event
	if (struct.player === selectedPlayer)
	{
		reticuleUpdate(struct, CREATE_LIKE_EVENT);
	}
}
