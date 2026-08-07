const { getHeadwear } = require("../../getters/headwear/getHeadwear");
const { getLockedHeadgear } = require("../../getters/headwear/getLockedHeadgear");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes a headwear from the user if worn.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the headwear
 * - (string) headwear - The type of headwear to remove
 * - (boolean) force - If true, forcibly removes all headwear
 * ---
 * ##### *No return value*
 **********/
function deleteHeadwear(serverID, userID, headwear, force = false) {
    traceFirstParam(arguments[0]);
    if (getHeadwear(serverID, userID) && getHeadwear(serverID, userID).find((h) => h.type == headwear)) {
        process.headwear[serverID][userID].splice(getHeadwear(serverID, userID).findIndex((h) => h.type == headwear), 1);
    }  
    if (force || (getHeadwear(serverID, userID) && getHeadwear(serverID, userID).length == 0)) {
        delete process.headwear[serverID][userID];
    } 
    markForSave("headwear");
};

exports.deleteHeadwear = deleteHeadwear;
exports.removeHeadwear = deleteHeadwear;