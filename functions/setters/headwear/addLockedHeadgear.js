const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * DEPRECATED (this will cause a crash): Adds a locked headwear item on the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the collar
 * - (string) headwear - Headwear item ID
 * ---
 * ##### *No return value*
 **********/
function addLockedHeadgear(serverID, userID, headwear) {
    traceFirstParam(arguments[0]);
    console.log("Calling addLockedHeadgear")
    console.log(new Error);
	/*if (process.headwear == undefined) {
		process.headwear = {};
	}
    if (process.headwear[serverID] == undefined) {
		process.headwear[serverID] = {};
	}
	if (process.headwear[serverID][userID]) {
		if (process.headwear[serverID][userID].locked == undefined) {
			process.headwear[serverID][userID].locked = [headwear];
		} else {
			process.headwear[serverID][userID].locked.push(headwear);
		}
	}*/
	markForSave("headwear");
};

exports.addLockedHeadgear = addLockedHeadgear;