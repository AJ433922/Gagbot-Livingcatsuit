const { getHeavy } = require("../../functions/getters/heavy/getHeavy");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { addArousal } = require("../../functions/setters/arousal/addArousal");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { setUserVar } = require("../../functions/setters/config/setUserVar");
const { getPronouns } = require("../../functions/getters/config/getPronouns");

const TRIGGER_CHANCE = 0.20;
const AROUSAL_AMOUNT = 0.4;
const BLOCK_DURATION_MS = 45 * 1000;

async function msgfunction(serverID, userID, data) {
    const heavy = getHeavy(serverID, userID, "livingcatsuit");
    if (!heavy) return;

    if (Math.random() >= TRIGGER_CHANCE) return;

    const channel = getRecentChannel(serverID, userID);
    if (!channel?.valid) return;

    const pronouns = getPronouns(serverID, userID);
    const isBlock = Math.random() < 0.5;

    if (isBlock) {
        setUserVar(serverID, userID, "livingcatsuit_blocked_until", Date.now() + BLOCK_DURATION_MS);

        messageSendChannel(
            `<@${userID}>'s living catsuit suddenly constricts, locking ${pronouns.object} in place for a moment...`,
            channel.channelid
        );
    } else {
        addArousal(serverID, userID, AROUSAL_AMOUNT);

        const messages = [
            `The living catsuit squirms against <@${userID}>, its surface groping and teasing ${pronouns.object}...`,
            `A wave of sensation runs through <@${userID}> as the catsuit tightens and caresses sensitive spots.`,
            `The latex shifts and presses firmly against <@${userID}>, sending a jolt of arousal through ${pronouns.object}.`,
        ];
        messageSendChannel(messages[Math.floor(Math.random() * messages.length)], channel.channelid);
    }
}

exports.msgfunction = msgfunction;
