/*******
 * Given an interaction and lock details, sends a message toast with the user applying a lock to a restraint. 
 * 
 * - (object) data_in - Object containing serverID, userID, actiontype, actionuser, lockobject 
 *******/
function sendLockToast(data_in) {
    let data = {
        textarray: "texts_lock",
        textdata: {
            serverID: data_in.serverID,
            interactionuser: data_in.actionuser ? { id: data_in.actionuser } : { id: data_in.userID }

        }
    }
}