// Load the regular Nexus
NX_PATH = "/multiplay/skirmish/";
include(NX_PATH + "nexus.js");

// Remove cyborg related targets from nexus_inclades/enemySelection.js
isPlayerAlive = function(player)
{
	if (!defined(player))
	{
		debugMessage("isPlayerAlive. Undefined player parameter.");
		return false;
	}

	if ((countStruct(BASE_STRUCTURES.factories, player) +
		countDroid(DROID_ANY, player)) > 0)
	{
		return true;
	}

	return false;
}

// Remove cyborg related buildings from nexus_includes/build.js

buildMaximums = function()
{
	var amount = buildMaxsBasedOnDerricks();
	var currStructCount = countStruct(BASE_STRUCTURES.labs);

	if (currStructCount < getStructureLimit(BASE_STRUCTURES.labs, me) && currStructCount < amount && grabTrucksAndBuild(BASE_STRUCTURES.labs, BASE, 25, 0))
	{
		return true;
	}

	currStructCount = countStruct(BASE_STRUCTURES.factories);
	if (currStructCount < getStructureLimit(BASE_STRUCTURES.factories, me) && currStructCount < amount && grabTrucksAndBuild(BASE_STRUCTURES.factories, BASE, 25, 0))
	{
		return true;
	}

	currStructCount = countStruct(BASE_STRUCTURES.repairBays);
	if (currStructCount < getStructureLimit(BASE_STRUCTURES.repairBays, me) && currStructCount < amount && grabTrucksAndBuild(BASE_STRUCTURES.repairBays, BASE, 25, 0))
	{
		return true;
	}

	currStructCount = countStruct(BASE_STRUCTURES.vtolFactories);
	if (currStructCount < getStructureLimit(BASE_STRUCTURES.vtolFactories, me) && currStructCount < amount && grabTrucksAndBuild(BASE_STRUCTURES.vtolFactories, BASE, 25, 0))
	{
		return true;
	}

	return false;
}


// Remove cyborg related production from nexus_includes/production.js

produceCyborgs = function() {}

getVirtualSystemCount = function()
{
	var counts = {constructs: 0, sensors: 0, repairs: 0,};
	var factories = enumStruct(me, BASE_STRUCTURES.factories);
	var i = 0;
	var len = 0;
	var virDroid;

	for (i = 0, len = factories.length; i < len; ++i)
	{
		virDroid = getDroidProduction(factories[i]);

		if (virDroid !== null)
		{
			if (virDroid.droidType === DROID_CONSTRUCT)
			{
				counts.constructs = counts.constructs + 1;
			}
			else if (virDroid.droidType === DROID_SENSOR)
			{
				counts.sensors = counts.sensors + 1;
			}
			else if (virDroid.droidType === DROID_REPAIR)
			{
				counts.repairs = counts.repairs + 1;
			}
		}
	}

	return counts;
}

produceConstructors = function()
{
	const CONSTRUCT_LIMIT = getDroidLimit(me, DROID_CONSTRUCT);
	const MAX_TRUCK_FACTORIES = 3; //max factories to use for truck production
	var truckLimit = (getRealPower(me) > LOW_POWER) ? TRUCK_INFO.max : TRUCK_INFO.min;

	if (truckLimit > CONSTRUCT_LIMIT)
	{
		truckLimit = CONSTRUCT_LIMIT;
	}

	var totalTrucks = getVirtualSystemCount().constructs + enumDroid(me, DROID_CONSTRUCT).length;
	var occupiedFactories = 0;
	var success = false;
	var factories = enumStruct(me, BASE_STRUCTURES.factories);

	for (var i = 0, len = factories.length; i < len; ++i)
	{
		var factory = factories[i];

		if (factory.status !== BUILT || !structureIdle(factory))
		{
			continue;
		}

		if (totalTrucks < truckLimit && occupiedFactories < MAX_TRUCK_FACTORIES)
		{
			for (var j = STANDARD_TRUCK_TEMPLATES.length - 1; j > -1; --j)
			{
				var tmp = STANDARD_TRUCK_TEMPLATES[j];

				if (buildDroid(factory, "Truck", tmp.body, tmp.prop, "", "", tmp.weaps[0]))
				{
					success = true;
					occupiedFactories += 1;
					totalTrucks += 1;
					break;
				}
			}
		}
	}

	return success;
}
