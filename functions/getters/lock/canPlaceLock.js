const { getOption } = require("../config/getOption");
const { getHeavyBound } = require("../heavy/getHeavyBound");
const { getBaseLock } = require("./getBaseLock");

/**********
 * Can the user place this kind of lock on the target. This is used for initial checks, not the permission check before placing it. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person receiving the lock
 * - (user id) keyholderID - The person adding the lock
 * - (string) locktype - The type of lock we're trying to add
 * ---
 * ##### Returns true if allowed to place the lock. 
 **********/
function canPlaceLock(serverID, userID, keyholderID, locktype) {
    let lock = getBaseLock(locktype);
    if (!lock) { 
        console.log(`Invalid lock type attempted in canPlaceLock: ${locktype}`)
        return false 
    } 
    if (getHeavyBound(serverID, keyholderID, userID) && (getOption(serverID, userID, "receivelocks") != "selfonly")) {
        return lock.canAddLock({ serverID: serverID, userID: userID, keyholderID: keyholderID })
    }
}

exports.canPlaceLock = canPlaceLock;