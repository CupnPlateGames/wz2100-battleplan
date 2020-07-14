
// A fallback build order for the standard ruleset.

function buildOrder_StandardFallback() {
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimumDerricks(2)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	return false;
}
