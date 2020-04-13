
// A fallback build order for the standard ruleset.

function buildOrder_StandardFallback() {
	if (buildMinimumDerricks(1)) return true;
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	// make sure trucks go capture some oil at this moment
	if (buildMinimumDerricks(4)) return true;
	return false;
}
