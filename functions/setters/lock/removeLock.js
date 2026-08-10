const { getItemName } = require("../../getters/config/getItemName");
const { getItemType } = require("../../getters/config/getItemType");
const { getBaseLock } = require("../../getters/lock/getBaseLock");
const { getRestraintByUUID } = require("../../getters/lock/getRestraintByUUID");
const { markForSave } = require("../../other/markForSave");
const { sendLockToast } = require("../../setters/lock/sendLockToast");

/********
 * Removes a lock from it's host restraint, given a UUID
 * 
 * - (string) uuid - The UUID of the lock we're removing
 * ---
 * ##### *No return value*
 ********/
function removeLock(uuid, interactionuser) {
    let restraint = getRestraintByUUID(uuid)?.restraint
    let lock = restraint?.lock;
    if (!lock) { 
        // Invalid UUID
        return 
    }
    let baselock = getBaseLock(lock.locktype);
    baselock.onUnlock({ serverID: lock.serverID, userID: lock.userID, keyholderID: lock.keyholderID, uuid: uuid })

    let targettype = (lock.userID == interactionuser.id) ? "self" : "other"
    sendLockToast({ serverID: lock.serverID, userID: lock.userID, actionuser: interactionuser.id, actiontype: "unlock", locktype: lock.locktype ?? "defaultlock", targettype: targettype, restraintname: getItemName(restraint) })
    
    delete restraint.lock; // Remove the lock after completing the onUnlock function. 
    markForSave(getItemType(restraint))
}

exports.removeLock = removeLock;