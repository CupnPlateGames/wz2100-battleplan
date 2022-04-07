
// A fallback build order for the standard ruleset.

function buildOrder_StandardFallback() {
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimumDerricks(2)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	if (buildMinimumDerricks(4)) return true;
	return false;
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
	return false;
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
	return false;
}

function buildOrder_Research() {
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimumDerricks(4)) return true;
	return false;
}
