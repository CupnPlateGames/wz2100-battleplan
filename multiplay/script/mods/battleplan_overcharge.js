// This is the overcharge behaviour.
// It makes power module convert build power to raw power by constantly
// damaging the power generator.

const OVERCHARGE_DAMAGE = 10; // In buildPoints, not HP because repair uses buildPoints
const OVERCHARGE_DMG_PERCENT = OVERCHARGE_DAMAGE / 500 * 100; // power generator buildPoints

function battleplan_overcharge()
{
	for (var playnum = 0; playnum < maxPlayers; playnum++)
	{
		var structs = enumStruct(playnum, POWER_GEN);
		for (var i = 0; i < structs.length; i++)
		{
			var s = structs[i];
			if (s.status !== BUILT || s.modules == 0)
				continue;
			if (s.health - OVERCHARGE_DMG_PERCENT <= 0)
				removeObject(s, true);
			else
				setHealth(s, s.health - OVERCHARGE_DMG_PERCENT);
		}
	}
}
setTimer("battleplan_overcharge", 1000);
