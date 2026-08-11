const { getItemType } = require("../../functions/getters/config/getItemType");
const { getRestraintByUUID } = require("../../functions/getters/lock/getRestraintByUUID");
const { markForSave } = require("../../functions/other/markForSave");
const { sendLockToast } = require("../../functions/setters/lock/sendLockToast");
const { updateLockAwaiting } = require("../../functions/setters/lock/updateLockAwaiting");

// Increment the orgasm counter on the lock, removing if it matches or exceeds it.
exports.onOrgasm = async function(uuid, data) {
    if (getRestraintByUUID(uuid) && getRestraintByUUID(uuid)?.restraint?.lock && getRestraintByUUID(uuid)?.restraint?.lock?.orgasmMax) {
        let restraint = getRestraintByUUID(uuid).restraint
        let currorgasms = parseInt(restraint.lock.currorgasms ?? 0);
        currorgasms++;
        restraint.lock.currorgasms = currorgasms;

        if (restraint.lock.currorgasms >= restraint.lock.orgasmMax) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds to queue it properly
            sendLockToast({ 
                serverID: restraint.lock.serverID, 
                userID: restraint.lock.userID, 
                actionuser: restraint.lock.userID, 
                actiontype: "unlock", 
                locktype: "orgasmlock", 
                restraintname: restraint.lock.restraintname, 
                restrainttype: getItemType(restraint), 
                targettype: "self" 
            })
            
            delete restraint.lock;
        }

        markForSave(getItemType(restraint))
    }
}