
/*
 * Functions to break energy into production, research and building according to the situation.
 *
 */

(function(_global) {
////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Assign excessive power to production units. PU already restart production once they have
 * finished if there is enough supply.
 */
_global.assignEnergy = function() {
	var power = myPower();
	if (power < 0) {
		queue("assignEnergy", reactionTime() * 3);
		return; // No point in queueing things
	}
	// Early game assignments
	checkEarlyResearch();
	if (buildOrder()) {
		var prodTruck = checkTruckProduction();
		var prodTank = checkProduction();
		if (prodTruck || prodTank) {
			queue("assignEnergy", reactionTime());
		} else {
			queue("assignEnergy", reactionTime() * 3);
		}
		return;
	}
	var PUEnergy = getPUEnergy();
	var PUDetails = getPUDetails();
	var army = PUDetails['factories'] + PUDetails['vtols'];
	var lab = PUDetails['labs'];
	var PUCount = army + lab
	var activeArmy = PUDetails['workingFactories'] + PUDetails['workingVtols'];
	var activeLabs = PUDetails['workingLabs'];
	var activePU = activeArmy + activeLabs;
	if (isEnergyCritical()) {
		if (buildEnergy()) {
			queue("assignEnergy", reactionTime());
			return;
		} else {
			queue("assignEnergy", reactionTime() * 3);
			return;
		}
	}
	// When there is room for some new production
	if (activePU + 1 <= PUEnergy && activePU < PUCount) {
		if (activeLabs < lab) {
			if (withChance(personality.researchness)) {
				if (checkResearch()) {
					queue("assignEnergy", reactionTime());
					return;
				}
			}
		}
		if (withChance(personality.defensiveness)) {
			if (buildDefenses()) {
				queue("assignEnergy", reactionTime());
				return;
			}
		}
		if (activeArmy < army) {
			if (checkTruckProduction()) {
				queue("assignEnergy", reactionTime());
				return;
			}
			if (checkProduction()) {
				queue("assignEnergy", reactionTime());
				return;
			}
		}
	}
	// Assign idle trucks to build something
	if (checkConstruction()) {
		queue("assignEnergy", reactionTime());
		return;
	}
	// Build stuff
	if (power > personality.maxPower) {
		if (checkTruckProduction()) {
			queue("assignEnergy", reactionTime());
			return;
		}
		if (checkProduction()) {
			queue("assignEnergy", reactionTime());
			return;
		}
		if (checkResearch()) {
			queue("assignEnergy", reactionTime());
			return;
		}
	}
	queue("assignEnergy", reactionTime() * 3);
}

/**
 * Check if the energy production is in a critical state and building derricks or generators
 * is a top priority to prevent being stuck.
 */
_global.isEnergyCritical = function() {
	var oils = countFinishedStructList(structures.derricks);
	var gens = countStructList(structures.gens);
	var minPower = 0;
	if (gens == 0)
		minPower += 300; // Cost of a generator
	if (oils == 0)
		minPower += 250; // Cost of a derrick
	var power = myPower();
	return (myPower() < minPower);
}

/**
 * Get the number of Production Units the current energy supply can sustain.
 */
_global.getPUEnergy = function() {
	var puDerrick = 2;
	if (powerType == 0)
		puDerrick = 3;
	else if (powerType == 2)
		puDerrick = 1.5;
	var oils = countFinishedStructList(structures.derricks);
	var gens = countStructList(structures.gens);
	return Math.min(oils / puDerrick, puDerrick * gens);
}

_global.getPUDetails = function() {
	var facto = countFinishedStructList(structures.factories);
	var vtol = countFinishedStructList(structures.vtolFactories);
	var lab = countFinishedStructList(structures.labs);
	return {
		factories: facto,
		workingFactories: facto - (enumIdleStructList(structures.factories).length),
		vtols: vtol,
		workingVtols: vtol - (enumIdleStructList(structures.vtolFactories).length),
		labs: lab,
		workingLabs: lab - (enumIdleStructList(structures.labs).length),
	};
}

////////////////////////////////////////////////////////////////////////////////////////////
})(this);
