/***********
 * Removes a, or all held key timers for a user's restraint.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is for
 * - (string) restraint? - If specified, removes a specific restraint. Otherwise, removes all of them
 * ---
 * ##### *No return value*
 ***********/
function deleteHeldKeyTimers(serverID, userID, uuid) {
    if (process.heldkeytimers) {
        delete process.heldkeytimers[`${serverID}_${userID}_${uuid}`]
    }
    else {
        Object.keys(process.heldkeytimers).forEach((k) => {
            if (k.startsWith(`${serverID}_${userID}`)) {
                delete process.heldkeytimers[k];
            }
        })
    }
}

exports.deleteHeldKeyTimers = deleteHeldKeyTimers;