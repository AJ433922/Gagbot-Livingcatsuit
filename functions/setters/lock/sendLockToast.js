const { getRecentChannel } = require("../../getters/config/getRecentChannel");
const { getText } = require("../../textfunctions");
const { getItemName } = require("./../../getters/config/getItemName");
const { messageSendChannel } = require("./../../messagefunctions");

/*******
 * Given an interaction and lock details, sends a message toast with the user applying a lock to a restraint. 
 * 
 * - (object) data_in - Object containing serverID, userID, actiontype, actionuser, restraintname, restrainttype
 *******/
function sendLockToast(data_in) {
    let data = {
        textarray: "texts_lock",
        textdata: {
            serverID: data_in.serverID,
            interactionuser: data_in.actionuser ? { id: data_in.actionuser } : { id: data_in.userID },
            targetuser: { id: data_in.userID },
            c1: data_in.restraintname,
            c2: data_in.restrainttype
        }
    }
    // Type of action we're doing
    if (data_in.actiontype) {
        data[data_in.actiontype] = true
    }
    // Type of lock we're applying
    if (data_in.locktype) {
        data[data_in.locktype] = true
    }
    // Are we receiving the lock or someone else?
    if (data_in.targettype) {
        data[data_in.targettype] = true
    }
    // Any further data that needs to be added
    if (Array.isArray(data_in.further)) {
        data_in.further.forEach((t) => {
            data[t] = true;
        })
    }
    // Any further textkeys that need to be appended 
    if (Array.isArray(data_in.extratext)) {
        for (let i = 0; i < (data_in.extratex.length); i++) {
            data.textdata[`c${i + 3}`] = data_in.extratex[i];
        }
    }
    messageSendChannel(getText(data), getRecentChannel(data_in.serverID, data_in.actionuser ?? data_in.userID).interactionchannelid);
}

exports.sendLockToast = sendLockToast;