// Build order is checked first to check construction.
// To avoid falling back to the regular construction rules the build order
// should analyze what could be built and either always return true or
// set a personality.maxPower very high prefer building defenses than
// useless (VTOL) factories.

// Copied from NullBot build.js private functions
function truckFree(truck) {
	if (truck.droidType !== DROID_CONSTRUCT)
		return false;
	if (truck.order === DORDER_BUILD)
		return false;
	if (truck.order === DORDER_HELPBUILD)
		return false;
	if (truck.order === DORDER_LINEBUILD)
		return false;
	if (truck.order === DORDER_DEMOLISH)
		return false;
	return true;
}
function getFreeTruckAround(x, y) {
	var list = enumTrucks().filter(truckFree).filter(function(droid) {
		return droidCanReach(droid, x, y);
	}).sort(function(one, two) {
		return distance(one, x, y) - distance(two, x, y);
	});
	if (list.length > 0)
		return list[0];
}
function finishStructures() {
	var success = false;
	var list = enumStruct(me).filterProperty("status", BEING_BUILT);
	for (var i = 0; i < list.length; ++i) {
		if (success)
			return;
		if (throttled(10000, list[i].id))
			return;
		if (list[i].stattype === RESOURCE_EXTRACTOR)
			return;
		var truck = getFreeTruckAround(list[i].x, list[i].y);
		if (!defined(truck))
			return;
		if (orderDroidObj(truck, DORDER_HELPBUILD, list[i]))
			success = true;
	}
	return success;
}
// End copied from NullBot build.js private functions

function buildOrder_analyze() {
	// Check for inactive derricks
	var oils = countFinishedStructList(structures.derricks);
	var gens = countStructList(structures.gens);
	if (oils > 4 * gens) {
		if (throttled(5000, structures.gens[0])) return true; // Wait to start building previous one
		if (buildMinimum(structures.gens, gens + 1, IMPORTANCE.PEACETIME) !== BUILDRET.UNAVAILABLE)
			return true;
	}
	// Check for VTOL pads
	var vtolCount = enumDroid(me, DROID_WEAPON).filter(isVTOL).length;
	var vtolPads = countStructList(structures.vtolPads);
	if (vtolCount > vtolPads * 3) {
		if (buildMinimum(structures.vtolPads, vtolPads + 1, IMPORTANCE.MANDATORY))
			return true;
	}
	// Check for production units
	var PU = (oils / 2.0)
	switch (playerData[me].difficulty) {
		case HARD: PU *= 1.5; break;
		case INSANE: PU *= 2; break;
		case EASY: PU *= 0.67; break;
	}
	var facto = enumFinishedStructList(structures.factories).length;
	var vtol = enumFinishedStructList(structures.vtolFactories).length;
	var lab = enumFinishedStructList(structures.labs).length;
	if (PU > facto + vtol + lab/2 + 1) {
		// Produce a new facility, check for none
		if (facto == 0 && buildMinimum(structures.factories, facto + 1, IMPORTANCE.MANDATORY)) {
			return true;
		}
		if (lab == 0 && buildMinimum(structures.labs, lab + 1, IMPORTANCE.MANDATORY)) {
			return true;
		}
		if (vtol == 0 && withChance(personality.vtolness) && buildMinimum(structures.vtolFactories, vtol + 1, IMPORTANCE.MANDATORY)) {
			return true;
		}
		// Produce one more with chances
		if (lab < (facto + vtol) / 2 && withChance(personality.researchness) && buildMinimum(structures.labs, lab + 1, IMPORTANCE.PEACETIME)) {
			return true;
		}
		if (withChance(personality.vtolness - (vtol - facto) * 10) && buildMinimum(structures.vtolFactories, vtol + 1, IMPORTANCE.PEACETIME)) {
			return true;
		}
		if (!withChance(personality.defensiveness) && buildMinimum(structures.factories, facto + 1, IMPORTANCE.PEACETIME)) {
			return true;
		}
	}
	// First defense check
	if (withChance(personality.defensiveness) && buildDefenses()) {
		return true;
	}
	// Grab oil
	if (buildMinimumDerricks(oils + 1)) {
		return true;
	}
	// Add extra
	if (throttled(180000) && buildMinimum(structures.extras, 3, IMPORTANCE.PEACETIME)) {
		return true;
	}
	// No oil, add defenses again
	if (withChance(personality.defensiveness * 2) && buildDefenses()) {
		return true;
	}
	return false
}

function buildOrder_StandardFallback() {
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimumDerricks(2)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	if (buildMinimumDerricks(4)) return true;
	return buildOrder_analyze();
}

function buildOrder_AllIn() {
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimumDerricks(2)) return true;
	if (buildMinimum(structures.factories, 2)) return true;
	if (buildMinimumDerricks(4)) return true;
	if (buildMinimum(structures.gens, 2)) return true;
	if (buildMinimumDerricks(6)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	if (buildMinimum(structures.factories, 3)) return true;
	return buildOrder_analyze();
}

function buildOrder_VTOL() {
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.vtolFactories, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimumDerricks(2)) return true;
	if (buildMinimum(structures.vtolPads, 1)) return true;
	if (buildMinimumDerricks(4)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	return buildOrder_analyze();
}

function buildOrder_Research() {
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimumDerricks(4)) return true;
	return buildOrder_analyze();
}
