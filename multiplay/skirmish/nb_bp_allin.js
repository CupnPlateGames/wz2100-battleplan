// Load the regular Nullbot
NB_PATH = "/multiplay/skirmish/";
include(NB_PATH + "nb_generic.js");

include(NB_COMMON + "subpersonalities.js");

subpersonalities = {
	allin: subpersonalities.allin
}

buildOrder = function() {
	return buildOrder_AllIn();
}
