const { canRemoveLock } = require("./canRemoveLock");
const { getBaseLock } = require("./getBaseLock");
const { getItemType } = require("../config/getItemType");

/**********
 * Given a UUID, gives a status on what applyLockAwaiting would return without any changes.
 * 
 * - (string) uuid - The awaiting lock we want to start!
 * ---
 * ##### Returns: 
 * - "NoRestraint" - There was no restraint worn at the time the lock was engaged
 * - "NoAccess" - The lock was attempted to apply to a restraint that already has a lock and the interaction user does not have unlock access.
 * - "Success" - The lock was applied successfully.
 **********/
function checkLockAwaiting(uuid) {
    if (process.awaitinglock && process.awaitinglock[uuid]) {
        let lock = process.awaitinglock[uuid];
        if (!lock.restraintobject) {
            // The restraint was removed at some point...
            return "NoRestraint";
        }
        if (lock.restraintobject.lock) {
            // The restraint already has a lock on it! Only allow this if the interaction user ID matches the unlock condition of the existing lock. 
            if (lock.interaction && lock.interaction.user.id && canRemoveLock(lock.serverID, lock.userID, lock.interaction.user.id, lock.restraintobject.lock.uuid)) {
                // There was a valid interaction *and* we pass the unlock condition. Remove the lock there first. 
                return "Success"
            }
            return "NoAccess"
        }
        else {
            return "Success"
        }
    }
    return "NoRestraint";
}

exports.checkLockAwaiting = checkLockAwaiting;