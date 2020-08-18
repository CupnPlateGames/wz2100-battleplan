
/*
 * This file lists all timers used by the AI.
 *
 */

(function(_global) {
////////////////////////////////////////////////////////////////////////////////////////////


// slightly shift all timers so that not to get too many of them on the same game frame,
// especially when multiple AI instances are running
function rnd() {
	return random(201) - 100;
}

_global.reactionTime = function() {
	var time = 0;
	switch (playerData[me].difficulty) {
		case EASY:
			time = 2000;
			break;
		case MEDIUM:
			time = 800;
			break;
		case HARD:
			time = 300;
			break;
		case INSANE:
			time = 100;
			break;
	}
	return time + random(30) - 15;
}

_global.setTimers = function() {
	setTimer("checkAttack", 100);
	setTimer("adaptCycle", 100);
	setTimer("rebalanceGroups", 10000 + 20 * rnd());
	if (difficulty === EASY)
		setTimer("goEasy", 30000);
}

////////////////////////////////////////////////////////////////////////////////////////////
})(this);
