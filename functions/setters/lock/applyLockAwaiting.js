const { removeLockAwaiting } = require("./removeLockAwaiting");
const { canRemoveLock } = require("./../../getters/lock/canRemoveLock");
const { removeLock } = require("./removeLock");
const { getBaseLock } = require("../../getters/lock/getBaseLock");
const { markForSave } = require("../../other/markForSave");
const { getItemType } = require("../../getters/config/getItemType");

/**********
 * Given a UUID, applies the lock to the restraint object. 
 * 
 * - (string) uuid - The awaiting lock we want to start!
 * ---
 * ##### Returns: 
 * - "NoRestraint" - There was no restraint worn at the time the lock was engaged
 * - "NoAccess" - The lock was attempted to apply to a restraint that already has a lock and the interaction user does not have unlock access.
 * - "Success" - The lock was applied successfully.
 **********/
function applyLockAwaiting(uuid) {
    if (process.awaitinglock && process.awaitinglock[uuid]) {
        markForSave("awaitinglock")
        let lock = process.awaitinglock[uuid];
        if (!lock.restraintobject) {
            // The restraint was removed at some point...
            removeLockAwaiting(uuid)
            return "NoRestraint";
        }
        if (lock.restraintobject.lock) {
            // The restraint already has a lock on it! Only allow this if the interaction user ID matches the unlock condition of the existing lock. 
            if (lock.interaction && lock.interaction.user.id && canRemoveLock(lock.serverID, lock.userID, lock.interaction.user.id, lock.restraintobject.lock.uuid)) {
                // There was a valid interaction *and* we pass the unlock condition. Remove the lock there first. 
                removeLock(lock.restraintobject.lock.uuid);

                lock.restraintobject.lock = structuredClone(lock); // Amusingly this creates a circular reference lol
                lock.restraintobject.lock.uuid = uuid;
                delete lock.restraintobject.lock.restraintobject;
                let baselock = getBaseLock(lock.locktype);
                baselock.onLock({ serverID: lock.serverID, userID: lock.userID, keyholderID: lock.keyholderID, uuid: uuid })

                removeLockAwaiting(uuid)
                markForSave(getItemType(lock.restraintobject))
                return "Success"
            }
            removeLockAwaiting(uuid)
            return "NoAccess"
        }
        else {
            lock.restraintobject.lock = structuredClone(lock); // Amusingly this creates a circular reference lol
            lock.restraintobject.lock.uuid = uuid;
            delete lock.restraintobject.lock.restraintobject;
            let baselock = getBaseLock(lock.locktype);
            baselock.onLock({ serverID: lock.serverID, userID: lock.userID, keyholderID: lock.keyholderID, uuid: uuid })

            removeLockAwaiting(uuid)
            markForSave(getItemType(lock.restraintobject))
            return "Success"
        }
    }
    return "NoRestraint";
}

exports.applyLockAwaiting = applyLockAwaiting;