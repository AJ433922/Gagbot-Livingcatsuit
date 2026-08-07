const { getHeavyBound } = require("../heavy/getHeavyBound");
const { getBaseLock } = require("./getBaseLock");
const { getRestraintByUUID } = require("./getRestraintByUUID");

/**********
 * Can the user access the restraint under this lock. This would not be for removal. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The person who is locked
 * - (user id) keyholderID - The person accessing the lock
 * - (string) uuid - The uuid of lock we're trying to access
 * ---
 * ##### Returns true if allowed to access the restraint under the lock. 
 **********/
function canAccessLock(serverID, userID, keyholderID, uuid) {
    let restraintlock = getRestraintByUUID(uuid)?.restraint?.lock;
    if (!restraintlock) { 
        console.log(`Invalid restraint uuid attempted in canAccessLock: ${uuid}`)
        return false 
    } 
    let lock = getBaseLock(restraintlock.locktype)
    if (!lock) { 
        console.log(`Invalid lock type attempted in canAccessLock: ${restraintlock.locktype}`)
        return false 
    } 
    if (getHeavyBound(serverID, keyholderID, userID)) {
        return lock.canAccessLock({ serverID: serverID, userID: userID, keyholderID: keyholderID, uuid: uuid })
    }
}

exports.canAccessLock = canAccessLock;