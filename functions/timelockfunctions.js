const { messageSendChannel } = require("./messagefunctions.js");
const { getTextGeneric } = require("./textfunctions.js");
const { removeChastity } = require("./setters/chastity/removeChastity.js");
const { removeChastityBra } = require("./setters/chastity/removeChastityBra.js");
const { getPronouns } = require("./getters/config/getPronouns.js");
const { removeCollar } = require("./setters/collar/removeCollar.js");
const { getCollarKeys } = require("./getters/collar/getCollarKeys.js");
const { getChastityKeys } = require("./getters/chastity/getChastityKeys.js");
const { getChastityBraKeys } = require("./getters/chastity/getChastityBraKeys.js");
const { getOption } = require("./getters/config/getOption.js");
const { transferCollarKey } = require("./setters/collar/transferCollarKey.js");
const { transferChastityKey } = require("./setters/chastity/transferChastityKey.js");
const { transferChastityBraKey } = require("./setters/chastity/transferChastityBraKey.js");
const { markForSave } = require("./other/markForSave.js");
const { traceFirstParam } = require("./other/TESTS/traceFirstParam.js");
const { getChastity } = require("./getters/chastity/getChastity.js");
const { getChastityBra } = require("./getters/chastity/getChastityBra.js");
const { getCollar } = require("./getters/collar/getCollar.js");
const { getRecentChannel } = require("./getters/config/getRecentChannel.js");
const { rollGagbotKeyAction } = require("./timebased/rollGagbotKeyAction.js");
const { deleteHeldKeyTimers } = require("./setters/config/deleteHeldKeyTimers.js");
const { getRestraintByUUID } = require("./getters/lock/getRestraintByUUID.js");
const { getItemType } = require("./getters/config/getItemType.js");
const { getGags } = require("./getters/gag/getGags.js");
const { getHeadwear } = require("./getters/headwear/getHeadwear.js");
const { getMitten } = require("./getters/mitten/getMitten.js");
const { getHeavyList } = require("./getters/heavy/getHeavyList.js");
const { getToys } = require("./getters/toy/getToys.js");
const { getCorset } = require("./getters/corset/getCorset.js");

// returns whether the locking was successful
function timelockChastity(serverID, client, wearer, keyholder, unlockTime, access, keyholderAfter, webhookchannel) {
    traceFirstParam(arguments[0]);
	const now = Date.now();
	if (now >= unlockTime) return false;
	if (process.chastity == undefined) process.chastity = {};
    if (process.chastity[serverID] == undefined) process.chastity[serverID] = {};
	const chastity = getChastity(serverID, wearer);
	chastity.keyholder = keyholder;
	if (!chastity) return false;
	if (chastity.keyholder == wearer) {
		chastity.keyholder = null;
		chastity.keyholderAfter = keyholderAfter ? wearer : null;
		chastity.webhookchannel = webhookchannel;
	} else chastity.keyholderAfter = [null, wearer, chastity.keyholder][keyholderAfter];
	if (access == 2) chastity.keyholder = null;
	chastity.unlockTime = unlockTime;
	chastity.access = access;
	console.log(`timelock set to unlock in ${unlockTime - now} ms`);
	/*setTimeout(() => {
		unlockTimelockChastity(serverID, client, wearer);
	}, unlockTime - now);*/
    markForSave("chastity");
	return true;
}

// returns whether the unlocking was successful
function unlockTimelockChastity(serverID, client, wearer, skipWrite = false) {
    traceFirstParam(arguments[0]);
	if (process.chastity == undefined) process.chastity = {};
    if (process.chastity[serverID] == undefined) process.chastity[serverID] = {};
	const chastity = getChastity(serverID, wearer);
	if (!chastity || !chastity.unlockTime) return false;
	chastity.keyholder = chastity.keyholderAfter;
	chastity.keyholderAfter = null;
	chastity.unlockTime = null;
	chastity.access = null;
	sendTimelockChastityUnlockMessage(serverID, client, wearer, chastity.keyholder);
	if (!chastity.keyholder) removeChastity(serverID, wearer, undefined, true);
	else if (!skipWrite) {
		markForSave("chastity");
	}
	return true;
}

async function sendTimelockChastityUnlockMessage(serverID, client, wearer, keyholder) {
    traceFirstParam(arguments[0]);
	if (getRecentChannel(serverID, wearer).valid) {
		if (!keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity belt unlocks and falls to the floor!`, getRecentChannel(serverID, wearer).channelid);
		} else if (wearer == keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity belt returns to normal with ${getPronouns(serverID, wearer, "object")} holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		} else {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity belt returns to normal with <@${keyholder}> holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		}
	}
    else {
        console.log(`No webhook channel found for ${wearer}.`)
    }
}

// returns whether the locking was successful
function timelockChastityBra(serverID, client, wearer, keyholder, unlockTime, access, keyholderAfter, webhookchannel) {
    traceFirstParam(arguments[0]);
	const now = Date.now();
	if (now >= unlockTime) return false;
	if (process.chastitybra == undefined) process.chastitybra = {};
    if (process.chastitybra[serverID] == undefined) process.chastitybra[serverID] = {};
	const chastitybra = getChastityBra(serverID, wearer)
	chastitybra.keyholder = keyholder;
	if (!chastitybra) return false;
	if (chastitybra.keyholder == wearer) {
		chastitybra.keyholder = null;
		chastitybra.keyholderAfter = keyholderAfter ? wearer : null;
		chastitybra.webhookchannel = webhookchannel;
	} else chastitybra.keyholderAfter = [null, wearer, chastitybra.keyholder][keyholderAfter];
	if (access == 2) chastitybra.keyholder = null;
	chastitybra.unlockTime = unlockTime;
	chastitybra.access = access;
	console.log(`timelock set to unlock in ${unlockTime - now} ms`);
	/*setTimeout(() => {
		unlockTimelockChastityBra(serverID, client, wearer);
	}, unlockTime - now);*/
	markForSave("chastitybra");
	return true;
}

// returns whether the unlocking was successful
function unlockTimelockChastityBra(serverID, client, wearer, skipWrite = false) {
    traceFirstParam(arguments[0]);
	if (process.chastitybra == undefined) process.chastitybra = {};
    if (process.chastitybra[serverID] == undefined) process.chastitybra[serverID] = {};
	const chastitybra = getChastityBra(serverID, wearer)
	if (!chastitybra || !chastitybra.unlockTime) return false;
	chastitybra.keyholder = chastitybra.keyholderAfter;
	chastitybra.keyholderAfter = null;
	chastitybra.unlockTime = null;
	chastitybra.access = null;
	sendTimelockChastityBraUnlockMessage(serverID, client, wearer, chastitybra.keyholder);
	if (!chastitybra.keyholder) removeChastityBra(serverID, wearer, undefined, true);
	else if (!skipWrite) {
		markForSave("chastitybra");
	}
	return true;
}

async function sendTimelockChastityBraUnlockMessage(serverID, client, wearer, keyholder) {
    traceFirstParam(arguments[0]);
	if (getRecentChannel(serverID, wearer).valid) {
		if (!keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity bra unlocks and falls to the floor!`, getRecentChannel(serverID, wearer).channelid);
		} else if (wearer == keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity bra returns to normal with ${getPronouns(serverID, wearer, "object")} holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		} else {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s chastity bra returns to normal with <@${keyholder}> holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		}
	}
    else {
        console.log(`No webhook channel found for ${wearer}.`)
    }
}

// returns whether the locking was successful
function timelockCollar(serverID, client, wearer, keyholder, unlockTime, access, keyholderAfter, webhookchannel) {
    traceFirstParam(arguments[0]);
	const now = Date.now();
	if (now >= unlockTime) return false;
	if (process.collar == undefined) process.collar = {};
    if (process.collar[serverID] == undefined) process.collar[serverID] = {};
	const collar = getCollar(serverID, wearer);
	collar.keyholder = keyholder;
	if (!collar) return false;
	if (collar.keyholder == wearer) {
		collar.keyholder = null;
		collar.keyholderAfter = keyholderAfter ? wearer : null;
		collar.webhookchannel = webhookchannel;
	} else collar.keyholderAfter = [null, wearer, collar.keyholder][keyholderAfter];
	if (access == 2) collar.keyholder = null;
	collar.unlockTime = unlockTime;
	collar.access = access;
	console.log(`timelock set to unlock in ${unlockTime - now} ms`);
	/*setTimeout(() => {
		unlockTimelockCollar(serverID, client, wearer);
	}, unlockTime - now);*/
	markForSave("collar");
	return true;
}

// returns whether the unlocking was successful
function unlockTimelockCollar(serverID, client, wearer, skipWrite = false) {
    traceFirstParam(arguments[0]);
	if (process.collar == undefined) process.collar = {};
    if (process.collar[serverID] == undefined) process.collar[serverID] = {};
	const collar = getCollar(serverID, wearer);
	if (!collar || !collar.unlockTime) return false;
	collar.keyholder = collar.keyholderAfter;
	collar.keyholderAfter = null;
	collar.unlockTime = null;
	collar.access = null;
	sendTimelockCollarUnlockMessage(serverID, client, wearer, collar.keyholder);
	if (!collar.keyholder) removeCollar(serverID, wearer);
	else if (!skipWrite) {
		markForSave("collar");
	}
	return true;
}

async function sendTimelockCollarUnlockMessage(serverID, client, wearer, keyholder) {
    traceFirstParam(arguments[0]);
	if (getRecentChannel(serverID, wearer).valid) {
		if (!keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s collar unlocks and falls to the floor!`, getRecentChannel(serverID, wearer).channelid);
		} else if (wearer == keyholder) {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s collar returns to normal with ${getPronouns(serverID, wearer, "object")} holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		} else {
			messageSendChannel(`As the timer finally expires, <@${wearer}>'s collar returns to normal with <@${keyholder}> holding the keys!`, getRecentChannel(serverID, wearer).channelid);
		}
	}
    else {
        console.log(`No webhook channel found for ${wearer}.`)
    }
}

function checkGagbotKeys() {
    if (process.gags) {
		Object.keys(process.gags).forEach((serverid) => {
			Object.keys(process.gags[serverid]).forEach((userid) => {
                getGags(serverid, userid).forEach((g) => {
                    if (g.lock && (g.lock.keyholderID == process.client.user.id)) {
                        gagbotHeldKeyTime(serverid, userid, g.lock.uuid);
                    }
                });
		    });
        });
	}
	// Headwear
	if (process.headwear) {
		Object.keys(process.headwear).forEach((serverid) => {
            Object.keys(process.headwear[serverid]).forEach((userid) => {
                getHeadwear(serverid, userid).forEach((h) => {
                    if (h.lock && (h.lock.keyholderID == process.client.user.id)) {
                        gagbotHeldKeyTime(serverid, userid, h.lock.uuid);
                    }
                });
            });
		});
	}
	// Mittens
	if (process.mitten) {
		Object.keys(process.mitten).forEach((serverid) => {
            Object.keys(process.mitten[serverid]).forEach((userid) => {
                if (getMitten(serverid, userid)) {
                    if (getMitten(serverid, userid).lock && (getMitten(serverid, userid).lock.keyholderID == process.client.user.id)) {
                        gagbotHeldKeyTime(serverid, userid, getMitten(serverid, userid).lock.uuid);
                    }
                }
            });
		});
	}
	// Heavy Bondage
	if (process.heavy) {
		Object.keys(process.heavy).forEach((serverid) => {
            Object.keys(process.heavy[serverid]).forEach((userid) => {
                if (getHeavyList(serverid, userid).length > 0) {
                    getHeavyList(serverid, userid).forEach((h) => {
                        if (h.lock && (h.lock.keyholderID == process.client.user.id)) {
                            gagbotHeldKeyTime(serverid, userid, h.lock.uuid);
                        }
                    })
                }
            });
        });
	}
    // Chastity Belts
	if (process.chastity) {
		Object.keys(process.chastity).forEach((serverid) => {
            Object.keys(process.chastity[serverid]).forEach((userid) => {
                if (getChastity(serverid, userid)) {
                    if (getChastity(serverid, userid).lock && (getChastity(serverid, userid).lock.keyholderID == process.client.user.id)) {
                        gagbotHeldKeyTime(serverid, userid, getChastity(serverid, userid).lock.uuid);
                    }
                }
            });
        });
	}
    // Chastity Bras
	if (process.chastitybra) {
		Object.keys(process.chastitybra).forEach((serverid) => {
            Object.keys(process.chastitybra[serverid]).forEach((userid) => {
                if (getChastityBra(serverid, userid)) {
                    if (getChastityBra(serverid, userid).lock && (getChastityBra(serverid, userid).lock.keyholderID == process.client.user.id)) {
                        gagbotHeldKeyTime(serverid, userid, getChastityBra(serverid, userid).lock.uuid);
                    }
                }
            });
        });
	}
	// Wearables
	/*if (process.wearable) {
		Object.keys(process.wearable).forEach((serverid) => {
            Object.keys(process.wearable[serverid]).forEach((userid) => {
                getWearable(serverid, userid).forEach((h) => {
                    if (process.eventfunctions.wearable && process.eventfunctions.wearable[h] && process.eventfunctions.wearable[h].tick) {
                        process.eventfunctions.wearable[h].tick(serverid, userid);
                    }
                });
            });
        });
	}*/
    // Toys
    if (process.toys) {
		Object.keys(process.toys).forEach((serverid) => {
            Object.keys(process.toys[serverid]).forEach((userid) => {
                getToys(serverid, userid).forEach((h) => {
                    if (h.lock && (h.lock.keyholderID == process.client.user.id)) {
                        gagbotHeldKeyTime(serverid, userid, h.lock.uuid);
                    }
                });
            });
        });
	}
    // Collars
    if (process.collar) {
		Object.keys(process.collar).forEach((serverid) => {
            Object.keys(process.collar[serverid]).forEach((userid) => {
                if (getCollar(serverid, userid)) {
                    if (getCollar(serverid, userid).lock && (getCollar(serverid, userid).lock.keyholderID == process.client.user.id)) {
                        gagbotHeldKeyTime(serverid, userid, getCollar(serverid, userid).lock.uuid);
                    }
                }
            });
        });
	}
    // Corset
	if (process.corset) {
		Object.keys(process.corset).forEach((serverid) => {
            Object.keys(process.corset[serverid]).forEach((userid) => {
                if (getCorset(serverid, userid)) {
                    if (getCorset(serverid, userid).lock && (getCorset(serverid, userid).lock.keyholderID == process.client.user.id)) {
                        gagbotHeldKeyTime(serverid, userid, getCorset(serverid, userid).lock.uuid);
                    }
                }
            });
		});
	}
    
    if (process.heldkeytimers) {
        Object.keys(process.heldkeytimers).forEach((k) => {
            rollGagbotKeyAction(...k.split("_"));
            gagbotHeldKeyTime(...k.split("_"));
        })
    }
}

function gagbotHeldKeyTime(serverID, wearerid, type) {
    traceFirstParam(arguments[0]);
    if (process.heldkeytimers == undefined) { process.heldkeytimers = {} }
    if (!getRecentChannel(serverID, wearerid).valid) { return }
    if (!process.heldkeytimers[`${serverID}_${wearerid}_${type}`]) {
        let data = {
            serverID: serverID,
            interactionuser: process.client.user,
            targetuser: { id: wearerid },
        }
        messageSendChannel(getTextGeneric("given_key", data), getRecentChannel(serverID, wearerid).channelid)
        let addedtime = generateTimeForGagbotKey(serverID, wearerid); // 40-100% of the time
        process.heldkeytimers[`${serverID}_${wearerid}_${type}`] = {
            releasetime: Date.now() + addedtime
        }
        markForSave("heldkeytimers");
    }
    else {
        let restrainttype = getItemType(getRestraintByUUID(type)?.restraint)
        if (!restrainttype) {
            console.log(process.heldkeytimers);
            delete process.heldkeytimers[`${serverID}_${wearerid}_${type}`]
            markForSave("heldkeytimers");
            return;
        }
        if (restrainttype == "mask") { restrainttype = "headwear" };
        if ((process[restrainttype] && process[restrainttype][serverID] && process[restrainttype][serverID][wearerid] && process[restrainttype][serverID][wearerid]?.lock && (process[restrainttype][serverID][wearerid].lock.keyholderID != process.client.user.id)) || !(process[restrainttype] && process[restrainttype][serverID] && process[restrainttype][serverID][wearerid] && process[restrainttype][serverID][wearerid].lock)) { // Key somehow returned to the wearer, or the device was removed
            deleteHeldKeyTimers(serverID, wearerid, restrainttype);
            return;
        }
        if (process.heldkeytimers[`${serverID}_${wearerid}_${type}`].releasetime < Date.now()) {
            let data = {
                serverID: serverID,
                interactionuser: process.client.user,
                targetuser: { id: wearerid },
            }
            if (process[restrainttype] && process[restrainttype][serverID] && process[restrainttype][serverID][wearerid] && process[restrainttype][serverID][wearerid].lock && process[restrainttype][serverID][wearerid].lock.keyholderID == process.client.user.id) {
                messageSendChannel(getTextGeneric(`return_key_${restrainttype}`, data), getRecentChannel(serverID, wearerid).channelid)
                getRestraintByUUID(type).restraint.lock.keyholderID = wearerid;
                markForSave(restrainttype);
            }
            delete process.heldkeytimers[`${serverID}_${wearerid}_${type}`]
            markForSave("heldkeytimers");
        }
    }
}

/**********
 * Generates a random time for Gagbot to hold a key, based on the users gagbotholdtimer option.
 * This is a random time between 40% and 100% and shouldn't prefer the 40% like the old approach did.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) wearer - The user id of the person wearing the locked device
 * ---
 * ##### Return the time in milliseconds that Gagbot should hold onto the key.
 **********/
function generateTimeForGagbotKey(serverID, wearerid){
	traceFirstParam(arguments[0]);
	let maxTime = getOption(serverID, wearerid, "gagbotholdtimer");
	let randomFactor = Math.random() * 0.6 + 0.4; // Random factor between 0.4 and 1. Does not prefer 0.4 like the old approach did.
	let addedtime = Math.floor(maxTime * randomFactor);
	return addedtime;
}

exports.timelockChastity = timelockChastity;
exports.unlockTimelockChastity = unlockTimelockChastity;

exports.timelockChastityBra = timelockChastityBra;
exports.unlockTimelockChastityBra = unlockTimelockChastityBra;

exports.timelockCollar = timelockCollar;
exports.unlockTimelockCollar = unlockTimelockCollar;

exports.checkGagbotKeys = checkGagbotKeys;