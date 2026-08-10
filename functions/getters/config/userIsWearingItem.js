const { getBaseChastity } = require("../chastity/getBaseChastity");
const { getChastity } = require("../chastity/getChastity");
const { getChastityBra } = require("../chastity/getChastityBra");
const { getBaseCollar } = require("../collar/getBaseCollar");
const { getCollar } = require("../collar/getCollar");
const { getBaseCorset } = require("../corset/getBaseCorset");
const { getCorset } = require("../corset/getCorset");
const { getBaseGag } = require("../gag/getBaseGag");
const { getGags } = require("../gag/getGags");
const { getBaseHeadwear } = require("../headwear/getBaseHeadwear");
const { getHeadwear } = require("../headwear/getHeadwear");
const { getSpecificHeadwear } = require("../headwear/getSpecificHeadwear");
const { getBaseHeavy } = require("../heavy/getBaseHeavy");
const { getHeavy } = require("../heavy/getHeavy");
const { getHeavyList } = require("../heavy/getHeavyList");
const { getBaseMitten } = require("../mitten/getBaseMitten");
const { getMitten } = require("../mitten/getMitten");
const { getBaseToy } = require("../toy/getBaseToy");
const { getSpecificToy } = require("../toy/getSpecificToy");
const { getToys } = require("../toy/getToys");
const { getBaseWearable } = require("../wearable/getBaseWearable");
const { getWearable } = require("../wearable/getWearable");

/********
 * Given an item by ID, check if the user is wearing that item.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user who is wearing the item
 * - (string) itemID - The item ID to check
 * ---
 * ##### Returns true if they are wearing it, false if they're not. 
 ********/
function userIsWearingItem(serverID, userID, itemID) {
    if (getBaseWearable(itemID)) {
        return (getWearable(serverID, userID).includes(itemID));
    }
    if (getBaseChastity(itemID) && (getBaseChastity(itemID).category == "Chastity Belt")) {
        return (getChastity(serverID, userID)?.chastitytype == itemID)
    }
    if (getBaseChastity(itemID) && (getBaseChastity(itemID).category == "Chastity Bra")) {
        return (getChastityBra(serverID, userID)?.chastitytype == itemID)
    }
    if (getBaseCollar(itemID)) {
        return (getCollar(serverID, userID)?.collartype == itemID)
    }
    if (getBaseGag(itemID)) {
        return (getGags(serverID, userID).find((g) => g.gagtype == itemID))
    }
    if (getBaseMitten(itemID)) {
        return (getMitten(serverID, userID)?.mittenname == itemID)
    }
    if (getBaseCorset(itemID)) {
        return (getCorset(serverID, userID)?.type == itemID)
    }
    if (getBaseHeavy(itemID)) {
        return (getHeavyList(serverID, userID)?.find((h) => h.type == itemID))
    }
    if (getBaseHeadwear(itemID)) {
        return (getSpecificHeadwear(serverID, userID, itemID));
    }
    if (getBaseToy(itemID)) {
        return (getSpecificToy(serverID, userID, itemID))
    }
}

exports.userIsWearingItem = userIsWearingItem;