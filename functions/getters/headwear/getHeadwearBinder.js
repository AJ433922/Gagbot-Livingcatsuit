const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getSpecificHeadwear } = require("./getSpecificHeadwear");

/********
 * Gets the person who put a piece of headwear on the user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the headgear
 * - (string) item - The item ID to check 
 * ---
 * ##### Returns the user ID who put this headgear on the wearer
 ********/
function getHeadwearBinder(serverID, userID, item) {
    traceFirstParam(arguments[0]);
	return getSpecificHeadwear(serverID, userID, item).origbinder
}

exports.getHeadwearBinder = getHeadwearBinder;