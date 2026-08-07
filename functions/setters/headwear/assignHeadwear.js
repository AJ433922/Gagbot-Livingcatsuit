const { getBaseHeadwear } = require("../../getters/headwear/getBaseHeadwear");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");
const { statsAddCounter } = require("../config/statsAddCounter");

/**********
 * Adds or modifies a headwear on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the headgear
 * - (string) headwear - Headwear item ID
 * - (user id) origbinder - The person doing the action
 * ---
 * ##### *No return value*
 **********/
function assignHeadwear(serverID, userID, headwear, origbinder) {
    traceFirstParam(arguments[0]);
    if (process.headwear == undefined) {
        process.headwear = {};
    }
    if (process.headwear[serverID] == undefined) {
        process.headwear[serverID] = {};
    }
    if (process.headwear[serverID][userID]) {
        process.headwear[serverID][userID] = [];
    }
    let existing = process.headwear[serverID][userID]?.find((h) => h.type == headwear)
    if (!existing) {
        if (!process.headwear[serverID][userID]) {
            process.headwear[serverID][userID] = [];
        }
        if (process.headwear[serverID][userID]) {
            process.headwear[serverID][userID].push(
                {
                    type: headwear,
                    origbinder: origbinder ?? userID,
                    lockable: getBaseHeadwear(headwear).lockable
                }
            )
        }
        
        statsAddCounter(serverID, userID, "wornmasks")
    }

    markForSave("headwear");
};

exports.assignHeadwear = assignHeadwear;