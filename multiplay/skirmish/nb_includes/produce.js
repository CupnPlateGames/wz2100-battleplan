
/*
 * This file is responsible for droid production.
 *
 */

(function(_global) {
////////////////////////////////////////////////////////////////////////////////////////////

function ourBuildDroid(factory, name, bodies, propulsions, weapons1, weapons2, weapons3) {
	return buildDroid(factory, name, bodies, propulsions, "", "", weapons1, weapons2, weapons3);
}

function produceTruck(factory, turrets) {
	var turret = truckTurrets.concat();
	if (defined(turrets))
		turret = turrets.concat();
	turret.reverse();
	// TODO: switch to using chooseBodyWeaponPair() here
	var bodies = filterBodyStatsByUsage(BODYUSAGE.TRUCK, BODYCLASS.KINETIC).map(function(val) { return val.stat; });
	var propulsions = getPropulsionStatsComponents(PROPULSIONUSAGE.GROUND|PROPULSIONUSAGE.HOVER);
	return ourBuildDroid(factory, "Fancy Truck", bodies, propulsions, turret);
}

function chooseWeapon(forVtol) {
	if (!defined(forVtol))
		forVtol = false;
	if (forVtol) {
		var ret = chooseAvailableWeaponPathByRoleRatings(getProductionPaths(), chooseAttackWeaponRole(), 3);
		if (defined(ret))
			return ret.vtols.concat().reverse();
	} else {
		var ret = chooseAvailableWeaponPathByRoleRatings(getProductionPaths(), chooseAttackWeaponRole(), 0);
		if (defined(ret))
			return ret.weapons.concat().reverse();
	}
}

function chooseBodyWeaponPair(bodies, weapons, numModules) {
	if (!defined(bodies))
		return undefined;
	if (!defined(weapons))
		return undefined;
	var candidates = [];
	for (var i = 0; i < weapons.length; ++i) {
		var w = weapons[i].stat, ww = weapons[i].weight;
		if (!componentAvailable(w))
			continue;
		for (var j = 0; j < bodies.length; ++j) {
			var b = bodies[j].stat, bw = bodies[j].weight;
			if ((bw == WEIGHT.MEDIUM && numModules < 1) || (bw == WEIGHT.HEAVY && numModules < 2))
				continue;
			if (!componentAvailable(b))
				continue;
			switch(ww) {
				case WEIGHT.ULTRALIGHT:
					if (bw <= WEIGHT.LIGHT)
						candidates.push({b: b, w: w});
					break;
				case WEIGHT.LIGHT:
					if (bw <= WEIGHT.MEDIUM)
						candidates.push({b: b, w: w});
					break;
				case WEIGHT.MEDIUM:
						candidates.push({b: b, w: w});
					break;
				case WEIGHT.HEAVY:
					if (bw >= WEIGHT.MEDIUM)
						candidates.push({b: b, w: w});
					break;
				case WEIGHT.ULTRAHEAVY:
					if (bw >= WEIGHT.HEAVY)
						candidates.push({b: b, w: w});
					break;
			}
		}
	}
	if (candidates.length > 0)
		return candidates[Math.floor(Math.random() * candidates.length)];
}

function produceTank(factory) {
    // TODO: needs refactoring. Make some more clever sorting.
    var bodies = [];
    if (chooseBodyClass() === BODYCLASS.KINETIC) {
        bodies = bodies.concat(
			filterBodyStatsByUsage(BODYUSAGE.GROUND, BODYCLASS.KINETIC),
			filterBodyStatsByUsage(BODYUSAGE.GROUND, BODYCLASS.THERMAL)
		);
    } else {
        bodies = bodies.concat(
			filterBodyStatsByUsage(BODYUSAGE.GROUND, BODYCLASS.THERMAL),
            filterBodyStatsByUsage(BODYUSAGE.GROUND, BODYCLASS.KINETIC)
		);
    }
    var propulsions;
	var ret = scopeRatings();
	var rnd = random(ret.land + ret.sea);
	if (!defined(rnd)) // we need only vtols?
		return false;
	propulsions = getPropulsionStatsComponents(PROPULSIONUSAGE.GROUND_HOVER);
	if (iHaveHover()) {
		if (rnd >= ret.land)
			propulsions = getPropulsionStatsComponents(PROPULSIONUSAGE.HOVER);
	} else {
		if (ret.land === 0)
			return false;
	}
	var bwPair = chooseBodyWeaponPair(bodies, chooseWeapon(), factory.modules);
	var selectedProp = [];
	selectedProp.push(propulsions[Math.floor(Math.random() * propulsions.length)]);
	if (!defined(bwPair))
		return false;
	return ourBuildDroid(factory, "Tank", bwPair.b, selectedProp, bwPair.w, bwPair.w, bwPair.w);
}

function produceVtol(factory) {
	// TODO: consider thermal bodies
	var bodies = filterBodyStatsByUsage(BODYUSAGE.AIR, BODYCLASS.KINETIC)
	var propulsions = getPropulsionStatsComponents(PROPULSIONUSAGE.VTOL);
	var bwPair = chooseBodyWeaponPair(bodies, chooseWeapon(true), factory.modules);
	if (!defined(bwPair))
		return false;
	return ourBuildDroid(factory, "VTOL", bwPair.b, propulsions, bwPair.w, bwPair.w, bwPair.w);
}

function produceTemplateFromList(factory, list) {
	var ret = scopeRatings();
	for (var i = list.length - 1; i >= 0; --i) {
		if (ret.land === 0 && !isHoverPropulsion(list[i].prop) && !isVtolPropulsion(list[i].prop))
			continue;
		if (ret.land === 0 && ret.sea === 0 && !isVtolPropulsion(list[i].prop))
			continue;
		if (isVtolPropulsion(list[i].prop) !== (factory.stattype === VTOL_FACTORY))
			continue;
		if ((!randomTemplates) || withChance(100 / (i + 1)))
			if (ourBuildDroid(factory, "Template Droid", list[i].body, list[i].prop, list[i].weapons[0], list[i].weapons[1], list[i].weapons[2]))
				return true;
	}
	return false;
}

function produceTemplate(factory) {
	var path = chooseAvailableWeaponPathByRoleRatings(getProductionPaths(), chooseAttackWeaponRole(), 1);
	if (defined(path))
		return produceTemplateFromList(factory, path.templates);
	return false;
}

_global.checkTruckProduction = function() {
	var trucks = enumTrucks();
	var unitCount = enumDroid(me).length;
	// At least 1 truck and never more than other units
	if (trucks.length > 0 && trucks.length > unitCount / 2)
		return false;
	var hoverTrucksCount = trucks.filter(function(droid) { return isHoverPropulsion(droid.propulsion); }).length;
	if (iHaveHover() && hoverTrucksCount < personality.minHoverTrucks) {
		var groundTrucks = trucks.filter(function(droid) { return !isHoverPropulsion(droid.propulsion); });
		if (groundTrucks.length > personality.minTrucks) {
			groundTrucks.length -= personality.minTrucks;
			groundTrucks.forEach(function(droid) { orderDroid(droid, DORDER_RECYCLE); });
			return false;
		}
	}
	if (trucks.length >= getDroidLimit(me, DROID_CONSTRUCT))
		return false;
	if (trucks.length < personality.minTrucks || myPower() > personality.maxPower
		|| (iHaveHover() && hoverTrucksCount < personality.minHoverTrucks)
	) {
		// Never more than 1/3rd of units when above minTrucks
		if (trucks.length >= personality.minTrucks && trucks.length > unitCount / 3)
			return false;
		var f;
		f = enumFinishedStructList(structures.factories)[0];
		if (defined(f))
			if (structureIdle(f))
				if (produceTruck(f))
					return true;
		if (defined(f))
			return false;
	}
	if (!iHaveArty())
		return false;
	var sensors = enumDroid(me, DROID_SENSOR).length;
	if (withChance(100 - 100 * sensors / personality.maxSensors)) {
		f = enumFinishedStructList(structures.factories)[0];
		if (defined(f))
			if (structureIdle(f))
				if (produceTruck(f, sensorTurrets))
					return true;
	}
	return false;
}

function checkTankProduction() {
	if (!iCanDesign())
		return false; // don't cheat by producing tanks before design is available (also saves money for early generators)
	var success = false;
	enumIdleStructList(structures.factories).forEach(function(factory) {
		success = success || produceTank(factory);
	});
	return success;
}

function checkTemplateProduction() {
	var success = false;
	enumIdleStructList(structures.templateFactories)
		.concat(enumIdleStructList(structures.vtolFactories))
		.forEach(function(factory)
	{
		success = success || produceTemplate(factory);
	});
	return success;
}

function checkVtolProduction() {
	var success = false;
	if (!iCanDesign())
		return false; // don't cheat by producing vtols before design is available
	enumIdleStructList(structures.vtolFactories).forEach(function(factory) {
		success = success || produceVtol(factory);
	});
	return success;
}

_global.checkProduction = function() {
	if (isEnergyCritical())
		return;
	switch(chooseObjectType()) {
		case 3:
			if (checkVtolProduction())
				return;
		default:
			if (checkTankProduction())
				return;
	}
	// if having too much energy, don't care about what we produce
	if (myPower() > personality.maxPower) {
		queue("checkConstruction");
		checkTankProduction();
		checkVtolProduction();
	}
}

////////////////////////////////////////////////////////////////////////////////////////////
})(this);
