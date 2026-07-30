const { canPlaceLock } = require("../functions/getters/lock/canPlaceLock");
const { userIsWearingItem } = require("../functions/getters/config/userIsWearingItem");
const { createLockAwaiting } = require("../functions/setters/lock/createLockAwaiting");
const { MessageFlags } = require("discord.js");
const { getBaseLock } = require("./getters/lock/getBaseLock");
const { getBaseItem } = require("./getters/config/getBaseItem");
const path = require("path");
const fs = require("fs");

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
    let locktype = interaction.options.getString("locktype");
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
    let uuid = createLockAwaiting(interaction.guildId, locktarget.id, interaction.user.id, locktype);

    if (!uuid) {
        interaction.editReply({ content: `Something went wrong creating the lock.`, flags: MessageFlags.Ephemeral })
        return;
    }

    baselocktype.lockinteraction(interaction, { uuid: uuid })
} 

exports.setUpLocks = setUpLocks;
exports.addLockModal = addLockModal;