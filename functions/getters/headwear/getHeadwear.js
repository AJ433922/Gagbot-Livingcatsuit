const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");

/*******
 * Get the worn headwear for a user
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user that's wearing the head gear
 * ---
 * ##### Returns an array of headwear objects. All headwear will have the following props:
 * - type: String name of the headwear type
 * - origbinder: The user ID who put this headwear on the wearer
 * - lock?: If specified, the item is locked and needs to be checked for access
 * ###### Additional properties may be added by other functions
 *******/
function getHeadwear(serverID, userID) {
    traceFirstParam(arguments[0]);
    return getProcessVariable(serverID, userID, "headwear");
}

exports.getHeadwear = getHeadwear;