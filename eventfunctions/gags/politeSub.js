const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel")
const { getUserVar } = require("../../functions/getters/config/getUserVar")
const { messageSendChannel } = require("../../functions/messagefunctions")
const { setUserVar } = require("../../functions/setters/config/setUserVar")
const { honorifictitles } = require("../../lists/politetitles")

async function tick(serverID, userID, data) {
    // Remind them on the third infraction and reset
    if ((getUserVar(serverID, userID, "politeSubSilences") > 2) && getRecentChannel(serverID, userID).valid) {
        let honorifictitlespart = honorifictitles.slice(0).sort(() => (0.5 - Math.random())) // Full random sort
        honorifictitlespart = honorifictitlespart.filter((f) => { return (!f.endsWith("s")) }) // Filter out any plural titles
        honorifictitlespart = honorifictitlespart.map((f) => { return `${f.slice(0,1).toUpperCase()}${f.slice(1)}`}) // capitalize the first letter of every title
        honorifictitlespart = honorifictitlespart.map((f) => { return `${f.replace("(\\w|\\d)+", "\\_\\_\\_")}` }) // if a Japanese honorific, remove the regex

        let num = Math.min(Math.floor(honorifictitlespart.length * Math.random()), honorifictitlespart.length - 4)
        honorifictitlespart = honorifictitlespart.slice(num, num + 3)

        messageSendChannel(`<@${userID}> should speak with titles to people, such as ${honorifictitlespart.join(", ")} and the like.`, getRecentChannel(serverID, userID).channelid)
        setUserVar(serverID, userID, "politeSubSilenceTime", undefined)
        setUserVar(serverID, userID, "politeSubSilences", undefined)
    }
    if (getUserVar(serverID, userID, "politeSubSilenceTime") < Date.now()) {
        console.log(`Clearing silence timer for ${userID}`)
        setUserVar(serverID, userID, "politeSubSilenceTime", undefined)
        setUserVar(serverID, userID, "politeSubSilences", undefined)
    }
}

exports.tick = tick;