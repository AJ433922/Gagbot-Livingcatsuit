const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { config } = require("./../functions/configfunctions.js");
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { generateKeyGivingModal, handleExtremeRestraint } = require("../functions/interactivefunctions.js");
const { getCollar } = require("../functions/getters/collar/getCollar.js");
const { getChastity } = require("../functions/getters/chastity/getChastity.js");
const { getChastityBra } = require("../functions/getters/chastity/getChastityBra.js");
const { canAccessCollar } = require("../functions/getters/collar/canAccessCollar.js");
const { canAccessChastity } = require("../functions/getters/chastity/canAccessChastity.js");
const { canAccessChastityBra } = require("../functions/getters/chastity/canAccessChastityBra.js");
const { getClonedChastityKeysOwned } = require("../functions/getters/chastity/getClonedChastityKeysOwned.js");
const { getClonedChastityBraKeysOwned } = require("../functions/getters/chastity/getClonedChastityBraKeysOwned.js");
const { getClonedCollarKeysOwned } = require("../functions/getters/collar/getClonedCollarKeysOwned.js");
const { getOtherKeysChastity } = require("../functions/getters/chastity/getOtherKeysChastity.js");
const { getOtherKeysChastityBra } = require("../functions/getters/chastity/getOtherKeysChastityBra.js");
const { getOtherKeysCollar } = require("../functions/getters/collar/getOtherKeysCollar.js");
const { getBaseCollar } = require("../functions/getters/collar/getBaseCollar.js");
const { getBaseChastity } = require("../functions/getters/chastity/getBaseChastity.js");
const { getUserTags } = require("../functions/getters/config/getUserTags.js");
const { getCollarName } = require("../functions/getters/collar/getCollarName.js");
const { getOption } = require("../functions/getters/config/getOption.js");
const { cloneCollarKey } = require("../functions/setters/collar/cloneCollarKey.js");
const { cloneChastityKey } = require("../functions/setters/chastity/cloneChastityKey.js");
const { cloneChastityBraKey } = require("../functions/setters/chastity/cloneChastityBraKey.js");
const { promptCloneCollarKey, promptTransferCollarKey } = require("../functions/collarfunctions.js");
const { promptCloneChastityKey, promptCloneChastityBraKey, promptTransferChastityKey, promptTransferChastityBraKey } = require("../functions/vibefunctions.js");
const { getPronouns } = require("../functions/getters/config/getPronouns.js");
const { revokeCollarKey } = require("../functions/setters/collar/revokeCollarKey.js");
const { revokeChastityKey } = require("../functions/setters/chastity/revokeChastityKey.js");
const { revokeChastityBraKey } = require("../functions/setters/chastity/revokeChastityBraKey.js");
const { transferCollarKey } = require("../functions/setters/collar/transferCollarKey.js");
const { transferChastityKey } = require("../functions/setters/chastity/transferChastityKey.js");
const { transferChastityBraKey } = require("../functions/setters/chastity/transferChastityBraKey.js");
const { getChastityName } = require("../functions/getters/chastity/getChastityName.js");
const { getChastityBraName } = require("../functions/getters/chastity/getChastityBraName.js");
const { swapChastity } = require("../functions/setters/chastity/swapChastity.js");
const { swapChastityBra } = require("../functions/setters/chastity/swapChastityBra.js");
const { discardKey } = require("../functions/keyfindingfunctions.js");
const { addAdditionalCollarEffect } = require("../functions/setters/collar/addAdditionalCollarEffect.js");
const { removeAdditionalCollarEffect } = require("../functions/setters/collar/removeAdditionalCollarEffect.js");
const { markForSave } = require("../functions/other/markForSave.js");
const { getLocksWithAccess } = require("../functions/getters/lock/getLocksWithAccess.js");
const { getItemName } = require("../functions/getters/config/getItemName.js");
const { getBaseItem } = require("../functions/getters/config/getBaseItem.js");
const { getItemType } = require("../functions/getters/config/getItemType.js");
const { getRestraintByUUID } = require("../functions/getters/lock/getRestraintByUUID.js");
const { getBaseLock } = require("../functions/getters/lock/getBaseLock.js");
const { promptCloneKey, promptTransferKey } = require("../functions/lockfunctions.js");
const { getHeavyBound } = require("../functions/getters/heavy/getHeavyBound.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("key")
		.setDescription(`Prevent a worn item from being removed...`)
        .addSubcommand((subcommand) =>
			subcommand
				.setName("clone")
				.setDescription("Clone a key you're holding...")
				.addUserOption((opt) => opt.setName("wearer").setDescription("Whose restraint to clone key for?"))
				.addStringOption((opt) => opt.setName("restraint").setDescription("Which restraint of theirs to clone?").setAutocomplete(true))
				.addUserOption((opt) => opt.setName("clonedkeyholder").setDescription("Who to give the copied key to?")),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("revoke")
				.setDescription("Revoke a cloned key")
				.addStringOption((opt) => opt.setName("clones").setDescription("Which key clone to revoke?").setAutocomplete(true)),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("give")
				.setDescription("Give a primary key you're holding...")
				.addUserOption((opt) => opt.setName("wearer").setDescription("Whose restraint to give key for?"))
				.addStringOption((opt) => opt.setName("restraint").setDescription("Which restraint of theirs to give key for?").setAutocomplete(true))
				.addUserOption((opt) => opt.setName("newkeyholder").setDescription("Who to give the key to?")),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("swapitem")
				.setDescription("Swap a worn restraint for another you have the key for...")
				.addUserOption((opt) => opt.setName("wearer").setDescription("Whose restraint to swap an item?"))
				.addStringOption((opt) => opt.setName("restraint").setDescription("Which restraint of theirs to swap?").setAutocomplete(true))
				.addStringOption((opt) => opt.setName("restrainttype").setDescription("What new restraint to put on them?").setAutocomplete(true)),
		)
        /*.addSubcommand((subcommand) =>
			subcommand
				.setName("menu")
				.setDescription("Open key giving and cloning menu")
		)*/
        .addSubcommand((subcommand) =>
            subcommand
                .setName("additionalcollar")
                .setDescription("Manage additional collar effects...")
                .addStringOption((opt) => 
                    opt
                        .setName("type")
                        .setDescription("Add or Remove a collar effect?")
                        .setRequired(true)
                        .addChoices(
                            { name: "Add", value: "additionalcollar_add" },
                            { name: "Remove", value: "additionalcollar_remove" }
                        )
                )
                .addUserOption((opt) => opt.setName("wearer").setDescription("Whose collar to add additional effects to?"))
                .addStringOption((opt) => opt.setName("collareffect").setDescription("Which collar effect to add?").setAutocomplete(true)),
        ),
        /*.addSubcommand((subcommand) => 
            subcommand
                .setName("discard")
                .setDescription("Intentionally lose someone's keys...")
                .addUserOption((opt) => opt.setName("wearer").setDescription(`Whose restraint to "lose" the key for?`))
				.addStringOption((opt) => opt.setName("restraint").setDescription(`Which restraint of theirs to "lose" the key?`).setAutocomplete(true))
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("return")
                .setDescription("Return a key you discovered...")
                .addUserOption((opt) => opt.setName("wearer").setDescription(`Whose restraint to "lose" the key for?`))
				.addStringOption((opt) => opt.setName("restraint").setDescription(`Which restraint of theirs to return the key for?`).setAutocomplete(true))
        ),*/
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		let subcommand = interaction.options.getSubcommand();
		try {
            // region scmd - clone
			if (subcommand == "clone" || subcommand == "give" /*|| subcommand == "discard"*/) {
				// We want to return ONLY options that the user COULD clone a key for
				// So if they own a collar key, it only gives "Collar"
				let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!

				let choices = [];
                getLocksWithAccess(interaction.guildId, interaction.user.id, (subcommand == "clone") ? "CloneKeys" : "Transfer").forEach((la) => {
                    if (la.restraint && la.type && (la.userID == chosenuserid)) {
                        choices.push({ name: `${la.type}: ${getItemName(la.restraint)}`, value: `${subcommand}_${la.restraint.lock.uuid}` })
                    }
                })

                if (choices.length == 0) {
					choices = [{ name: "No Keys Available", value: "nokeys" }];
				}

				await interaction.respond(choices.slice(0,25)); // Frankly, if you can lock more than 25 things on someone, they have too many fucking lockable things. 
			// region scmd - revoke
            } else if (subcommand == "revoke") {
                let choices = [];
                // Get clones we have access to. Each lock has its own canRemoveCloneKeys function, so this will handle if clone propagation allows for this or not. 
                await getLocksWithAccess(interaction.guildId, interaction.user.id, "RemoveCloneKeys").forEach(async (la) => {
                    if (la.restraint && la.type && la.restraint.lock.clonedKeyholders) {
                        la.restraint.lock.clonedKeyholders.forEach(async (k) => {
                            try {
                                await interaction.guild.members.fetch(la.userID);
                            }
                            catch(err) {
                                console.log("Unknown member when fetching " + la.userID)
                            }
                            try {
                                await interaction.guild.members.fetch(k);
                            }
                            catch(err) {
                                console.log("Unknown member when fetching " + k)
                            }
                            if (k != interaction.user.id) {
                                choices.push({ name: `${interaction.guild.members.cache.get(k)?.displayName}'s key to ${interaction.guild.members.cache.get(la.userID)?.displayName}'s ${getItemName(la.restraint)}`, value: `${subcommand}_${la.restraint.lock.uuid}_${k}` })
                            }
                        })
                    }
                })
                // Get keys we are the clone of. 
                await getLocksWithAccess(interaction.guildId, interaction.user.id, "RevokeSelfClone").forEach(async (la) => {
                    if (la.restraint && la.type) {
                        try {
                            await interaction.guild.members.fetch(la.userID);
                        }
                        catch(err) {
                            console.log("Unknown member when fetching " + la.userID)
                        }
                        choices.push({ name: `Your key to ${interaction.guild.members.cache.get(la.userID)?.displayName}'s ${la.type}`, value: `${subcommand}_${la.restraint.lock.uuid}_${interaction.user.id}`})
                    }
                })

				let sorted = [...choices];
				if (sorted.length == 0) {
					sorted = [{ name: "No Eligible Keys To Revoke...", value: "nothing" }];
				}

                let matches = didYouMean(focusedValue, sorted, {
                    matchPath: ['name'], 
                    returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                    threshold: 0.1, // Default is 0.4 - this is how much of the entry must exist
                })
                console.log(matches)
                if (matches.length == 0) {
                    matches = sorted;
                }
				await interaction.respond(matches.slice(0, 25));
			// region scmd - swapitem
            } else if (subcommand == "swapitem") {
				// Note, we only need to know if we can ***unlock*** a restraint to swap it.
                // For now, this will be limited to just the collar and chastity. 
				if (interaction.options.get("restraint")?.focused) {
					// Note, we only need to know if we can ***unlock*** a restraint to swap it.
                    // For now, this will be limited to just the collar and chastity. May explore swapping other types in the future. 
                    let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                    let choices = [];
                    getLocksWithAccess(interaction.guildId, interaction.user.id, "Unlock").forEach((la) => {
                        if (la.restraint && la.type && ["chastity", "chastitybra","collar"].includes(getItemType(la.restraint)) && (la.userID == chosenuserid)) {
                            choices.push({ name: `${la.type}: ${getItemName(la.restraint)}`, value: getItemType(la.restraint)})
                        }
                    })
                    if (getCollar(interaction.guildId, chosenuserid) && !getCollar(interaction.guildId, chosenuserid).lock) {
                        choices.push({ name: `Collar: ${getItemName(getCollar(interaction.guildId, chosenuserid))}`, value: "collar"})
                    }
                    if (getChastity(interaction.guildId, chosenuserid) && !getChastity(interaction.guildId, chosenuserid).lock) {
                        choices.push({ name: `Chastity Belt: ${getItemName(getChastity(interaction.guildId, chosenuserid))}`, value: "chastity"})
                    }
                    if (getChastityBra(interaction.guildId, chosenuserid) && !getChastityBra(interaction.guildId, chosenuserid).lock) {
                        choices.push({ name: `Chastity Bra: ${getItemName(getChastityBra(interaction.guildId, chosenuserid))}`, value: "chastitybra"})
                    }
                    if (choices.length == 0) {
                        choices = [{ name: "No Items to Swap", value: "nothing" }]
                    }

					await interaction.respond(choices);
				} else {
					let chosenrestrainttype = interaction.options.get("restraint")?.value;
                    // If its not the right kind go away. 
                    if (!chosenrestrainttype || !["chastity", "chastitybra","collar"].includes(chosenrestrainttype)) {
                        interaction.respond([{ name: "Nothing", value: "nothing" }]);
                        return;
                    }
                    if (chosenrestrainttype == "chastity") { chosenrestrainttype = "chastitybelt" }
					let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                    let choices = [];
					
                    let matches = didYouMean(focusedValue, process.autocompletes[chosenrestrainttype], {
                        matchPath: ['name'], 
                        returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                        threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
                    })
                    if (matches.length == 0) {
                        matches = process.autocompletes[chosenrestrainttype].slice(0,25);
                    }
                    let tags = getUserTags(interaction.guildId, chosenuserid);
                    let newsorted = [];
                    matches.forEach((f) => {
                        let tagged = false;
                        let i = getBaseItem(f.value)
                        tags.forEach((t) => {
                            if (i && i.tags && (Array.isArray(i.tags)) && i.tags.includes(t)) { tagged = true }
                            else if (i.tags && (i.tags[t])) { tagged = true }
                        })
                        if (!tagged) {
                            newsorted.push(f);
                        }
                    })
                    interaction.respond(newsorted.slice(0,25))
				}
            // region scmd - return
            } /*else if (subcommand == "return") {
                // We need to know if we're holding the primary keys to throw them away. 
                let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                let holdingcollarkey = (getCollar(interaction.guildId, chosenuserid)?.temporarykeyholder == interaction.user.id);
                let holdingchastitykey = (getChastity(interaction.guildId, chosenuserid)?.temporarykeyholder == interaction.user.id)
                let holdingchastitybrakey = (getChastityBra(interaction.guildId, chosenuserid)?.temporarykeyholder == interaction.user.id)

                let choices = [];
                if (!holdingcollarkey && !holdingchastitykey && !holdingchastitybrakey) {
                    choices = [{ name: "Not holding any temporary keys", value: "nokeys" }];
                }
                if (holdingcollarkey) {
                    choices.push({ name: "Collar", value: "collar" });
                }
                if (holdingchastitykey) {
                    choices.push({ name: "Chastity Belt", value: "chastitybelt" });
                }
                if (holdingchastitybrakey) {
                    choices.push({ name: "Chastity Bra", value: "chastitybra" });
                }

                await interaction.respond(choices);
            }*/ 
            // region scmd - additionalcollar
            else if (subcommand == "additionalcollar") {
                let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                let collarkeyholder;
                if (getCollar(interaction.guildId, chosenuserid)) {
                    // We only have collar access to those we have the key for, public access if unlocked or self if unlocked.
                    if (getCollar(interaction.guildId, chosenuserid)?.lock) {
                        collarkeyholder = getBaseLock(getCollar(interaction.guildId, chosenuserid)?.lock.locktype).canAccessLock({ uuid: getCollar(interaction.guildId, chosenuserid)?.lock.uuid, userID: interaction.user.id })
                    }
                    else if ((getOption(interaction.guildId, chosenuserid, "publicaccess") == "enabled") || (chosenuserid == interaction.user.id)) {
                        collarkeyholder = true
                    }
                }
                let chosentype = interaction.options.get("type")?.value;
                let choices = [];
                if (!collarkeyholder) {
                    choices = [{ name: "Not holding Collar Key", value: "nokeys" }];
                }
                else {
                    if (chosentype == "additionalcollar_add") {
                        let autocompletes = process.autocompletes.collar;
                        let matches = didYouMean(focusedValue, autocompletes, {
                            matchPath: ['name'], 
                            returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                            threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
                        })
                        if (matches.length == 0) {
                            matches = autocompletes;
                        }
                        let tags = getUserTags(interaction.guildId, chosenuserid);
                        let newsorted = [];
                        matches.forEach((f) => {
                            let tagged = false;
                            let i = getBaseCollar(f.value)
                            tags.forEach((t) => {
                                if (i.tags && i.tags.includes(t)) { tagged = true }
                            })
                            // Only attempt to add it to the list if it is not the worn collar type or the additional collar effect
                            if ((getCollar(interaction.guildId, chosenuserid)?.collartype != f.value) && !(getCollar(interaction.guildId, chosenuserid)?.additionalcollars && getCollar(interaction.guildId, chosenuserid)?.additionalcollars.includes(f.value))) {
                                if (!tagged) {
                                    newsorted.push(f);
                                }
                                else {
                                    newsorted.push({ name: `${f.name} (Forbidden due to Content Preferences)`, value: f.value })
                                }
                            }
                        })
                        // Remove all the non-special collars
                        newsorted = newsorted.filter((a) => getBaseCollar(a.value).special)
                        if (newsorted.length <= 0) {
                            newsorted = [
                                { name: "No Eligible Effects", value: "nokeys" }
                            ]
                        }
                        choices = newsorted;
                    }
                    if (chosentype == "additionalcollar_remove") {
                        choices = [
                            { name: "No Additional Effects", value: "noeffect" }
                        ]
                        if (getCollar(interaction.guildId, chosenuserid)?.additionalcollars && getCollar(interaction.guildId, chosenuserid)?.additionalcollars.length > 0) {
                            choices = getCollar(interaction.guildId, chosenuserid).additionalcollars.map((ac) => { return { name: getCollarName(interaction.guildId, undefined, ac), value: ac }})
                        }
                    }
                }
                await interaction.respond(choices);
            }
		} catch (err) {
			console.log(err);
		}
	},
	async execute(interaction) {
		try {
			let subcommand = interaction.options.getSubcommand();
			let choiceemoji;

            // region exe - clone
			if (subcommand == "clone") {
				let wearertoclone = interaction.options.getUser("wearer") ?? interaction.user;
				let chosenrestrainttoclone = interaction.options.getString("restraint"); // "clone_<uuid>"
				let clonedkeyholder = interaction.options.getUser("clonedkeyholder");
                let restrainttoclone = (chosenrestrainttoclone ? getItemType(getRestraintByUUID(chosenrestrainttoclone.split("_")[1])?.restraint) : "(Unknown Restraint)")

				// We're missing info, back to the start!
				if (!wearertoclone || !chosenrestrainttoclone || !clonedkeyholder) {
					interaction.reply({ content: `Something went wrong. The command was parsed as:\nClone ${wearertoclone}'s key for ${restrainttoclone} and give to ${clonedkeyholder}!`, flags: MessageFlags.Ephemeral });
					return;
				}

                choiceemoji = `${process.emojis[getItemType(getRestraintByUUID(chosenrestrainttoclone.split("_")[1])?.restraint)]}`

				// Check if the interaction user has access to clone the target restraint. If the restraint doesnt exist or they dont have access, go away. 
                if (!getRestraintByUUID(chosenrestrainttoclone.split("_")[1]) || !getBaseLock(getRestraintByUUID(chosenrestrainttoclone.split("_")[1]).restraint.lock.locktype).canCloneKeys({ uuid: chosenrestrainttoclone.split("_")[1], userID: interaction.user.id})) {
                    interaction.reply({ content: `You don't have access to clone keys for ${wearertoclone}'s ${restrainttoclone}.`, flags: MessageFlags.Ephemeral });
					return;
                }

				// We can't hold a clone of a restraint we have primary keys for.
				if (interaction.user == clonedkeyholder) {
					interaction.reply({ content: `You can't give yourself another copy of the key!`, flags: MessageFlags.Ephemeral });
					return;
				}

				// If the wearer has disabled key cloning, tell them to leave.
				if (getOption(interaction.guildId, wearertoclone.id, "keycloning") == "disabled") {
					interaction.reply({ content: `${wearertoclone} has disabled key cloning.`, flags: MessageFlags.Ephemeral });
					return;
				}

				// At this point, we're sure this is a valid cloning attempt. Prompt the user that this is what they want to do.
				// Prompt and ensure the user intended to run this command for this combination.
				let components = [
					{
						type: ComponentType.ActionRow,
						components: [
							{ type: ComponentType.Button, label: "Cancel", customId: `cancel`, style: ButtonStyle.Danger },
							{ type: ComponentType.Button, label: "Clone the Key", customId: `agreetoclonebutton`, style: ButtonStyle.Success },
						],
					},
				];

				let responsetext = `Cloning the keys for ${wearertoclone}'s ${choiceemoji} ${getItemName(getRestraintByUUID(chosenrestrainttoclone.split("_")[1]).restraint)} and giving the copy to 🔑${clonedkeyholder}. You will retain full access to this restraint.\n\nPlease confirm by pressing the button below:`;
				if (wearertoclone == interaction.user) {
					responsetext = `Cloning the keys for your ${choiceemoji} ${getItemName(getRestraintByUUID(chosenrestrainttoclone.split("_")[1]).restraint)} and giving the copy to 🔑${clonedkeyholder}. You will retain full access to your restraints while ${clonedkeyholder} has the cloned key.\n\nPlease confirm by pressing the button below:`;
				}

				let response = await interaction.reply({ content: responsetext, flags: MessageFlags.Ephemeral, components: components, withResponse: true });
				let confirmation;

				const collectorFilter = (i) => i.user.id === interaction.user.id;
				try {
					confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 300_000 });

					if (confirmation.customId === "agreetoclonebutton") {
						// Skip the DM if it's the wearer giving a clone of their key.
						if (wearertoclone == interaction.user || wearertoclone == clonedkeyholder || getOption(interaction.guildId, wearertoclone.id, "keycloning") == "auto") {
							let data = { 
                                textarray: "texts_key", 
                                textdata: { 
                                    serverID: interaction.guildId, 
                                    interactionuser: interaction.user, 
                                    targetuser: wearertoclone, 
                                    c1: getItemName(getRestraintByUUID(chosenrestrainttoclone.split("_")[1]).restraint), 
                                    c2: clonedkeyholder 
                                } 
                            };
							let cloneaccept;
							console.log(cloneaccept);
							data.clone = true;
							if (wearertoclone == interaction.user) {
								cloneaccept = "clone_accept_self";
								data.self = true;
							} else {
								cloneaccept = "clone_accept";
								data.other = true;
							}
							//data[restrainttoclone] = true;
                            if (getBaseLock(getRestraintByUUID(chosenrestrainttoclone.split("_")[1]).restraint.lock.locktype)?.modifyClones) {
                                getBaseLock(getRestraintByUUID(chosenrestrainttoclone.split("_")[1]).restraint.lock.locktype)?.modifyClones({ uuid: chosenrestrainttoclone.split("_")[1], userID: clonedkeyholder.id, add: true })
                                await confirmation.update({ content: getTextGeneric(cloneaccept, data.textdata), components: [] });
							    await confirmation.followUp(getText(data));
                            }
                            else {
                                console.log(`No modifyClones function!`)
                                await confirmation.update({ content: `Something went wrong cloning the key, tell Enraa.`, components: [] });
                            }
						} else {
							await confirmation.update({ content: `Prompting the user for permission.`, components: [] });
                            promptCloneKey(interaction.guildId, interaction.user, wearertoclone, clonedkeyholder, chosenrestrainttoclone.split("_")[1]).then(
                                async (res) => {
                                    // User said yes
                                    let data = { 
                                        textarray: "texts_key", 
                                        textdata: { 
                                            serverID: interaction.guildId, 
                                            interactionuser: interaction.user, 
                                            targetuser: wearertoclone, 
                                            c1: getItemName(getRestraintByUUID(chosenrestrainttoclone.split("_")[1]).restraint), 
                                            c2: clonedkeyholder 
                                        } 
                                    };
                                    data.clone = true;
                                    data.other = true;
                                    //data[restrainttoclone] = true;
                                    if (getBaseLock(getRestraintByUUID(chosenrestrainttoclone.split("_")[1]).restraint.lock.locktype)?.modifyClones) {
                                        getBaseLock(getRestraintByUUID(chosenrestrainttoclone.split("_")[1]).restraint.lock.locktype)?.modifyClones({ uuid: chosenrestrainttoclone.split("_")[1], userID: clonedkeyholder.id, add: true })
                                        await confirmation.editReply({ content: getTextGeneric("clone_accept", data.textdata), components: [] });
                                        await confirmation.followUp(getText(data));
                                    }
                                    else {
                                        console.log(`No modifyClones function!`)
                                        await confirmation.editReply({ content: `Something went wrong cloning the key, tell Enraa`, components: [] });
                                    }
                                },
                                async (rej) => {
                                    // User said no
                                }
                            )
						}
					} else if (confirmation.customId === "cancel") {
						await confirmation.update({ content: "Action cancelled", components: [] });
						return; // Stop with the key cloning immediately.
					}
				} catch (err) {
					console.log(err);
					await interaction.editReply({ content: "Confirmation not received within 5 minutes, cancelling transfer.", components: [] });
					return;
				}
			// region exe - revoke
            } else if (subcommand == "revoke") {
				let cloneresponse = interaction.options.getString("clones");

				// We're missing a string, back to the start!
				if (!cloneresponse) {
					interaction.reply({ content: `Something went wrong. You provided no key choice.`, flags: MessageFlags.Ephemeral });
					return;
				}

				let clonedkeyholder = await interaction.guild.members.fetch(cloneresponse.split("_")[2]);
                let uuid = cloneresponse.split("_")[1]
                let lock = getRestraintByUUID(uuid)?.restraint?.lock;
                let wearer = await interaction.guild.members.fetch(lock.userID)
                choiceemoji = `${process.emojis[getItemType(getRestraintByUUID(cloneresponse.split("_")[1])?.restraint)]}`
                if (!lock || !getBaseLock(lock.locktype)) {
                    interaction.reply({ content: `Something went wrong. The lock or restraint is missing.`, flags: MessageFlags.Ephemeral });
					return;
                }
                let typeofrestraint = getItemType(getRestraintByUUID(cloneresponse.split("_")[1])?.restraint);
                if (typeofrestraint == "chastity") { typeofrestraint = "chastitybelt" }

                // If the clonedkeyholder is someone else, check canRemoveCloneKeys, else check canRevokeSelfClone
                let canrevoke = false;
                let isclone = false;
                if (clonedkeyholder.id == interaction.user.id) {
                    if (getBaseLock(lock.locktype).canRevokeSelfClone && getBaseLock(lock.locktype).canRevokeSelfClone({ uuid: uuid, userID: interaction.user.id })) {
                        canrevoke = true;
                        isclone = true;
                    }
                }
                else {
                    if (getBaseLock(lock.locktype).canRevokeSelfClone && getBaseLock(lock.locktype).canRemoveCloneKeys({ uuid: uuid, userID: interaction.user.id })) {
                        canrevoke = true;
                    }
                }
				
				if (!canrevoke) {
					interaction.reply({ content: `You do not have access to revoke keys for ${wearer}'s ${typeofrestraintreadable}.`, flags: MessageFlags.Ephemeral });
					return;
				}

				// At this point, we're sure this is a valid Revoke attempt. Prompt the user that this is what they want to do.
				// Prompt and ensure the user intended to run this command for this combination.
				let components = [
					{
						type: ComponentType.ActionRow,
						components: [
							{ type: ComponentType.Button, label: "Cancel", customId: `cancel`, style: ButtonStyle.Danger },
							{ type: ComponentType.Button, label: "Revoke the Key", customId: `agreetorevokebutton`, style: ButtonStyle.Success },
						],
					},
				];

				let verifyresponse = `Revoking cloned keys for ${wearer}'s ${choiceemoji}${getItemName(getRestraintByUUID(uuid)?.restraint)} from 🔑${clonedkeyholder}. ${clonedkeyholder} will no longer have access to ${getPronouns(interaction.guildId, wearer.id, "possessiveDeterminer")} ${choiceemoji}${getItemName(getRestraintByUUID(uuid)?.restraint)}.\n\nPlease confirm by pressing the button below:`;
				if (wearer.id == clonedkeyholder.id) {
					// they hold their own cloned key.
					verifyresponse = `Revoking ${wearer}'s own cloned keys for ${getPronouns(interaction.guildId, clonedkeyholder.id, "possessiveDeterminer")} ${choiceemoji}${getItemName(getRestraintByUUID(uuid)?.restraint)}. ${getPronouns(interaction.guildId, clonedkeyholder.id, "subject", true)} will no longer have access to ${getPronouns(interaction.guildId, clonedkeyholder.id, "possessiveDeterminer")} ${choiceemoji}${getItemName(getRestraintByUUID(uuid)?.restraint)}.\n\nPlease confirm by pressing the button below:`;
				}

				let response = await interaction.reply({ content: verifyresponse, flags: MessageFlags.Ephemeral, components: components, withResponse: true });
				let confirmation;

				const collectorFilter = (i) => i.user.id === interaction.user.id;
				try {
					confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 300_000 });

					if (confirmation.customId === "agreetorevokebutton") {
						let data = { 
                            textarray: "texts_key", 
                            textdata: { 
                                serverID: interaction.guildId, 
                                interactionuser: interaction.user, 
                                targetuser: wearer, 
                                c1: getItemName(getRestraintByUUID(uuid)?.restraint), 
                                c2: clonedkeyholder 
                            } 
                        };
						data.revoke = true;
						if (isclone) {
							data.isclone = true;
						} else {
							data.isprimary = true;
						}
                        if (wearer.id == interaction.user.id) {
                            data.self = true;
                        }
                        else {
                            data.other = true;
                        }
						//data[typeofrestraint] = true;
                        getBaseLock(getRestraintByUUID(uuid)?.restraint?.lock?.locktype).modifyClones({ uuid: uuid, userID: clonedkeyholder.id, add: false });
						await confirmation.update({ content: getTextGeneric("revoke_accept", data.textdata), components: [] });
						await confirmation.followUp(getText(data));
					} else if (confirmation.customId === "cancel") {
						await confirmation.update({ content: "Action cancelled", components: [] });
						return; // Stop with the key revokation immediately.
					}
				} catch (err) {
					console.log(err);
					await interaction.editReply({ content: "Confirmation not received within 5 minutes, cancelling transfer.", components: [] });
					return;
				}
			// region exe - give
            } else if (subcommand == "give") {
				const wearer = interaction.options.getUser("wearer") ?? interaction.user;
				const restraint = interaction.options.getString("restraint");
				const newKeyholder = interaction.options.getUser("newkeyholder");

				// We're missing info, back to the start!
				if (!wearer || !restraint || !newKeyholder) {
					interaction.reply({ content: `Something went wrong. The command was parsed as:\nGive ${wearer}'s key for ${restraint} and give to ${newKeyholder}!`, flags: MessageFlags.Ephemeral });
					return;
				}

                let uuid = restraint.split("_")[1]
                let lock = getRestraintByUUID(uuid)?.restraint?.lock;
                choiceemoji = `${process.emojis[getItemType(getRestraintByUUID(restraint.split("_")[1])?.restraint)]}`
                if (!lock || !getBaseLock(lock.locktype)) {
                    interaction.reply({ content: `Something went wrong. The lock or restraint is missing.`, flags: MessageFlags.Ephemeral });
					return;
                }
                let typeofrestraint = getItemType(getRestraintByUUID(restraint.split("_")[1])?.restraint);
                if (typeofrestraint == "chastity") { typeofrestraint = "chastitybelt" }

				// We can't give to ourselves lol
				if (interaction.user == newKeyholder) {
					interaction.reply({ content: `You can't give yourself the key you're holding!`, flags: MessageFlags.Ephemeral });
					return;
				}

				// Check if the interaction user has access to give the key for the target restraint.
				let cangive = false;
				let chosenrestraintreadable;
                if (getBaseLock(lock.locktype).canTransfer && getBaseLock(lock.locktype).canTransfer({ uuid: uuid, userID: interaction.user.id })) {
                    cangive = true;
                }
				if (!cangive) {
					interaction.reply({ content: `You do not have the primary keys for ${wearer}'s ${restraint}.`, flags: MessageFlags.Ephemeral });
					return;
				}

				// At this point, we're sure this is a valid giving attempt. Prompt the user that this is what they want to do.
				// Prompt and ensure the user intended to run this command for this combination.
				let components = [
					{
						type: ComponentType.ActionRow,
						components: [
							{ type: ComponentType.Button, label: "Cancel", customId: `cancel`, style: ButtonStyle.Danger },
							{ type: ComponentType.Button, label: "Give the Key", customId: `agreetogivebutton`, style: ButtonStyle.Success },
						],
					},
				];

				let responsetext = `Giving the keys for ${wearer}'s ${choiceemoji}${getItemName(getRestraintByUUID(uuid)?.restraint)} to 🔑${newKeyholder}. *You will no longer be able to access that restraint.*\n\nPlease confirm by pressing the button below:`;
				if (wearer == interaction.user) {
					responsetext = `Giving the keys for your ${choiceemoji}${getItemName(getRestraintByUUID(uuid)?.restraint)} to 🔑${newKeyholder}. *You will no longer be able to access your restraint.*\n\nPlease confirm by pressing the button below:`;
				}

				let response = await interaction.reply({ content: responsetext, flags: MessageFlags.Ephemeral, components: components, withResponse: true });
				let confirmation;

				const collectorFilter = (i) => i.user.id === interaction.user.id;
				try {
					confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 300_000 });

					if (confirmation.customId === "agreetogivebutton") {
						// Skip the DM if the wearer is the giver or receiver, or if they have auto accepting enabled
						if (wearer == interaction.user || wearer == newKeyholder || (getOption(interaction.guildId, wearer.id, "keygiving") == "auto")) {
							let data = { 
                                textarray: "texts_key", 
                                textdata: { 
                                    serverID: interaction.guildId, 
                                    interactionuser: interaction.user, 
                                    targetuser: wearer, 
                                    c1: getItemName(getRestraintByUUID(uuid)?.restraint), 
                                    c2: newKeyholder 
                                } 
                            };
							data.give = true;
							if (wearer == interaction.user) {
								data.self = true;
							} else {
								data.other = true;
							}
							//data[typeofrestraint] = true;
							await confirmation.update({ content: getTextGeneric("give_accept_self", data.textdata), components: [] });
							await confirmation.followUp(getText(data));
                            getBaseLock(getRestraintByUUID(uuid)?.restraint.lock.locktype).modifyKeyholder({ uuid: uuid, userID: newKeyholder.id })
						} else {
							await confirmation.update({ content: `Prompting the user for permission.`, components: [] });
							await promptTransferKey(interaction.guildId, interaction.user, wearer, newKeyholder, uuid).then(
                                async (res) => {
                                    // User said yes
                                    let data = { 
                                        textarray: "texts_key", 
                                        textdata: { 
                                            serverID: interaction.guildId, 
                                            interactionuser: interaction.user, 
                                            targetuser: wearer, 
                                            c1: getItemName(getRestraintByUUID(uuid)?.restraint), 
                                            c2: newKeyholder 
                                        } 
                                    };
                                    data.give = true;
                                    data.other = true;
                                    //data[typeofrestraint] = true;
                                    await confirmation.editReply(getTextGeneric("give_accept", data.textdata));
                                    await confirmation.followUp(getText(data));
                                    getBaseLock(getRestraintByUUID(uuid)?.restraint.lock.locktype).modifyKeyholder({ uuid: uuid, userID: newKeyholder.id })
                                },
                                async (rej) => {
                                    // User said no.
                                    let data = { textarray: "texts_key", textdata: { serverID: interaction.guildId, interactionuser: interaction.user, targetuser: wearer, c1: chosenrestraintreadable, c2: newKeyholder } };
                                    await interaction.editReply(getTextGeneric("give_decline", data.textdata));
                                },
                            );
						}
					} else if (confirmation.customId === "cancel") {
						await confirmation.update({ content: "Action cancelled", components: [] });
						return; // Stop with the key giving immediately.
					}
				} catch (err) {
					console.log(err);
					await interaction.editReply({ content: "Confirmation not received within 5 minutes, cancelling transfer.", components: [] });
					return;
				}
			// region exe - swapitem
            } else if (subcommand == "swapitem") {
				let wearer = interaction.options.getUser("wearer") ?? interaction.user;
				let restrainttype = interaction.options.getString("restraint");
                if (restrainttype == "chastity") {
                    restrainttype = "chastitybelt"
                }
				let newrestraint = interaction.options.getString("restrainttype");

				if (!wearer || !restrainttype || !newrestraint || (restrainttype == "nothing") || (newrestraint == "nothing")) {
					interaction.reply({ content: `Something went wrong. The command was parsed as:\nSwap ${wearer}'s ${restrainttype} to a ${newrestraint}!`, flags: MessageFlags.Ephemeral });
					return;
				}

				let newrestraintname;
				let permitted = false;
				if (restrainttype == "collar") {
					newrestraintname = getCollarName(interaction.guildId, undefined, newrestraint);
					if (!getCollar(interaction.guildId, wearer.id).lock || (getCollar(interaction.guildId, wearer.id)?.lock && getBaseLock(getCollar(interaction.guildId, wearer.id)?.lock.locktype).canUnlock({ uuid: getCollar(interaction.guildId, wearer.id)?.lock.uuid, userID: interaction.user.id }))) {
						permitted = true;
					}
				} else if (restrainttype == "chastitybelt") {
					newrestraintname = getChastityName(interaction.guildId, undefined, newrestraint);
                    if (!getChastity(interaction.guildId, wearer.id).lock || (getChastity(interaction.guildId, wearer.id)?.lock && getBaseLock(getChastity(interaction.guildId, wearer.id)?.lock.locktype).canUnlock({ uuid: getChastity(interaction.guildId, wearer.id)?.lock.uuid, userID: interaction.user.id }))) {
						permitted = true;
					}
				} else if (restrainttype == "chastitybra") {
					newrestraintname = getChastityBraName(interaction.guildId, undefined, newrestraint);
                    if (!getChastityBra(interaction.guildId, wearer.id).lock || (getChastityBra(interaction.guildId, wearer.id)?.lock && getBaseLock(getChastityBra(interaction.guildId, wearer.id)?.lock.locktype).canUnlock({ uuid: getChastityBra(interaction.guildId, wearer.id)?.lock.uuid, userID: interaction.user.id }))) {
						permitted = true;
					}
				}

				// Catch if they ARE NOT ALLOWED
				if (!permitted) {
					interaction.reply({ content: `You don't have access to unlock ${wearer}'s ${restrainttype}!`, flags: MessageFlags.Ephemeral });
					return;
				} else if (!newrestraintname) {
					interaction.reply({ content: `Something went wrong with your new restraint selection!`, flags: MessageFlags.Ephemeral });
					return;
				} else if (!getHeavyBound(interaction.guildId, interaction.user.id, wearer.id)) {
                    interaction.reply({ content: `You can't change restraints on ${wearer} while bound!`, flags: MessageFlags.Ephemeral });
					return;
                }

				// Okay they're probably allowed lol
				let data = { textarray: "texts_key", textdata: { serverID: interaction.guildId, interactionuser: interaction.user, targetuser: wearer } };
				data.swapitem = true;
				if (interaction.user.id == wearer.id) {
					// swapping own keyed item
					data.self = true;
					data[restrainttype] = true;
					if (restrainttype == "collar") {
						data.textdata.c1 = getCollarName(interaction.guildId, wearer.id, getCollar(interaction.guildId, wearer.id).collartype) ?? "collar"; // Old collar
						data.textdata.c2 = newrestraintname;
                        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                        await handleExtremeRestraint(interaction.guildId, interaction.user, wearer, "collar", newrestraint).then(
                            async (success) => {
                                await interaction.followUp({ content: `Swapping your collar to the ${data.textdata.c2}.`, flags: MessageFlags.Ephemeral })
                                await interaction.followUp({ content: getText(data) })
                                getCollar(interaction.guildId, wearer.id).collartype = newrestraint;
                                markForSave("collar");
                            },
                            async (reject) => {
                                await interaction.followUp({ content: `The ${data.textdata.c2} swap was rejected.`, flags: MessageFlags.Ephemeral })
                            }
                        )
					} else if (restrainttype == "chastitybelt") {
						data.textdata.c1 = getChastityName(interaction.guildId, wearer.id, getChastity(interaction.guildId, wearer.id).chastitytype) ?? "chastity belt"; // Old collar
						data.textdata.c2 = newrestraintname;
						if(!swapChastity(interaction.guildId, wearer.id, interaction.user.id, newrestraint)){ interaction.reply({ content: `The chastity belt couldn't be unlocked.`, flags: MessageFlags.Ephemeral }); return; }
						interaction.reply(getText(data));
					} else if (restrainttype == "chastitybra") {
						data.textdata.c1 = getChastityBraName(interaction.guildId, wearer.id, getChastityBra(interaction.guildId, wearer.id).chastitytype) ?? "chastity bra"; // Old collar
						data.textdata.c2 = newrestraintname;
						if(!swapChastityBra(interaction.guildId, wearer.id, interaction.user.id, newrestraint)){ interaction.reply({ content: `The chastity bra couldn't be unlocked.`, flags: MessageFlags.Ephemeral }); return; }
						interaction.reply(getText(data));
					}
				} else {
					// swapping other's keyed item
					data.other = true;
					data[restrainttype] = true;
					if (restrainttype == "collar") {
						data.textdata.c1 = getCollarName(interaction.guildId, wearer.id, getCollar(interaction.guildId, wearer.id).collartype) ?? "collar"; // Old collar
						data.textdata.c2 = newrestraintname;
                        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                        await handleExtremeRestraint(interaction.guildId, interaction.user, wearer, "collar", newrestraint).then(
                            async (success) => {
                                await interaction.followUp({ content: `Swapping ${wearer}'s collar to the ${data.textdata.c2}.`, flags: MessageFlags.Ephemeral })
                                await interaction.followUp({ content: getText(data) })
                                getCollar(interaction.guildId, wearer.id).collartype = newrestraint;
                                markForSave("collar");
                            },
                            async (reject) => {
                                await interaction.followUp({ content: `The ${data.textdata.c2} swap was rejected.`, flags: MessageFlags.Ephemeral })
                            }
                        )
					} else if (restrainttype == "chastitybelt") {
						data.textdata.c1 = getChastityName(interaction.guildId, wearer.id, getChastity(interaction.guildId, wearer.id).chastitytype) ?? "chastity belt"; // Old collar
						data.textdata.c2 = newrestraintname;
						if(!swapChastity(interaction.guildId, wearer.id, interaction.user.id, newrestraint)){ interaction.reply({ content: `The chastity belt couldn't be unlocked.`, flags: MessageFlags.Ephemeral }); return; } // I'm gonna leave this like this for now. Maybe once we have belts that can fail to unlock we can improve this.
						markForSave("chastity");
						interaction.reply(getText(data));
					} else if (restrainttype == "chastitybra") {
						data.textdata.c1 = getChastityBraName(interaction.guildId, wearer.id, getChastityBra(interaction.guildId, wearer.id).chastitytype) ?? "chastity bra"; // Old collar
						data.textdata.c2 = newrestraintname;
						if(!swapChastityBra(interaction.guildId, wearer.id, interaction.user.id, newrestraint)){ interaction.reply({ content: `The chastity bra couldn't be unlocked.`, flags: MessageFlags.Ephemeral }); return; }
						markForSave("chastitybra");
						interaction.reply(getText(data));
					}
				}
            }
            // region exe - menu
            else if (subcommand == "menu") {
                interaction.reply(await generateKeyGivingModal(interaction.guildId, interaction.user.id, undefined, undefined, "0000"))
            } 
            // region exe - addlcollar
            else if (subcommand == "additionalcollar") {
                // Handling additional collar effects!
                let wearer = interaction.options.getUser("wearer") ?? interaction.user;
                let additionaltype = interaction.options.getString("type"); // "additionalcollar_add", "additionalcollar_remove"
				let collareffect = interaction.options.getString("collareffect"); // eligible collar type!
                let collarkeyholder;
                if (getCollar(interaction.guildId, wearer.id)) {
                    // We only have collar access to those we have the key for, public access if unlocked or self if unlocked.
                    if (getCollar(interaction.guildId, wearer.id)?.lock) {
                        collarkeyholder = getBaseLock(getCollar(interaction.guildId, wearer.id)?.lock.locktype).canAccessLock({ uuid: getCollar(interaction.guildId, wearer.id)?.lock.uuid, userID: interaction.user.id })
                    }
                    else if ((getOption(interaction.guildId, wearer.id, "publicaccess") == "enabled") || (wearer.id == interaction.user.id)) {
                        collarkeyholder = true
                    }
                }
                if ((!collarkeyholder) || (collareffect == "nokeys")) {
                    // If we do not have the target's collar keys, go away.
                    if (interaction.user.id == wearer.id) {
                        interaction.reply({ content: `You do not have the keys to your collar!`, flags: MessageFlags.Ephemeral })
                        return;
                    }
                    else {
                        interaction.reply({ content: `You do not have the keys to that collar!`, flags: MessageFlags.Ephemeral })
                        return;
                    }
                }
                else {
                    if (additionaltype == "additionalcollar_add") {
                        if ((collareffect == "noeffect") || (collareffect == undefined)) {
                            interaction.reply({ content: `You didn't choose an effect to add!`, flags: MessageFlags.Ephemeral })
                            return;
                        }
                        else {
                            // Check their tags and make sure they're okay with this. 
                            let blocked = false;
                            let tags = getUserTags(interaction.guildId, wearer.id);
                            let i = getBaseCollar(collareffect)
                            tags.forEach((t) => {
                                if (i && i.tags && i.tags[t] && (wearer != interaction.user)) {
                                    interaction.reply({ content: `${wearer}'s content settings forbid this item - ${i.name}!`, flags: MessageFlags.Ephemeral })
                                    blocked = true;
                                    return;
                                }
                            })
                            if (blocked) {
                                return;
                            }

                            // Okay they're probably allowed lol
                            let data = { 
                                textarray: "texts_key", textdata: { 
                                    serverID: interaction.guildId, 
                                    interactionuser: interaction.user, 
                                    targetuser: wearer,
                                    c1: getBaseCollar(collareffect)?.name,
                                    c2: getBaseCollar(getCollar(interaction.guildId, wearer.id)?.collartype)?.name ?? "collar"
                                },
                            };
                            data.additionalcollar = true;
                            if (wearer.id == interaction.user.id) {
                                data.self = true;
                            }
                            else {
                                data.other = true;
                            }
                            data.add = true;
                            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                            await handleExtremeRestraint(interaction.guildId, interaction.user, wearer, "collar", collareffect).then(
                                async (success) => {
                                    await interaction.followUp({ content: `Applying the ${data.textdata.c1} effect`, flags: MessageFlags.Ephemeral })
                                    await interaction.followUp({ content: getText(data) })
                                    addAdditionalCollarEffect(interaction.guildId, wearer.id, collareffect);
                                },
                                async (reject) => {
                                    await interaction.followUp({ content: `The ${data.textdata.c1} effect was rejected.`, flags: MessageFlags.Ephemeral })
                                }
                            )
                        }
                    }
                    else {
                        if ((collareffect == "noeffect") || (collareffect == undefined)) {
                            interaction.reply({ content: `You didn't choose an effect to remove!`, flags: MessageFlags.Ephemeral })
                            return;
                        }
                        else {
                            // Okay they're probably allowed lol
                            let data = { 
                                textarray: "texts_key", textdata: { 
                                    serverID: interaction.guildId, 
                                    interactionuser: interaction.user, 
                                    targetuser: wearer,
                                    c1: getBaseCollar(collareffect)?.name,
                                    c2: getBaseCollar(getCollar(interaction.guildId, wearer.id)?.collartype)?.name ?? "collar"
                                },
                            };
                            data.additionalcollar = true;
                            if (wearer.id == interaction.user.id) {
                                data.self = true;
                            }
                            else {
                                data.other = true;
                            }
                            data.remove = true;
                            interaction.reply({ content: getText(data) })
                            removeAdditionalCollarEffect(interaction.guildId, wearer.id, collareffect);
                        }
                    }
                }
            }
            // region exe - discard
            if (subcommand == "discard") {
				let wearertodiscard = interaction.options.getUser("wearer") ?? interaction.user;
				let chosenrestrainttoclone = interaction.options.getString("restraint");

				// We're missing info, back to the start!
				if (!wearertodiscard || !chosenrestrainttoclone) {
					interaction.reply({ content: `Something went wrong. The command was parsed as:\nDiscard ${wearertodiscard}'s key for ${chosenrestrainttoclone}!`, flags: MessageFlags.Ephemeral });
					return;
				}

				// Check if the interaction user has access to discard the key for target restraint.
				let candiscard = false;
				if (chosenrestrainttoclone == "collar" && getCollar(interaction.guildId, wearertodiscard.id) && canAccessCollar(interaction.guildId, wearertodiscard.id, interaction.user.id, undefined, true).access) {
                    candiscard = true
				}
				if (chosenrestrainttoclone == "chastitybelt" && getChastity(interaction.guildId, wearertodiscard.id) && canAccessChastity(interaction.guildId, wearertodiscard.id, interaction.user.id, undefined, true).access) {
					candiscard = true
				}
				if (chosenrestrainttoclone == "chastitybra" && getChastityBra(interaction.guildId, wearertodiscard.id) && canAccessChastityBra(interaction.guildId, wearertodiscard.id, interaction.user.id, undefined, true).access) {
					candiscard = true
				}
				if (!candiscard) {
                    if (wearertodiscard.id == interaction.user.id) {
                        interaction.reply({ content: `You do not have the primary keys for your restraint to lose.`, flags: MessageFlags.Ephemeral });
                    }
                    else {
                        interaction.reply({ content: `You do not have the primary keys for ${wearertodiscard}'s restraint to lose.`, flags: MessageFlags.Ephemeral });
                    }
					return;
				}

				// If the wearer has disabled key loss from fumbling, tell them to leave.
				if (getOption(interaction.guildId, wearertodiscard.id, "keyloss") == "disabled") {
                    if (wearertodiscard.id === interaction.user.id) {
                        interaction.reply({ content: `You've disabled key loss from fumbling.`, flags: MessageFlags.Ephemeral });
					    return;
                    }
                    else {
                        interaction.reply({ content: `${wearertodiscard} has disabled key loss from fumbling.`, flags: MessageFlags.Ephemeral });
					    return;
                    }
				} 

                let data = { 
                    textarray: "texts_key", 
                    textdata: {
                        serverID: interaction.guildId, 
                        interactionuser: interaction.user,
                        targetuser: wearertodiscard,
                    },
                };
                data.discardkey = true;

                if (wearertodiscard.id == interaction.user.id) {
                    data.self = true;
                }
                else {
                    data.other = true;
                }
                data.keyholder = true;

                if ((chosenrestrainttoclone == "chastitybelt")) {
                    data.textdata.c1 = getBaseChastity(getChastity(interaction.guildId, wearertodiscard.id)?.chastitytype ?? `belt_silver`).name
                    discardKey(interaction.guildId, wearertodiscard.id, interaction.user.id, "chastity belt");
                }
                else if ((chosenrestrainttoclone == "chastitybra")) {
                    data.textdata.c1 = getBaseChastity(getChastityBra(interaction.guildId, wearertodiscard.id)?.chastitytype ?? `bra_silver`).name
                    discardKey(interaction.guildId, wearertodiscard.id, interaction.user.id, "chastity bra");
                }
                else if (chosenrestrainttoclone == "collar") {
                    // Why the fuck is .collartype ever storing a string value named "null"!?
                    let collartype = getCollar(interaction.guildId, wearertodiscard.id).collartype
                    if (collartype == "null") {
                        collartype = `collar_leather`
                        data.textdata.c1 = `collar`
                    }
                    else {
                        data.textdata.c1 = getBaseCollar(collartype).name
                    }
                    discardKey(interaction.guildId, wearertodiscard.id, interaction.user.id, "collar");
                }

                interaction.reply(getText(data));

            }
            // region exe - return
            if (subcommand == "return") {
				let wearertodiscard = interaction.options.getUser("wearer") ?? interaction.user;
				let chosenrestrainttoclone = interaction.options.getString("restraint");

				// We're missing info, back to the start!
				if (!wearertodiscard || !chosenrestrainttoclone) {
					interaction.reply({ content: `Something went wrong. The command was parsed as:\nReturn ${wearertodiscard}'s key for ${chosenrestrainttoclone}!`, flags: MessageFlags.Ephemeral });
					return;
				}

				// Check if the interaction user has access to discard the key for target restraint.
				let candiscard = false;
				if (chosenrestrainttoclone == "collar" && getCollar(interaction.guildId, wearertodiscard.id) && (getCollar(interaction.guildId, wearertodiscard.id).temporarykeyholder == interaction.user.id)) {
                    candiscard = true
				}
				if (chosenrestrainttoclone == "chastitybelt" && getChastity(interaction.guildId, wearertodiscard.id) && (getChastity(interaction.guildId, wearertodiscard.id).temporarykeyholder == interaction.user.id)) {
					candiscard = true
				}
				if (chosenrestrainttoclone == "chastitybra" && getChastityBra(interaction.guildId, wearertodiscard.id) && (getChastityBra(interaction.guildId, wearertodiscard.id).temporarykeyholder == interaction.user.id)) {
					candiscard = true
				}
				if (!candiscard) {
                    if (wearertodiscard.id == interaction.user.id) {
                        // This should NEVER occur!
                        interaction.reply({ content: `You do not have keys for your restraint to lose.`, flags: MessageFlags.Ephemeral });
                    }
                    else {
                        interaction.reply({ content: `You do not have any keys for ${wearertodiscard}'s restraint to return.`, flags: MessageFlags.Ephemeral });
                    }
					return;
				}

                let data = { 
                    textarray: "texts_key", 
                    textdata: {
                        serverID: interaction.guildId, 
                        interactionuser: interaction.user,
                        targetuser: wearertodiscard,
                    },
                };
                data.returnkey = true;

                if (wearertodiscard.id == interaction.user.id) {
                    // SHOULD NEVER HAPPEN
                    data.self = true;
                }
                else {
                    data.other = true;
                }

                if ((chosenrestrainttoclone == "chastitybelt")) {
                    data.textdata.c1 = getBaseChastity(getChastity(interaction.guildId, wearertodiscard.id)?.chastitytype ?? `belt_silver`).name
                    let chastity = getChastity(interaction.guildId, wearertodiscard.id)
                    delete chastity.fumbled;
                    delete chastity.temporarykeyholdertime;
                    delete chastity.temporarykeyholder;
                }
                else if ((chosenrestrainttoclone == "chastitybra")) {
                    data.textdata.c1 = getBaseChastity(getChastityBra(interaction.guildId, wearertodiscard.id)?.chastitytype ?? `bra_silver`).name
                    let chastity = getChastityBra(interaction.guildId, wearertodiscard.id)
                    delete chastity.fumbled;
                    delete chastity.temporarykeyholdertime;
                    delete chastity.temporarykeyholder;
                }
                else if (chosenrestrainttoclone == "collar") {
                    // Why the fuck is .collartype ever storing a string value named "null"!?
                    let collartype = getCollar(interaction.guildId, wearertodiscard.id).collartype
                    if (collartype == "null") {
                        collartype = `collar_leather`
                        data.textdata.c1 = `collar`
                    }
                    else {
                        data.textdata.c1 = getBaseCollar(collartype).name
                    }
                    let collar = getCollar(interaction.guildId, wearertodiscard.id)
                    delete collar.fumbled;
                    delete collar.temporarykeyholdertime;
                    delete collar.temporarykeyholder;
                }

                interaction.reply(getText(data));

            }
		} catch (err) {
			console.log(err);
		}
	},
    async interactionresponse(interaction) {
        console.log(interaction)
        try {
            let optionparts = interaction.customId.split("_");
            if (optionparts[1] == "mode") {
                let newkeybit = optionparts[5]
                if (optionparts[2] == "clone") { 
                    newkeybit = `1${newkeybit.slice(1)}` 
                }
                else { 
                    newkeybit = `0${newkeybit.slice(1)}` 
                }
                await interaction.update(await generateKeyGivingModal(interaction.guildId, interaction.user.id, optionparts[3], optionparts[4], newkeybit));
			}
            else if (optionparts[1] == "key") {
                let newkeybit = optionparts[5]
                if (optionparts[2] == "chastity") {
                    if (newkeybit.charAt(1) == "0") { 
                        newkeybit = `${newkeybit.slice(0,1)}1${newkeybit.slice(2)}` 
                    }
                    else { 
                        newkeybit = `${newkeybit.slice(0,1)}0${newkeybit.slice(2)}` 
                    }
                }
                if (optionparts[2] == "chastitybra") {
                    if (newkeybit.charAt(2) == "0") { 
                        newkeybit = `${newkeybit.slice(0,2)}1${newkeybit.slice(3)}` 
                    }
                    else { 
                        newkeybit = `${newkeybit.slice(0,2)}0${newkeybit.slice(3)}` 
                    }
                }
                if (optionparts[2] == "collar") {
                    if (newkeybit.charAt(3) == "0") { 
                        newkeybit = `${newkeybit.slice(0,3)}1}` 
                    }
                    else { 
                        newkeybit = `${newkeybit.slice(0,3)}0}` 
                    }
                }
                await interaction.update(await generateKeyGivingModal(interaction.guildId, interaction.user.id, optionparts[3], optionparts[4], newkeybit));
            }
            else if (optionparts[1] == "select") {
                let newkeybit = optionparts[5]
                if (optionparts[2] == "wearerid") {
                    let newwearer = optionparts[3]
                    if (interaction.values) {
                        newwearer = interaction.values[0]
                    }
                    await interaction.update(await generateKeyGivingModal(interaction.guildId, interaction.user.id, newwearer, optionparts[4], optionparts[5]));
                }
                if (optionparts[2] == "targetid") {
                    let newtarget = optionparts[4]
                    if (interaction.values) {
                        newtarget = interaction.values[0]
                    }
                    await interaction.update(await generateKeyGivingModal(interaction.guildId, interaction.user.id, optionparts[3], newtarget, optionparts[5]));
                }
            }
            else if (optionparts[1] == "confirm") {
                let wearerid = optionparts[3];
                let targetid = optionparts[4];
                let keybit = optionparts[5];

                // Now we validate the request was GOOD and GENUINE
                let validrestraints = [];

                // Check each restraint individually. We need to verify we have primary key on it, and if a cloning, we need to ensure the target does not already have a clone
                // Chastity
                if ((keybit.charAt(1) == "1") && (getChastity(interaction.guildId, wearerid)?.keyholder == interaction.user.id) && (!getChastity(interaction.guildId, wearerid)?.fumbled)) {
                    if (keybit.charAt(0) == "1") {
                        if (!(getChastity(interaction.guildId, wearerid)?.clonedKeyholders && getChastity(interaction.guildId, wearerid)?.clonedKeyholders.includes(targetid))) {
                            validrestraints.push("chastity");
                        }
                    }
                    else {
                        validrestraints.push("chastity");
                    }
                }
                // Chastity Bra
                if ((keybit.charAt(2) == "1") && (getChastityBra(interaction.guildId, wearerid)?.keyholder == interaction.user.id) && (!getChastityBra(interaction.guildId, wearerid)?.fumbled)) {
                    if (keybit.charAt(0) == "1") {
                        if (!(getChastityBra(interaction.guildId, wearerid)?.clonedKeyholders && getChastityBra(interaction.guildId, wearerid)?.clonedKeyholders.includes(targetid))) {
                            validrestraints.push("chastitybra");
                        }
                    }
                    else {
                        validrestraints.push("chastitybra");
                    }
                }
                // Collar
                if ((keybit.charAt(3) == "1") && (getCollar(interaction.guildId, wearerid)?.keyholder == interaction.user.id) && (!getCollar(interaction.guildId, wearerid)?.fumbled)) {
                    if (keybit.charAt(0) == "1") {
                        if (!(getCollar(interaction.guildId, wearerid)?.clonedKeyholders && getCollar(interaction.guildId, wearerid)?.clonedKeyholders.includes(targetid))) {
                            validrestraints.push("collar");
                        }
                    }
                    else {
                        validrestraints.push("collar");
                    }
                }

                if (validrestraints.length <= 0) {
                    // They somehow selected stuff but cannot actually DO any of these requests. Tell them.
                    await interaction.reply({ content: `You have chosen options which cannot be executed. Please try again.`})
                    return;
                }

                // Determine if we can shortcut the requesting process. 
                let giveauto = false;
                if (((getOption(interaction.guildId, wearerid, "keygiving") == "auto") && (keybit.charAt(0) == "0")) ||
                    ((getOption(interaction.guildId, wearerid, "keycloning") == "auto") && (keybit.charAt(0) == "1"))) {
                    giveauto = true;
                }
                if ((interaction.user.id == wearerid) || (wearerid == targetid)) {
                    // This is us, we are probably okay with what we're about to do. 
                    // Or the wearer is the target, they're probably okay with having
                    // their keys again. Maybe. They might be bondage sluts, who knows.
                    // Regardless, no consent issues here. 
                    giveauto = true;
                }

                // Make restraints text
                let restraintstext = ``;
                if ((keybit.charAt(1) == "1") && validrestraints.includes("chastity")) {
                    restraintstext = `${restraintstext}${process.emojis.chastity}**chastity belt**, `
                }
                if ((keybit.charAt(2) == "1") && validrestraints.includes("chastitybra")) {
                    restraintstext = `${restraintstext}${process.emojis.chastitybra}**chastity bra**, `
                }
                if ((keybit.charAt(3) == "1") && validrestraints.includes("collar")) {
                    restraintstext = `${restraintstext}${process.emojis.collar}**collar**, `
                }
                restraintstext = restraintstext.slice(0,-2)

                await interaction.reply({ content: `${(keybit.charAt(0) == "0") ? "Giving" : "Cloning"} keys...`, flags: MessageFlags.Ephemeral })

                // Set up a collector for the response by sending a DM to the wearer. 
                if (!giveauto) {
                    let outtext = ``;
                    let outend = ``;
                    if (keybit.charAt(0) == "0") {
                        // Give
                        outtext = `<@${interaction.user.id}> would like to give the keys for your `
                        outend = ` to <@${targetid}>. \n*${getPronouns(interaction.guildId, interaction.user.id, "subject", true)} will no longer have access to your restraint*\n\n**Accept** or **Deny** this request below:`
                    }
                    else {
                        // Clone
                        outtext = `<@${interaction.user.id}> would like to clone the keys for your `
                        outend = ` and give the clones to <@${targetid}>.\n\n**Accept** or **Deny** this request below:`
                    }
                    outtext = `${outtext}${restraintstext}${outend}`

                    let confirmdenybuttons = [
                        new ButtonBuilder()
                            .setCustomId(`deny`)
                            .setLabel("Deny")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`confirm`)
                            .setLabel("Accept")
                            .setStyle(ButtonStyle.Success)
                    ];
                    let targetuser = await interaction.guild.members.fetch(targetid)
                    let pagecomponents = [new TextDisplayBuilder().setContent(outtext), new ActionRowBuilder().addComponents(...confirmdenybuttons)]
                    let dmchannel = await targetuser.createDM();
                    try {
                        await dmchannel.send({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] }).then((mess) => {
                            const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });
                            collector.on("collect", async (i) => {
                                if (i.customId == "confirm") {
                                    await mess.delete().then(() => {
                                        i.reply(`Confirmed - <@${targetid}> will receive keys to your restraints!`);
                                    });
                                    let wearertext = (wearerid == interaction.user.id) ? `your` : `<@${wearerid}>'s`
                                    let desttext = (targetid == wearerid) ? `${getPronouns(interaction.guildId, wearerid, "object")}` : `<@${targetid}>`
                                    // Do stuff!
                                    // Chastity
                                    if ((keybit.charAt(1) == "1") && validrestraints.includes("chastity")) {
                                        if (keybit.charAt(0) == "0") { // Give
                                            transferChastityKey(interaction.guildId, wearerid, targetid);
                                        }
                                        else {
                                            cloneChastityKey(interaction.guildId, wearerid, targetid);
                                        }
                                    }
                                    if ((keybit.charAt(2) == "1") && validrestraints.includes("chastitybra")) {
                                        if (keybit.charAt(0) == "0") { // Give
                                            transferChastityBraKey(interaction.guildId, wearerid, targetid);
                                        }
                                        else {
                                            cloneChastityBraKey(interaction.guildId, wearerid, targetid);
                                        }
                                    }
                                    if ((keybit.charAt(3) == "1") && validrestraints.includes("collar")) {
                                        if (keybit.charAt(0) == "0") { // Give
                                            transferCollarKey(interaction.guildId, wearerid, targetid);
                                        }
                                        else {
                                            cloneCollarKey(interaction.guildId, wearerid, targetid);
                                        }
                                    }
                                    interaction.editReply(`${(keybit.charAt(0) == "0") ? `Transferred ` : `Cloned `}keys for ${wearertext} ${restraintstext} to ${desttext}.`)
                                    interaction.followUp(`${interaction.user} ${(keybit.charAt(0) == "0") ? `transfers ` : `clones `}keys for ${(wearerid == interaction.user.id) ? getPronouns(interaction.guildId, interaction.user.id, "possessiveDeterminer") : wearertext} ${restraintstext} and gives them to ${desttext}.`)
                                    return;
                                } else {
                                    await mess.delete().then(() => {
                                        i.reply(`Rejected - <@${targetid}> will NOT receive keys to your restraints!`);
                                        return;
                                    });
                                }
                            });

                            collector.on("end", async (collected) => {
                                // timed out
                                if (collected.length == 0) {
                                    await mess.delete().then(() => {
                                        i.reply(`Timed Out - <@${targetid}> will NOT receive keys to your restraints!`);
                                        return;
                                    });
                                }
                            });
                        })
                    }
                    catch (err) {
                        interaction.editReply(`Failed to send a DM to the wearer either because they've blocked the bot or are not accepting DMs from this server. Keys were not transferred or cloned.`)
                        return;
                    }
                }
                else {
                    let wearertext = (wearerid == interaction.user.id) ? `your` : `<@${wearerid}>'s`
                    let desttext = (targetid == wearerid) ? `${getPronouns(interaction.guildId, wearerid, "object")}` : `<@${targetid}>`
                    // Do stuff!
                    // Chastity
                    if ((keybit.charAt(1) == "1") && validrestraints.includes("chastity")) {
                        if (keybit.charAt(0) == "0") { // Give
                            transferChastityKey(interaction.guildId, wearerid, targetid);
                        }
                        else {
                            cloneChastityKey(interaction.guildId, wearerid, targetid);
                        }
                    }
                    if ((keybit.charAt(2) == "1") && validrestraints.includes("chastitybra")) {
                        if (keybit.charAt(0) == "0") { // Give
                            transferChastityBraKey(interaction.guildId, wearerid, targetid);
                        }
                        else {
                            cloneChastityBraKey(interaction.guildId, wearerid, targetid);
                        }
                    }
                    if ((keybit.charAt(3) == "1") && validrestraints.includes("collar")) {
                        if (keybit.charAt(0) == "0") { // Give
                            transferCollarKey(interaction.guildId, wearerid, targetid);
                        }
                        else {
                            cloneCollarKey(interaction.guildId, wearerid, targetid);
                        }
                    }
                    interaction.editReply(`${(keybit.charAt(0) == "0") ? `Transferred ` : `Cloned `}keys for ${wearertext} ${restraintstext} to ${desttext}.`)
                    interaction.followUp(`${interaction.user} ${(keybit.charAt(0) == "0") ? `transfers ` : `clones `}keys for ${(wearerid == interaction.user.id) ? getPronouns(interaction.guildId, interaction.user.id, "possessiveDeterminer") : wearertext} ${restraintstext} and gives them to ${desttext}.`)
                    return;
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
};
