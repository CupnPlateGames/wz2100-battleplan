// Load the regular Nullbot
NB_PATH = "/multiplay/skirmish/";
include(NB_PATH + "nb_generic.js");

include(NB_COMMON + "subpersonalities.js");

delete subpersonalities.CR;
delete subpersonalities.CMs;

propulsionStats[0].chance=25; // Wheels
propulsionStats[1].res = "R-Vehicle-Prop-Hover";
propulsionStats[1].stat = "hover01";
propulsionStats[1].chance=65; // Replace tracks by hovers

Object.keys(subpersonalities).forEach(function(key) {
	subpersonalities[key].vtolness = subpersonalities[key].vtolness * 1.5;
	subpersonalities[key].defensiveness = Math.floor(subpersonalities[key].defensiveness * 0.8);
	subpersonalities[key].minHoverTrucks = subpersonalities[key].minHoverTrucks + 1;
	if (subpersonalities[key].vtolness > 60) subpersonalities[key].vtolness = 60;
	else if (subpersonalities[key].vtolness == 0) subpersonalities[key].vtolness = 40;
});
