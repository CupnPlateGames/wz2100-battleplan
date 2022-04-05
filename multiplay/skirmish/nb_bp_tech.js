// Load the regular Nullbot
NB_PATH = "/multiplay/skirmish/";
include(NB_PATH + "nb_generic.js");

include(NB_COMMON + "subpersonalities.js");

Object.keys(subpersonalities).forEach(function(key) {
	subpersonalities[key].researchness = subpersonalities[key].researchness * 2;
	if (subpersonalities[key].researchness > 50) subpersonalities[key].researchness = 50;
	else if (subpersonalities[key].researchness == 0) subpersonalities[key].researchness = 20;
});

buildOrder = function() {
	return buildOrder_Research();
}
