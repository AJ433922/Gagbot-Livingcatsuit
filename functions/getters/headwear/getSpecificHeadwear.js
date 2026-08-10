const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { getProcessVariable } = require("../config/getProcessVariable");
const { getHeadwear } = require("./getHeadwear");

/*******
 * Get a specific piece of headwear that the user is wearing.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user that's wearing the head gear
 * - (string) itemname - The specific headwear we want to retrieve
 * ---
 * ##### Returns the specific headwear object
 *******/
function getSpecificHeadwear(serverID, userID, itemname) {
    traceFirstParam(arguments[0]);
    if (getHeadwear(serverID, userID)) {
        return getHeadwear(serverID, userID).find((h) => h.type == itemname)
    }
}

exports.getSpecificHeadwear = getSpecificHeadwear;