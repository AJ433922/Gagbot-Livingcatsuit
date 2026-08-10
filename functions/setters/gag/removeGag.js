const { getGag } = require("../../getters/gag/getGag");
const { canRemoveLock } = require("../../getters/lock/canRemoveLock");
const { markForSave } = require("../../other/markForSave");
const { traceFirstParam } = require("../../other/TESTS/traceFirstParam");

/**********
 * Removes a gag from the user.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person wearing the gag
 * - (string) specificgag - The type of gag to remove
 * - (user id) removerID = undefined - The person removing the gag (only used for removing multiple gags at once)
 * - (boolean) force = false - If true, forcibly removes the gag even past the headgear
 * ---
 * ##### *No return value*
 **********/
function deleteGag(serverID, userID, specificgag, removerID, force = false) {
    traceFirstParam(arguments[0]);
	if (process.gags == undefined) {
		process.gags = {};
	}
	// Remove all gags if none is specified.

    if (!specificgag && process.gags[serverID] && process.gags[serverID][userID]) {
        let newGags = [];
        process.gags[serverID][userID].forEach((g) => {
            if(!force && getGag(serverID, userID, g.gagtype)?.lock && !canRemoveLock(serverID, userID, removerID, getGag(serverID, userID, g.gagtype).lock.uuid)) {
                // We are not force removing, the gag is locked and we don't have access to the lock. Keep it in the list.
                newGags.push(g);
            } else {
                // We are either force removing, the gag is unlocked or we have access. Remove it and call onUnlock if it exists.
                if (process.gagtypes[g.gagtype] && process.gagtypes[g.gagtype].onUnlock) {
                    process.gagtypes[g.gagtype].onUnlock({ serverID: serverID, userID: userID });
                }
            }
        });
        process.gags[serverID][userID] = newGags;
    /*}
	if (!specificgag && process.gags[serverID] && process.gags[serverID][userID]) {
        let lockedheadgears = [];
        if ((lockedheadgears.length < 1) || force) {
            // They dont have anything locked on their head, business as usual. 
            process.gags[serverID][userID].forEach((g) => {
                if (process.gagtypes[g.gagtype] && process.gagtypes[g.gagtype].onUnlock) {
                    process.gagtypes[g.gagtype].onUnlock(serverID, userID);
                }
            })
            delete process.gags[serverID][userID];
        }
        else {
            process.gags[serverID][userID].forEach((g) => {
                if (process.gagtypes[serverID] && process.gagtypes[serverID][g.gagtype] && process.gagtypes[serverID][g.gagtype].onUnlock) {
                    process.gagtypes[serverID][g.gagtype].onUnlock(userID);
                }
                /*if (!process.headwear[serverID][userID][`gagharness_${g.gagtype}`]) {
                    // Splice out any gags that are eligible to be removed. 
                    let loc = process.gags[serverID][userID].findIndex((f) => f.gagtype == g.gagtype);
                    process.gags[serverID][userID].splice(loc, 1);
                }*/
            /*})
        }*/
	} else if (process.gags[serverID] && process.gags[serverID][userID]) {
		let loc = process.gags[serverID][userID].findIndex((f) => f.gagtype == specificgag);
		if (loc > -1) {
            if (process.gagtypes[process.gags[serverID][userID][loc].gagtype] && process.gagtypes[process.gags[serverID][userID][loc].gagtype].onUnlock) {
                process.gagtypes[process.gags[serverID][userID][loc].gagtype].onUnlock({ serverID: serverID, userID: userID });
            }
			process.gags[serverID][userID].splice(loc, 1);
		}
		if (process.gags[serverID][userID].length == 0) {
			delete process.gags[serverID][userID];
		}
	}
	markForSave("gags");
};

exports.deleteGag = deleteGag;
exports.removeGag = deleteGag;