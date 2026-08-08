const { canPlaceLock } = require("../functions/getters/lock/canPlaceLock");
const { canRemoveLock } = require("../functions/getters/lock/canRemoveLock");
const { userIsWearingItem } = require("../functions/getters/config/userIsWearingItem");
const { createLockAwaiting } = require("../functions/setters/lock/createLockAwaiting");
const { MessageFlags } = require("discord.js");
const { getBaseLock } = require("./getters/lock/getBaseLock");
const { getBaseItem } = require("./getters/config/getBaseItem");
const { getUserWornRestraint } = require("./getters/config/getUserWornRestraint");
const path = require("path");
const fs = require("fs");
const { getItemType } = require("./getters/config/getItemType");
const { getItemName } = require("./getters/config/getItemName");
const { removeLock } = require("./setters/lock/removeLock");

// Imports each lock in ./locks and makes them accessible as objects
// in process.locktypes mapped to their respective ids.
// chastities are constructed as default -> lock, overwriting in that order.
function setUpLocks() {
    let lockfunctionsroot = path.join(__dirname, "..", "locks");
	let newlockref = require(`${lockfunctionsroot}/defaultlock.js`);
	let locktypes = fs.readdirSync(lockfunctionsroot);
	locktypes.forEach((foldertype) => {
		if (foldertype != "defaultlock.js") {
			let newlock = new newlockref.Lock(); // Instantiate a copy of the lock object.
			let specificlock = require(`${lockfunctionsroot}/${foldertype}`);
			let specificlockoverrides = Object.keys(specificlock);
			specificlockoverrides.forEach((specificover) => {
				newlock[specificover] = specificlock[specificover];
			});
			if (process.locktypes == undefined) {
				process.locktypes = {};
			}
			// Push to locktypes for reference by lock functions
			process.locktypes[foldertype.replace(".js", "")] = newlock;
            process.locktypes[foldertype.replace(".js", "")].value = foldertype.replace(".js", "");
            
			if (process.autocompletes == undefined) {
				process.autocompletes = {};
			}
			if (process.autocompletes.lock == undefined) {
				process.autocompletes.lock = [];
			}
			process.autocompletes.lock.push({ name: newlock.name, value: foldertype.replace(".js", "") });
		}
	});
}

/*****
 * I want to move these to a dedicated folder for all modal type interactions. 
 *****/

/*****
 * Provides a modal for the user based on the individual lock configuration for a restraint target. Interactions being brought into this should already have an interaction.deferReply(). 
 * 
 * - (interaction) interaction - An Interaction as piped from a /lock command
 * ---
 * ##### Returns an interaction end state
 *****/
function addLockModal(interaction) {
    let locktarget = interaction.options.getUser("user") ?? interaction.user;
    let itemtolock = interaction.options.getString("restraint");
    if (itemtolock == null) {
        interaction.editReply({ content: `Please select an item to lock!` })
        return;
    }
    let locktype = interaction.options.getString("locktype");
    if (itemtolock && !locktype) {
        // Try to decide the default. Simplepadlock for large, 5 minute timer for any others. If the item just can't be locked, oh well. 
        locktype = "simplepadlock";
        if (!getBaseItem(itemtolock).locktypes.includes(getBaseLock(locktype).locktype)) {
            locktype = "fiveminutelock"
        }
    }
    let baselocktype = getBaseLock(locktype);
    // If the user isn't wearing that item or it has a lock or the locker isn't allowed, tell them to leave
    if (!baselocktype) {
        interaction.editReply({ content: `Invalid lock type!`, flags: MessageFlags.Ephemeral })
        return;
    }
    if (!userIsWearingItem(interaction.guildId, locktarget.id, itemtolock)) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `You aren't wearing that item!`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `${locktarget} isn't wearing that item!`, flags: MessageFlags.Ephemeral })
        }
        return;
    }
    if (!canPlaceLock(interaction.guildId, locktarget.id, interaction.user.id, locktype)) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `You are unable to place a ${getBaseLock(locktype).name} on yourself.`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `You are unable to place a ${getBaseLock(locktype).name} on ${locktarget}.`, flags: MessageFlags.Ephemeral })
        }
        return;
    }

    // Check if the restraint target is the right kind for the lock we want to apply. 
    if (!getBaseItem(itemtolock).locktypes.includes(getBaseLock(locktype).locktype)) {
        interaction.editReply({ content: `That is an incorrectly sized lock for that restraint.`, flags: MessageFlags.Ephemeral })
        return;
    }

    // They can probably place the item, so generate a lock interaction and serve the modal. 
    let uuid = createLockAwaiting(interaction.guildId, locktarget.id, interaction.user.id, locktype, getUserWornRestraint(interaction.guildId, locktarget.id, getItemType(itemtolock), itemtolock));

    if (!uuid) {
        interaction.editReply({ content: `Something went wrong creating the lock.`, flags: MessageFlags.Ephemeral })
        return;
    }

    baselocktype.lockinteraction(interaction, { uuid: uuid })
} 

/*****
 * Handles removing a lock from a /unlock command. 
 * 
 * - (interaction) interaction - An Interaction as piped from a /lock command
 * ---
 * ##### Returns an interaction end state
 *****/
function handleRemoveLock(interaction) {
    let locktarget = interaction.options.getUser("user") ?? interaction.user;
    let itemtolock = interaction.options.getString("restraint");
    if (itemtolock == null) {
        interaction.editReply({ content: `Please select an item to remove!` })
        return;
    }
    let locktoremove = getUserWornRestraint(interaction.guildId, locktarget.id, getItemType(itemtolock), itemtolock)
    console.log(locktoremove);
    // If the user isn't wearing that item or it has a lock or the locker isn't allowed, tell them to leave
    if (!locktoremove) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `You aren't wearing a ${getItemName(itemtolock)}!`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `${locktarget} isn't wearing a ${getItemName(itemtolock)}!`, flags: MessageFlags.Ephemeral })
        }
        return;
    }
    if (!locktoremove.lock) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `Your ${getItemName(itemtolock)} isn't locked!`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `${locktarget}'s ${getItemName(itemtolock)} isn't locked!`, flags: MessageFlags.Ephemeral })
        }
        return;
    }
    if (!canRemoveLock(interaction.guildId, locktarget.id, interaction.user.id, locktoremove?.lock?.uuid)) {
        if (locktarget.id == interaction.user.id) {
            interaction.editReply({ content: `You can't remove the ${getBaseLock(locktoremove?.lock?.locktype).name} on your ${getItemName(itemtolock)}.`, flags: MessageFlags.Ephemeral })
        }
        else {
            interaction.editReply({ content: `You can't remove the ${getBaseLock(locktoremove?.lock?.locktype).name} on ${locktarget}'s ${getItemName(itemtolock)}.`, flags: MessageFlags.Ephemeral })
        }
        return;
    }

    removeLock(locktoremove?.lock?.uuid, interaction.user);
} 

exports.setUpLocks = setUpLocks;
exports.addLockModal = addLockModal;
exports.handleRemoveLock = handleRemoveLock;