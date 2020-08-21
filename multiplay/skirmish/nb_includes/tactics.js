
/*
 * This file is responsible for moving combat unit around.
 *
 */

(function(_global) {
////////////////////////////////////////////////////////////////////////////////////////////

_global.MAX_GROUPS = 3;
_global.miscGroup = MAX_GROUPS;
_global.vtolGroup = miscGroup + 1;
var groupInfo = [];
var firstTimeHarass = true;

function GroupInfo() {
	this.lastAttacked = undefined; // gameTime at the moment of the last combat
	this.target = undefined;
	this.microTarget = undefined;
	this.strength = 0;
	this.regrouping = false;
	this.retreating = false;
	this.roamingTarget = undefined;
}

function groupsBySize() {
	var ret = [0, 1, 2];
	ret.sort(function(one, two) { return groupSize(two) - groupSize(one); });
	return ret;
}

function propulsionGroupsBySize(propulsionIndex) {
	var ret = [propulsionIndex];
	ret.sort(function(one, two) { return groupSize(two) - groupSize(one); });
	return ret;
}

function findLargestGroupIn(list) {
	var sizes = []
	for (var i = 0; i < MAX_GROUPS; ++i)
		sizes[i] = 0;
	list.forEach(function(object) {
		if (!defined(object.group) || object.group < 0 && object.group >= MAX_GROUPS)
			return;
		++sizes[object.group];
	});
	var maxCount = 0, maxIdx = 0;
	for (var i = 0; i < sizes.length; ++i)
		if (sizes[i] > maxCount) {
			maxCount = sizes[i];
			maxIdx = i;
		}
	return maxIdx;
}

function findNearestGroup(x, y) {
	var ret = naiveFindClusters(enumDroid(me).filter(function(droid) {
		return !isVTOL(droid) && (droid.droidType === DROID_WEAPON || droid.droidType === DROID_CYBORG);
	}), baseScale / 3);
	if (ret.maxCount === 0)
		return undefined;
	var minDist = Infinity, minIdx;
	var gr = [];
	for (var i = 0; i < ret.clusters.length; ++i) {
		gr[i] = findLargestGroupIn(ret.clusters[i]);
		var dist = distance(ret.xav[i], ret.yav[i], x, y);
		if (dist < minDist) {
			minDist = dist;
			minIdx = i;
		}
	}
	if (defined(minIdx))
		return gr[minIdx];
	gr = groupsBySize();
	if (gr.length > 0)
		return gr[0];
}

_global.estimateTargetStrength = function(object) {
	function uncached() {
		var strength = 0;
		var enemies = enumRange(object.x, object.y, baseScale, ENEMIES, false).filter(function(obj) {
			return (obj.type == STRUCTURE && obj.stattype == DEFENSE || (obj.type == DROID && obj.droidType == DROID_WEAPON));
		});
		enemies.forEach(function(e) {
			if (e.type == STRUCTURE)
				strength += e.cost * 1.2;
			else
				strength += e.cost;
		});
		return strength;
	}
	return cached(uncached, 2000, object.id);
}

_global.estimateGroupStrength = function(group) {
	var strength = 0;
	enumGroup(group).filter(checkRepaired).forEach(function(d) {
		strength += d.cost;
	})
	return strength;
}

function getGroupInfo(gr) {
	if (defined(groupInfo[gr])) {
		var gi = groupInfo[gr];
		if (defined(gi.target)) {
			if (gi.target.type == FEATURE) {
				if (getObject(gi.target.x, gi.target.y) == null) {
					groupInfo[gr].target = undefined;
				}
			} else {
				if (getObject(gi.target.type, gi.target.player, gi.target.id) == null) {
					groupInfo[gr].target = undefined;
				}
			}
		}
		if (defined(gi.microTarget)) {
			if (getObject(gi.microTarget.type, gi.microTarget.player, gi.microTarget.id) == null) {
				groupInfo[gr].microTarget = undefined;
			}
		}
		if (defined(gi.roamingTarget)) {
			if (getObject(gi.roamingTarget.type, gi.roamingTarget.player, gi.roamingTarget.id) == null) {
				groupInfo[gr].roamingTarget = undefined;
			}
		}
		return groupInfo[gr];
	}
	groupInfo[gr] = new GroupInfo();
	return groupInfo[gr];
}

/** Check if the current target is still valid or pick an other valid one. 
 * @return the target or undefined.
 */
function getTargets() {
	var ret = {
		powerups: [],
		base: [],
		units: [],
	};
	function sortByDistance(one, two) {
		return one.distance - two.distance;
	}
	// Powerup targets
	var powerList = [];
	powerUps.forEach(function(stat) {
		powerList = powerList.concat(enumFeature(-1, stat));
	});
	powerList = powerList.filter(function(feature) {
		if (iHaveHover())
			if (canReachFromBase(getPropulsionStatsComponents(PROPULSIONUSAGE.HOVER)[0], feature))
				return true;
		return canReachFromBase(getPropulsionStatsComponents(PROPULSIONUSAGE.GROUND)[0], feature);
	});
	for (var i = 0; i < powerList.length; i++) {
		powerList[i] = {target: powerList[i], distance: distanceToBase(powerList[i]), strength: 0};
	}
	powerList.sort(sortByDistance);
	if (powerList.length > 2) { // Keep only the two nearest targets to prevent crossing the entire map
		powerList = [powerList[0], powerList[1]];
	}
	if (powerList.length > 0) {
		for (var i = 0; i < powerList.length; i++) {
			powerList[i].strength = estimateTargetStrength(powerList[i].target);
			ret.powerups.push(powerList[i]);
		}
	}
	// Structure targets
	var structList = [];
	for (var p = 0; p < maxPlayers; p++) {
		if (isEnemy(p)) {
			targets.forEach(function(structType) {
				var structs = enumStruct(p, structType);
				var targetStructs = [];
				for (var i = 0; i < structs.length; i++) {
					targetStructs.push({target: structs[i], distance: distanceToBase(structs[i]), strength: 0});
				}
				targetStructs.sort(sortByDistance);
				for (var i = 0; i < Math.min(3, targetStructs.length); i++) {
					targetStructs[i].strength = estimateTargetStrength(targetStructs[i].target);
					ret.base.push(targetStructs[i]);
				}
			});
		}
	}
	// Unit targets
	var unitList = [];
	for (var p = 0; p < maxPlayers; p++) {
		if (isEnemy(p)) {
			unitList = unitList.concat(enumDroid(p, DROID_CONSTRUCT));
		}
	}
	for (var i = 0; i < unitList.length; i++) {
		unitList[i] = {target: unitList[i], distance: distanceToBase(unitList[i]), strength: 0};
	}
	unitList.sort(sortByDistance);
	for (var i = 0; i < Math.min(3, unitList.length); i++) {
		unitList[i].strength = estimateTargetStrength(unitList[i].target);
		ret.units.push(unitList[i]);
	}
	return ret;
}

_global.regroup = function(gr) {
	var gi = getGroupInfo(gr);
	var ret = naiveFindClusters(enumGroup(gr).filter(checkRepaired), (baseScale / 2));
	if (ret.maxCount === 0) {
		groupInfo[gr].regrouping = false;
		return false;
	}
	var size = groupSize(gr);
	var waitForRegrouping = (ret.maxCount < (size * 0.67));
	for (var i = 0; i < ret.clusters.length; ++i) {
		for (var j = 0; j < ret.clusters[i].length; ++j) {
			if (i !== ret.maxIdx) {
				orderDroidLoc(ret.clusters[i][j], DORDER_MOVE, ret.xav[ret.maxIdx], ret.yav[ret.maxIdx]);
			} else if (waitForRegrouping) {
				orderDroid(ret.clusters[ret.maxIdx][j], DORDER_STOP);
			}
		}
	}
	groupInfo[gr].regrouping = waitForRegrouping;
	return waitForRegrouping;
}

_global.retreat = function(gr) {
	gi = getGroupInfo(gr);
	gi.target = undefined;
	gi.microTarget = undefined;
	gi.retreating = true;
	enumGroup(gr).filter(checkRepaired).forEach(function(droid) {
		orderDroid(droid, DORDER_RTB);
	});
}

function weHaveRepair() {
	function uncached() {
		return enumStruct(me, REPAIR_FACILITY).length > 0;
	}
	return cached(uncached, 1000);
}

function checkRepaired(droid) {
	if (!weHaveRepair())
		return true;
	if (droid.order === DORDER_RTR)
		return false;
	if (droid.health < personality.repairAt) {
		orderDroid(droid, DORDER_RTR);
		return false;
	}
	return true;
}

_global.getCurrentTarget = function(gr) {
	var groupInfo = getGroupInfo(gr);
	var obj = groupInfo.microTarget;
	var obj2 = groupInfo.target;
	if (obj == null) {
		groupInfo.microTarget = undefined;
		obj = undefined;
	}
	if (obj2 == null) {
		groupInfo.target = undefined;
		obj2 = undefined;
	}
	if (gameTime > groupInfo.lastAttacked + 10000) {
		groupInfo.microTarget = undefined;
		groupInfo.retreating = false;
	}
	if (groupInfo.retreating)
		return undefined;
	if (!defined(obj))
		obj = obj2;
	return obj;
}

function attackTarget(droid) {
	var gi = getGroupInfo(droid.group);
	var target = getCurrentTarget(droid.group);
	if (!defined(target)) {
		if (defined(gi.roamingTarget) && gi.roamingTarget.type == DROID) {
			// Get the droid to update it's position and follow it
			var targetDroid = getObject(gi.roamingTarget.type, gi.roamingTarget.player, gi.roamingTarget.id)
			if (targetDroid != null) {
				orderDroidLoc(droid, DORDER_SCOUT, targetDroid.x, targetDroid.y);
			} else {
				getGroupInfo(droid.group);
				groupInfo[droid.group].roamingTarget = undefined;
				orderDroid(droid, DORDER_RTB);
			}
		} else {
			orderDroid(droid, DORDER_RTB);
		}
		return;
	}
	switch (target.type) {
		case DROID:
			if (droid.droidType === DROID_SENSOR)
				orderDroidObj(droid, DORDER_OBSERVE, target);
			else if (droid.canHitGround === true && !isVTOL(target))
				orderDroidObj(droid, DORDER_ATTACK, target);
			else if(droid.canHitAir === true && isVTOL(target))
				orderDroidObj(droid, DORDER_ATTACK, target);
			else
				orderDroidLoc(droid, DORDER_SCOUT, target.x, target.y);
			break;
		case FEATURE:
			orderDroidObj(droid, DORDER_RECOVER, target);
			break;
		case STRUCTURE:
			if (droid.droidType !== DROID_SENSOR)
				orderDroidLoc(droid, DORDER_SCOUT, target.x, target.y);
			else
				orderDroidObj(droid, DORDER_OBSERVE, target);
			break;
		default:
			orderDroidLoc(droid, DORDER_SCOUT, target.x, target.y);
			break;
	}
}

function pickVtolTarget(droid) {
	function uncached() {
		function canHit(obj) {
			return vtolCanHit(droid, obj);
		}
		var enemy = enumLivingPlayers().filter(isEnemy).random();
		var list;
		list = enumStructList(miscTargets, enemy).filter(canHit);
		if (list.length > 0) return list.random();
		list = enumStruct(enemy, DEFENSE).filterProperty("canHitAir", true).filter(canHit);
		if (list.length > 0) return list.random();
		list = enumDroid(enemy, DROID_WEAPON).filterProperty("canHitAir", true).filter(canHit);
		if (list.length > 0) return list.random();
		list = enumDroid(enemy, DROID_CYBORG).filterProperty("canHitAir", true).filter(canHit);
		if (list.length > 0) return list.random();
		list = enumStructList(targets, enemy).filter(canHit);
		if (list.length > 0) return list.random();
		list = enumDroid(enemy).filter(canHit);
		if (list.length > 0) return list.random();
	}
	return cached(uncached, 100, droid.canHitAir + 2 * droid.canHitGround);
}

function vtolReady(droid) {
	if (droid.order == DORDER_ATTACK)
		return false;
	if (vtolArmed(droid, 99))
		return true;
	if (droid.order != DORDER_REARM) {
		orderDroid(droid, DORDER_REARM);
		buildVtols() // actually pads
	}
	return false;
}

_global.vtolCanHit = function(droid, obj) {
	if (droid.type === DROID && obj.type === DROID && isVTOL(obj))
		return droid.canHitAir;
	else
		return droid.canHitGround;
}

_global.vtolArmed = function(obj, percent) {
	if (obj.type != DROID)
		return;
	if (!isVTOL(obj))
		return false;
	for (var i = 0; i < obj.weapons.length; ++i)
		if (obj.weapons[i].armed >= percent)
			return true;
	return false;
}

_global.setTarget = function(object, group) {
	if (!defined(group)) {
		group = findNearestGroup(object.x, object.y);
	}
	if (!defined(group))
		return false;
	if (throttled(10000, group)) // don't switch targets too often
		return false;
	var groupInfo = getGroupInfo(group);
	if (object.type === DROID || (object.type === STRUCTURE && object.stattype === DEFENSE))
		groupInfo.microTarget = object;
	else
		groupInfo.target = object;
	return true;
}

_global.unsetTarget = function(player) {
	for (var i = 0; i <= MAX_GROUPS; ++i) {
		var obj = safeGetObject(groupTargetLabel(i));
		if (defined(obj) && obj.type === POSITION && findBeaconPlayer(obj.x, obj.y) === player)
			removeLabel(groupTargetLabel(i));
	}
}

_global.groupDroid = function(droid) {
	if (droid.droidType === DROID_WEAPON || droid.droidType === DROID_CYBORG) {
		if (isVTOL(droid)) {
			groupAdd(vtolGroup, droid);
			return vtolGroup;
		}
		var propulsionIndex = 0;
		switch (droid.propulsion) {
		case "wheeled01":
			propulsionIndex = 0;
			break;
		case "tracked01":
			propulsionIndex = 1;
			break;
		case "hover01":
			propulsionIndex = 2;
			break;
		}
		var grp = propulsionGroupsBySize(propulsionIndex);
		if (grp.length == 0)
			grp = [ miscGroup ];
		groupAdd(grp[0], droid);
		return grp[0];
	}
	if (droid.droidType === DROID_SENSOR) {
		groupAdd(miscGroup, droid);
		return miscGroup;
	}
}

_global.rebalanceGroups = function() {
	if (throttled(5000))
		return;
	if (groupSize(miscGroup) > personality.maxMiscTanks) {
		var list = enumGroup(miscGroup).shuffle();
		for (var i = personality.maxMiscTanks; i < personality.maxMiscTanks + 5 && i < list.length; ++i)
			groupDroid(list[i]);
	}
}

_global.touchGroup = function(gr) {
	getGroupInfo(gr); // make sure everything is defined
	groupInfo[gr].lastAttacked = gameTime;
}

_global.dangerLevel = function(loc) {
	return enumRange(loc.x, loc.y, baseScale / 2, ENEMIES, false).length;
}

_global.checkAttack = function() {
	for (var i = 0; i < MAX_GROUPS; ++i) {
		if (!throttled(reactionTime(), i)) {
			if (!regroup(i)) {
				enumGroup(i).filter(checkRepaired).forEach(attackTarget);
			}
		}
	}
	if (!throttled(reactionTime() * 2, "vtols")) {
		var droids = enumGroup(vtolGroup).filter(vtolReady);
		droids.forEach(function(droid) {
			var target = pickVtolTarget(droid);
			if (defined(target))
				orderDroidObj(droid, DORDER_ATTACK, target);
		});
	}
}


function isTargetted(obj) {
	for (var i = 0; i < MAX_GROUPS; i++) {
		var gi = getGroupInfo(i);
		if (defined(gi.target) && gi.target.id == obj.id) {
			return true;
		}
	}
	return false;
}

/** Assign a target to a group.
 * @param group the group number
 * @param strength the strength of the group(s) to check
 * @param targetList the list of targets from getTargets()
 * @param minStrengthRatio minimum (strength / target strength) for assignment
 * @return true when a target is found, false otherwise.
 */
function assignTarget(group, strength, targetList, minStrengthRatio) {
	for (var i = 0; i < targetList.powerups.length; i++) {
		var pu = targetList.powerups[i];
		if (getObject(pu.target.x, pu.target.y) == null)
			continue;
		if (!isTargetted(pu.target) && strength / pu.strength >= minStrengthRatio) {
			groupInfo[group].target = pu.target;
			groupInfo[group].roamingTarget = undefined;
			return true;
		}
	}
	for (var i = 0; i < targetList.base.length; i++) {
		var base = targetList.base[i];
		if (getObject(base.target.type, base.target.player, base.target.id) == null)
			continue;
		if (strength / base.strength >= minStrengthRatio) {
			groupInfo[group].target = base.target;
			groupInfo[group].roamingTarget = undefined;
			return true;
		}
	}
	for (var i = 0; i < targetList.units.length; i++) {
		var unit = targetList.units[i];
		if (getObject(unit.target.type, unit.target.player, unit.target.id) == null)
			continue;
		if (strength / unit.strength >= minStrengthRatio) {
			groupInfo[group].target = unit.target;
			groupInfo[group].roamingTarget = undefined;
			return true;
		}
	}
	return false;
}

_global.updateTargets = function() {
	var idleGroups = [];
	// Check if the current target is still valid, look for idle groups
	for (var i = 0; i < MAX_GROUPS; ++i) {
		var gi = getGroupInfo(i);
		groupInfo[i].strength = estimateGroupStrength(i);
		if (defined(gi.target)) {
			if (gi.strength / estimateTargetStrength(gi.target) < 1.0) {
				groupInfo[i].target = undefined;
			}
		}
		if (!defined(gi.target) && !gi.regrouping && groupSize(i) > 0) {
			idleGroups.push(i);
		}
	}
	function uncached() {
		return getTargets();
	}
	var validTargets = cached(uncached, reactionTime() * 10);
	// Assign targets to individual groups, try a more cautious full blow with still idle ones
	var stillIdleGroups = [];
	var roamingGroups = [];
	for (var i = 0; i < idleGroups.length; i++) {
		var gp = idleGroups[i];
		if (!assignTarget(gp, groupInfo[gp].strength, validTargets, 1.0)) {
			stillIdleGroups.push(gp);
		}
	}
	if (stillIdleGroups.length > 0) {
		var idleStrength = 0;
		stillIdleGroups.forEach(function(gp) {
			idleStrength += groupInfo[gp].strength;
		});
		stillIdleGroups.forEach(function(gp) {
			if (!assignTarget(gp, idleStrength, validTargets, 1.75)) {
				roamingGroups.push(gp);
			}
		});
	}
	// Roam when there is nothing more
	if (roamingGroups.length > 0) {
		var trucks = enumTrucks();
		if (trucks.length > 0) {
			roamingGroups.forEach(function(gp) {
				if (!defined(groupInfo[gp].roamingTarget)) {
					trucks.shuffle();
					groupInfo[gp].roamingTarget = trucks[0];
				}
			});
		}
	}
}

_global.pushVtols = function(object) {
	var vtols = enumRange(object.x, object.y, 20, me, false);
	var enemies = enumRange(object.x, object.y, 8, ENEMIES, true);
	for (var i = 0; i < vtols.length; ++i)
		if (vtolArmed(vtols[i], 1))
			for (var j = 0; j < enemies.length; ++j)
				if (vtolCanHit(vtols[i], enemies[j])) {
					orderDroidObj(vtols[i], DORDER_ATTACK, enemies[j]);
					break;
				}
}

_global.inPanic = function() {
	function uncached() {
		var badGuys = enumRange(baseLocation.x, baseLocation.y, baseScale, ENEMIES).length;
		var goodGuys = enumRange(baseLocation.x, baseLocation.y, baseScale, ALLIES).filter(function(object) {
			return object.type === DROID && (object.droidType === DROID_WEAPON || object.droidType === DROID_CYBORG);
		}).length;
		return 3 * badGuys > 2 * goodGuys;
	}
	return cached(uncached, 10000);
}

////////////////////////////////////////////////////////////////////////////////////////////
})(this);
