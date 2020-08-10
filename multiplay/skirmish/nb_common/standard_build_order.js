
// A fallback build order for the standard ruleset.

function buildOrder_StandardFallback() {
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.labs, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimum(structures.derricks, 1)) return true;
	if (buildMinimum(structures.derricks, 2)) return true;
	if (buildMinimum(structures.derricks, 3)) return true;
	if (buildMinimum(structures.derricks, 4)) return true;
	if (buildMinimum(structures.factories, 2)) return true;
	return false;
}

function buildOrder_AllIn() {
	if (buildMinimum(structures.hqs, 1)) return true;
	if (buildMinimum(structures.factories, 1)) return true;
	if (buildMinimum(structures.gens, 1)) return true;
	if (buildMinimum(structures.derricks, 1)) return true;
	if (buildMinimum(structures.derricks, 2)) return true;
	if (buildMinimum(structures.factories, 2)) return true;
	return false;
}
