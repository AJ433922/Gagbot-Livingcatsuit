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
                let chosenuserid = interaction.options.get("user")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                let heavybondage = getHeavy(interaction.guildId, chosenuserid)?.lock;
                let gagbondage = getGagLast(interaction.guildId, chosenuserid)?.lock;
                let mittenbondage = getMitten(interaction.guildId, chosenuserid)?.lock;
                let chastitybondage = getChastity(interaction.guildId, chosenuserid)?.lock;
                let chastitybrabondage = getChastityBra(interaction.guildId, chosenuserid)?.lock
                let headbondage = getHeadwear(interaction.guildId, chosenuserid)?.lock;
                let corsetbondage = getCorset(interaction.guildId, chosenuserid)?.lock;
                let collarbondage = getCollar(interaction.guildId, chosenuserid)?.lock;

                let outopts = [];
                if (heavybondage) {
                    outopts.push({ name: `Heavy Bondage: ${getHeavy(interaction.guildId, chosenuserid).displayname}`, value: getHeavy(interaction.guildId, chosenuserid).type });
                }
                if (gagbondage) {
                    outopts.push({ name: `Gag: ${convertGagText(getGagLast(interaction.guildId, chosenuserid))}`, value: getGag(interaction.guildId, chosenuserid).gagtype });
                }
                if (mittenbondage) {
                    outopts.push({ name: `Mittens${mittenbondage.mittenname ? `: ${getMittenName(interaction.guildId, chosenuserid)}` : ""}`, value: getMitten(interaction.guildId, chosenuserid).mittenname });
                }
                if (chastitybondage) {
                    outopts.push({ name: `Chastity${chastitybondage.chastitytype ? `: ${getChastityName(interaction.guildId, chosenuserid)}` : " Belt"}`, value: getChastity(interaction.guildId, chosenuserid).chastitytype });
                }
                if (chastitybrabondage) {
                    outopts.push({ name: `Chastity Bra${chastitybrabondage.chastitytype ? `: ${getChastityBraName(interaction.guildId, chosenuserid)}` : " Bra"}`, value: getChastityBra(interaction.guildId, chosenuserid).chastitytype });
                }
                if (headbondage && headbondage.length > 0) {
                    outopts.push({ name: `Head Restraints`, value: getHeadwear(interaction.guildId, chosenuserid)[0] });
                }
                if (corsetbondage) {
                    outopts.push({ name: `Corset`, value: getCorset(interaction.guildId, chosenuserid).type });
                }
                if (collarbondage) {
                    outopts.push({ name: `Collar${collarbondage.collartype ? `: ${getCollarName(interaction.guildId, chosenuserid)}` : ""}`, value: getCollar(interaction.guildId, chosenuserid).collartype });
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