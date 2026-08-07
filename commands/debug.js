const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");
const { getProcessVariable } = require("../functions/getters/config/getProcessVariable");
const { messageSendChannel } = require("../functions/messagefunctions");
const { getRecentChannel } = require("../functions/getters/config/getRecentChannel");
const { markForSave } = require("../functions/other/markForSave");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("debug")
		.setDescription(`Bot Owner Only - Debug command`)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers) // Hide this from most people to limit people who can attempt anyway
        .addSubcommandGroup((group) =>
            group.setName("function")
                .setDescription("Run a specific debug function")
                .addSubcommand((subc) => 
                    subc
                        .setName("mirrorrestraints")
                        .setDescription("Copy currently worn restraints to Gagbot")
                )
                .addSubcommand((subc) => 
                    subc
                        .setName("extendgagbotholds")
                        .setDescription("Extend Gagbot's held key timers")
                        .addUserOption((opt) => 
                            opt.setName("user")
                                .setDescription("Whose keys to extend")
                                .setRequired(true)
                        )
                        .addIntegerOption((opt) =>
                            opt.setName("time")
                                .setDescription("How much time (in seconds) to add")
                                .setRequired(true)
                        )
                ),
        )
        .addSubcommand((subc) =>
            subc.setName("eval")
                .setDescription("Run a Node.js eval on the bot's process")
                .addStringOption((opt) => opt.setName("command").setDescription("What eval to attempt to run...").setRequired(true))
        ),
	async execute(interaction) {
		try {
			if (interaction.user.id !== interaction.client?.application?.owner?.id) {
				await interaction.reply({ content: `You're not ${interaction.client?.application?.owner?.displayName}. Go away.`, flags: MessageFlags.Ephemeral });
				return;
			}
            let subcommand = interaction.options.getSubcommand();
            if (subcommand === "eval") {
                let command = interaction.options.getString("command");
                let res;
                try {
                    res = eval(command);
                } catch (err) {
                    await interaction.reply({ content: err.toString(), flags: MessageFlags.Ephemeral });
                }
                if (res) {
                    if (typeof res === "object") {
                        res = `(Object) ${JSON.stringify(res).slice(0,1900)}`
                    }
                    else if (typeof res === "function") {
                        res = `function`
                    }
                    await interaction.reply({ content: `Eval result: ${res}`, flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: `Command run. No return value.`, flags: MessageFlags.Ephemeral });
                }
            }
			else if (subcommand === "mirrorrestraints") {
                // Copy everything that is on the interaction.user over to Gagbot. This will be a direct memory structuredClone copy. 
                let processvars = ["chastity", "chastitybra", "collar", "heavy", "mitten", "arousal", "gags", "headwear", "corset", "wearable", "toys"]
                processvars.forEach((pv) => {
                    if (getProcessVariable(interaction.guildId, interaction.user.id, pv)) {
                        process[pv][interaction.guildId][process.client.user.id] = structuredClone(getProcessVariable(interaction.guildId, interaction.user.id, pv))
                        markForSave(pv)
                    }
                })
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                messageSendChannel(`${interaction.user} copies her restraints over to ${process.client.user}, restraining it tightly with everything!`, getRecentChannel(interaction.guildId, interaction.user.id).interactionchannelid)
                await interaction.followUp(`Copied restraints to the bot!`)
            }
            else if (subcommand === "extendgagbotholds") {
                let user = interaction.options.getUser("user")
                // Do all the rest of the code for extending gagbot held key timers lol
                // Since lock code is subject to some change, best to do this LATER. 
            }
		} catch (err) {
			console.log(err);
		}
	},
};
