const { SlashCommandBuilder, TextDisplayBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");
const { handleConsent } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getGagLast } = require("../functions/getters/gag/getGagLast.js");
const { getMitten } = require("../functions/getters/mitten/getMitten.js");
const { getChastity } = require("../functions/getters/chastity/getChastity.js");
const { getChastityBra } = require("../functions/getters/chastity/getChastityBra.js");
const { getHeadwear } = require("../functions/getters/headwear/getHeadwear.js");
const { getCorset } = require("../functions/getters/corset/getCorset.js");
const { getCollar } = require("../functions/getters/collar/getCollar.js");
const { convertGagText } = require("../functions/getters/gag/getGagName.js");
const { getMittenName } = require("../functions/getters/mitten/getMittenName.js");
const { getChastityName } = require("../functions/getters/chastity/getChastityName.js");
const { getChastityBraName } = require("../functions/getters/chastity/getChastityBraName.js");
const { getCollarName } = require("../functions/getters/collar/getCollarName.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { statsAddCounter } = require("../functions/setters/config/statsAddCounter.js");
const { getGag } = require("../functions/getters/gag/getGag.js");
const { addLockModal } = require("../functions/lockfunctions.js");
const { handleRemoveLock } = require("../functions/lockfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getOption } = require("../functions/getters/config/getOption.js");
const { getTaggedList } = require("../functions/getters/config/getTaggedList.js");
const { getBaseLock } = require("../functions/getters/lock/getBaseLock.js");
const { getBaseItem } = require("../functions/getters/config/getBaseItem.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unlock")
		.setDescription("Remove a lock from a restraint...")
        .addUserOption((opt) => opt.setName("user").setDescription("The person wearing the restraint to unlock"))
        .addStringOption((opt) => opt.setName("restraint").setDescription("Which restraint to unlock?").setAutocomplete(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // Temporary measure to ensure this isn't leaked yet!
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(true); // Note, we're extracting the entire object this time. 

        // Choosing the restraint we're focused on. 
        if (focusedValue.name == "restraint") {
            try {
                let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                let heavybondage = getHeavyList(interaction.guildId, chosenuserid);
                let gagbondage = getGags(interaction.guildId, chosenuserid);
                let mittenbondage = getMitten(interaction.guildId, chosenuserid);
                let chastitybondage = getChastity(interaction.guildId, chosenuserid);
                let chastitybrabondage = getChastityBra(interaction.guildId, chosenuserid)
                let headbondage = getHeadwear(interaction.guildId, chosenuserid);
                let corsetbondage = getCorset(interaction.guildId, chosenuserid);
                let collarbondage = getCollar(interaction.guildId, chosenuserid);

                let outopts = [];
                if (heavybondage && heavybondage.length > 0) {
                    heavybondage.forEach((h) => {
                        if (h.lock && getBaseLock(h.lock.locktype).canUnlock({ uuid: h.lock.uuid, keyholderID: interaction.user.id })) {
                            outopts.push({ name: `Heavy Bondage: ${h.displayname}`, value: h.type });
                        }
                    })
                }
                if (gagbondage && (gagbondage.length > 0)) {
                    gagbondage.forEach((g) => {
                        if (g.lock && getBaseLock(h.lock.locktype).canUnlock({ uuid: h.lock.uuid, keyholderID: interaction.user.id })) {
                            outopts.push({ name: `Gag: ${convertGagText(g.gagtype)}`, value: g.gagtype });
                        }
                    })
                }
                if (mittenbondage && mittenbondage.lock && getBaseLock(mittenbondage.lock.locktype).canUnlock({ uuid: mittenbondage.lock.uuid, keyholderID: interaction.user.id })) {
                    outopts.push({ name: `Mittens: ${getBaseMitten(mittenbondage.mittenname).name}`, value: mittenbondage.mittenname });
                }
                if (chastitybondage && chastitybondage.lock && getBaseLock(chastitybondage.lock.locktype).canUnlock({ uuid: chastitybondage.lock.uuid, keyholderID: interaction.user.id })) {
                    outopts.push({ name: `Chastity: ${getBaseChastity(chastitybondage.chastitytype).name}`, value: chastitybondage.chastitytype });
                }
                if (chastitybrabondage && chastitybrabondage.lock && getBaseLock(chastitybrabondage.lock.locktype).canUnlock({ uuid: chastitybrabondage.lock.uuid, keyholderID: interaction.user.id })) {
                    outopts.push({ name: `Chastity Bra: ${getBaseChastity(chastitybrabondage.chastitytype).name}`, value: chastitybrabondage.chastitytype });
                }
                if (headbondage && headbondage.length > 0) {
                    headbondage.forEach((h) => {
                        if (h.lock && getBaseLock(h.lock.locktype).canUnlock({ uuid: h.lock.uuid, keyholderID: interaction.user.id })) {
                            outopts.push({ name: `Head Restraints: ${getBaseHeadwear(h.type).name}`, value: h.type });
                        }
                    })
                }
                if (corsetbondage && corsetbondage.lock && getBaseLock(corsetbondage.lock.locktype).canUnlock({ uuid: corsetbondage.lock.uuid, keyholderID: interaction.user.id })) {
                    outopts.push({ name: `Corset: ${getBaseCorset(corsetbondage.type).name}`, value: corsetbondage.type });
                }
                if (collarbondage && collarbondage.lock && getBaseLock(collarbondage.lock.locktype).canUnlock({ uuid: collarbondage.lock.uuid, keyholderID: interaction.user.id })) {
                    outopts.push({ name: `Collar: ${getBaseCollar(collarbondage.collartype).name}`, value: collarbondage.collartype });
                }

                if (outopts.length == 0) {
                    outopts = [{ name: "Nothing", value: "nothing" }];
                } 
                await interaction.respond(outopts);
            } 
            catch (err) {
                console.log(err);
            }
        }
	},
    async execute(interaction) {
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral })
            handleRemoveLock(interaction);
        }
        catch (err) {
            console.log(err);
        }
    }
}