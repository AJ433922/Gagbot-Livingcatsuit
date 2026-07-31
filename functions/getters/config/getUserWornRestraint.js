const { getChastity } = require("../chastity/getChastity");
const { getChastityBra } = require("../chastity/getChastityBra");
const { getCollar } = require("../collar/getCollar");
const { getCorset } = require("../corset/getCorset");
const { getGag } = require("../gag/getGag");
const { getHeadwear } = require("../headwear/getHeadwear");
const { getHeavy } = require("../heavy/getHeavy");
const { getMitten } = require("../mitten/getMitten");
const { getSpecificToy } = require("../toy/getSpecificToy");
const { getWearable } = require("../wearable/getWearable");

/******
 * Given a type, attempts to get the worn restraint in that slot, optionally the specific restraint if specified.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is for
 * - (string) restraint - The type of restraint
 * - (string) specific? - The specific restraint if multiple in that slot. 
 ******/
function getUserWornRestraint(serverID, userID, restraint, specific = undefined) {
    switch(restraint) {
        case "wearable":
            return getWearable(serverID, userID);
        case "chastity":
            return getChastity(serverID, userID);
        case "chastitybra":
            return getChastityBra(serverID, userID);
        case "collar":
            return getCollar(serverID, userID);
        case "gag":
            return getGag(serverID, userID, specific)
        case "mitten":
            return getMitten(serverID, userID)
        case "corset":
            return getCorset(serverID, userID);
        case "heavy":
            return getHeavy(serverID, userID, specific);
        case "mask":
            return getHeadwear(serverID, userID)
        case "toy":
            return getSpecificToy(serverID, userID, specific);
        default:
            console.log(`Unknown restraint type - ${restraint}`)
            break;
    }
}

exports.getUserWornRestraint = getUserWornRestraint;