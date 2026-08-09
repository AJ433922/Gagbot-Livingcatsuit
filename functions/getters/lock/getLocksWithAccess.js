const { getChastity } = require("../chastity/getChastity");
const { getChastityBra } = require("../chastity/getChastityBra");
const { getCollar } = require("../collar/getCollar");
const { getGags } = require("../gag/getGags");
const { getHeadwear } = require("../headwear/getHeadwear");
const { getHeavyList } = require("../heavy/getHeavyList");
const { getMitten } = require("../mitten/getMitten");
const { getToys } = require("../toy/getToys");
const { getBaseLock } = require("./getBaseLock");

/*******
 * Retrieves all restraints for which the user has access/___ permissions for
 * 
 * - (server id) serverID - The server this is for
 * - (user id) userID - The user retrieving the locked items
 * - (string) accesstype - If specified, then checks "can___" of each lock for this. Common ones will include "Unlock" and "CloneKeys". If not specified, uses canAccessLock.
 * ---
 * ##### Returns an array of objects which match the can___ condition with the following props:
 * - (user id) userID: The person who is wearing the restraint
 * - (object) restraint: The restraint of the user
 * - (string) type: The Type of item. Can be the following: Gag, Mask, Mitten, Heavy, Chastity, Chastity Bra, Toy, Collar
 *******/
function getLocksWithAccess(serverID, userID, accesstype = "AccessLock") {
    let lockswithaccess = [];
    if (process.gags) {
        Object.keys(process.gags[serverID]).forEach((wearerID) => {
            getGags(serverID, wearerID).forEach((g) => {
                if (g.lock && getBaseLock(g.lock.locktype) && getBaseLock(g.lock.locktype)[`can${accesstype}`] && getBaseLock(g.lock.locktype)[`can${accesstype}`]({ uuid: g.lock.uuid, userID: userID })) {
                    lockswithaccess.push({
                        userID: wearerID,
                        restraint: g,
                        type: "Gag"
                    })
                }
            });
        });
	}
	// Headwear
	if (process.headwear) {
        Object.keys(process.headwear[serverID]).forEach((wearerID) => {
            getHeadwear(serverID, wearerID).forEach((h) => {
                if (h.lock && getBaseLock(h.lock.locktype) && getBaseLock(h.lock.locktype)[`can${accesstype}`] && getBaseLock(h.lock.locktype)[`can${accesstype}`]({ uuid: h.lock.uuid, userID: userID })) {
                    lockswithaccess.push({
                        userID: wearerID,
                        restraint: h,
                        type: "Mask"
                    })
                }
            });
        });
	}
	// Mittens
	if (process.mitten) {
        Object.keys(process.mitten[serverID]).forEach((wearerID) => {
            if (getMitten(serverID, wearerID)) {
                let h = getMitten(serverID, wearerID);
                if (h.lock && getBaseLock(h.lock.locktype) && getBaseLock(h.lock.locktype)[`can${accesstype}`] && getBaseLock(h.lock.locktype)[`can${accesstype}`]({ uuid: h.lock.uuid, userID: userID })) {
                    lockswithaccess.push({
                        userID: wearerID,
                        restraint: h,
                        type: "Mitten"
                    })
                }
            }
        });
	}
	// Heavy Bondage
	if (process.heavy) {
        Object.keys(process.heavy[serverID]).forEach((wearerID) => {
            if (getHeavyList(serverID, wearerID).length > 0) {
                getHeavyList(serverID, wearerID).forEach((h) => {
                    if (h.lock && getBaseLock(h.lock.locktype) && getBaseLock(h.lock.locktype)[`can${accesstype}`] && getBaseLock(h.lock.locktype)[`can${accesstype}`]({ uuid: h.lock.uuid, userID: userID })) {
                        lockswithaccess.push({
                            userID: wearerID,
                            restraint: h,
                            type: "Heavy"
                        })
                    }
                })
            }
        });
	}
    // Chastity Belts
	if (process.chastity) {
        Object.keys(process.chastity[serverID]).forEach((wearerID) => {
            if (getChastity(serverID, wearerID)) {
                let h = getChastity(serverID, wearerID);
                if (h.lock && getBaseLock(h.lock.locktype) && getBaseLock(h.lock.locktype)[`can${accesstype}`] && getBaseLock(h.lock.locktype)[`can${accesstype}`]({ uuid: h.lock.uuid, userID: userID })) {
                    lockswithaccess.push({
                        userID: wearerID,
                        restraint: h,
                        type: "Chastity"
                    })
                }
            }
        });
	}
    // Chastity Bras
	if (process.chastitybra) {
        Object.keys(process.chastitybra[serverID]).forEach((wearerID) => {
            if (getChastityBra(serverID, wearerID)) {
                let h = getChastityBra(serverID, wearerID);
                if (h.lock && getBaseLock(h.lock.locktype) && getBaseLock(h.lock.locktype)[`can${accesstype}`] && getBaseLock(h.lock.locktype)[`can${accesstype}`]({ uuid: h.lock.uuid, userID: userID })) {
                    lockswithaccess.push({
                        userID: wearerID,
                        restraint: h,
                        type: "Chastity Bra"
                    })
                }
            }
        });
	}
	// Wearables
	/*if (process.wearable) {
        Object.keys(process.wearable[serverID]).forEach((wearerID) => {
            getWearable(serverID, wearerID).forEach((h) => {
                if (process.eventfunctions.wearable && process.eventfunctions.wearable[h] && process.eventfunctions.wearable[h].tick) {
                    process.eventfunctions.wearable[h].tick(serverID, wearerID);
                }
            });
        });
	}*/
    // Toys
    if (process.toys) {
            Object.keys(process.toys[serverID]).forEach((wearerID) => {
                getToys(serverID, wearerID).forEach((h) => {
                    if (h.lock && getBaseLock(h.lock.locktype) && getBaseLock(h.lock.locktype)[`can${accesstype}`] && getBaseLock(h.lock.locktype)[`can${accesstype}`]({ uuid: h.lock.uuid, userID: userID })) {
                        lockswithaccess.push({
                            userID: wearerID,
                            restraint: h,
                            type: "Toy"
                        })
                    }
                });
            });
	}
    // Collars
    if (process.collar) {
        Object.keys(process.collar[serverID]).forEach((wearerID) => {
            if (getCollar(serverID, wearerID)) {
                let h = getCollar(serverID, wearerID);
                if (h.lock && getBaseLock(h.lock.locktype) && getBaseLock(h.lock.locktype)[`can${accesstype}`] && getBaseLock(h.lock.locktype)[`can${accesstype}`]({ uuid: h.lock.uuid, userID: userID })) {
                    lockswithaccess.push({
                        userID: wearerID,
                        restraint: h,
                        type: "Collar"
                    })
                }
            }
        });
	}

    return lockswithaccess;
}

exports.getLocksWithAccess = getLocksWithAccess;