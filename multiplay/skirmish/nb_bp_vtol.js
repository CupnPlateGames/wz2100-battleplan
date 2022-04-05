// Load the regular Nullbot
NB_PATH = "/multiplay/skirmish/";
include(NB_PATH + "nb_generic.js");

include(NB_COMMON + "subpersonalities.js");

delete subpersonalities.FHw;
delete subpersonalities.MGHw;

Object.keys(subpersonalities).forEach(function(key) {
	subpersonalities[key].vtolness = subpersonalities[key].vtolness * 2;
	if (subpersonalities[key].vtolness > 80) subpersonalities[key].vtolness = 80;
	else if (subpersonalities[key].vtolness == 0) subpersonalities[key].vtolness = 90;
});

buildOrder = function() {
	return buildOrder_VTOL();
}
