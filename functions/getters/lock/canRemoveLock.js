const { getHeavyBound } = require("../heavy/getHeavyBound");
const { getBaseLock } = require("./getBaseLock");
const { getRestraintByUUID } = require("./getRestraintByUUID");

/**********
 * Can the user remove this kind of lock on the target. This is used for initial checks, not the permission check before removing it. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person who is locked
 * - (user id) keyholderID - The person removing the lock
 * - (string) uuid - The uuid of lock we're trying to remove
 * ---
 * ##### Returns true if allowed to place the lock. 
 **********/
function canRemoveLock(serverID, userID, keyholderID, uuid) {
    let restraintlock = getRestraintByUUID(uuid)?.restraint?.lock;
    if (!restraintlock) { 
        console.log(`Invalid restraint uuid attempted in canRemoveLock: ${uuid}`)
        return false 
    } 
    let lock = getBaseLock(restraintlock.locktype)
    if (!lock) { 
        console.log(`Invalid lock type attempted in canRemoveLock: ${restraintlock.locktype}`)
        return false 
    } 
    if (getHeavyBound(serverID, keyholderID, userID)) {
        return lock.canUnlock({ serverID: serverID, userID: userID, keyholderID: keyholderID, uuid: uuid })
    }
}

exports.canRemoveLock = canRemoveLock;