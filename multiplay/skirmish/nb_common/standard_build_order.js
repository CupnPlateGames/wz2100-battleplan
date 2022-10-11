// Build order is checked first to check construction.
// To avoid falling back to the regular construction rules the build order
// should analyze what could be built and either always return true or
// set a personality.maxPower very high prefer building defenses than
// useless (VTOL) factories.

function buildOrder_analyze() {
	// Check for inactive derricks
	var oils = countFinishedStructList(structures.derricks);
	var gens = countStructList(structures.gens);
	if (oils > 4 * gens)
		if (buildBasicStructure(structures.gens, IMPORTANCE.PEACETIME) !== BUILDRET.UNAVAILABLE)
			return true;
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
		if (facto == 0 && buildMinimum(structures.factories, Infinity, IMPORTANCE.MANDATORY)) {
			return true;
		}
		if (lab == 0 && buildMinimum(structures.lab, Infinity, IMPORTANCE.MANDATORY)) {
			return true;
		}
		if (vtol == 0 && buildMinimum(structures.vtolFactories, Infinity, IMPORTANCE.MANDATORY)) {
			return true;
		}
		// Produce one more with chances
		if (lab < (facto + vtol) / 2 && withChance(personality.researchness) && buildMinimum(structures.lab, Infinity, IMPORTANCE.PEACETIME)) {
			return true;
		}
		if (withChance(personality.vtolness - (vtol - facto) * 10) && buildMinimum(structures.vtolFactories, Infinity, IMPORTANCE.PEACETIME)) {
			return true;
		}
		if (!withChance(personality.defensiveness) && buildMinimum(structures.factories, Infinity, IMPORTANCE.PEACETIME)) {
			return true;
		}
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
	if (buildMinimum(structures.gens, 1)) return true;
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
