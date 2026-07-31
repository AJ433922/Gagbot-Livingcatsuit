const { getBaseChastity } = require("../chastity/getBaseChastity");
const { getBaseCollar } = require("../collar/getBaseCollar");
const { getBaseCorset } = require("../corset/getBaseCorset");
const { getBaseGag } = require("../gag/getBaseGag");
const { getBaseHeadwear } = require("../headwear/getBaseHeadwear");
const { getBaseHeavy } = require("../heavy/getBaseHeavy");
const { getBaseMitten } = require("../mitten/getBaseMitten");
const { getBaseToy } = require("../toy/getBaseToy");
const { getBaseWearable } = require("../wearable/getBaseWearable");

/**********
 * Returns the item type as guessed from supplied string, based on if it has a valid getBase___ return.
 * 
 * - (string) itemID || (object) itemID - The item to check
 * ---
 * ##### Returns "wearable", "chastity", "chastitybra", "gag", "corset", "mask", "collar", "heavy", "toy" if known. Undefined if the item does not exist. 
 **********/
function getItemType(itemID) {
    if (typeof itemID === "string") {
        // Passed a string into the function
        if (getBaseWearable(itemID)) {
            return "wearable"
        }
        if (getBaseChastity(itemID) && (getBaseChastity(itemID).category == "Chastity Belt")) {
            return "chastity"
        }
        if (getBaseChastity(itemID) && (getBaseChastity(itemID).category == "Chastity Bra")) {
            return "chastitybra"
        }
        if (getBaseCollar(itemID)) {
            return "collar"
        }
        if (getBaseGag(itemID)) {
            return "gag"
        }
        if (getBaseMitten(itemID)) {
            return "mitten"
        }
        if (getBaseCorset(itemID)) {
            return "corset"
        }
        if (getBaseHeavy(itemID)) {
            return "heavy"
        }
        if (getBaseHeadwear(itemID)) {
            return "mask"
        }
        if (getBaseToy(itemID)) {
            return "toy"
        }
    }
    else {
        // Passed a restraint object
        // Wearable
        /*
        */
        // Chastity
        if (itemID.chastitytype && getBaseChastity(itemID.chastitytype) && (getBaseChastity(itemID.chastitytype).category == "Chastity Belt")) {
            return "chastity"
        }
        if (itemID.chastitytype && getBaseChastity(itemID.chastitytype) && (getBaseChastity(itemID.chastitytype).category == "Chastity Bra")) {
            return "chastitybra"
        }
        if (itemID.collartype && getBaseCollar(itemID.collartype)) {
            return "collar"
        }
        if (itemID.gagtype && getBaseGag(itemID.gagtype)) {
            return "gag"
        }
        if (itemID.mittenname && getBaseMitten(itemID.mittenname)) {
            return "mitten"
        }
        if (itemID.type && getBaseCorset(itemID.type)) {
            return "corset"
        }
        if (itemID.type && getBaseHeavy(itemID.type)) {
            return "heavy"
        }
        // Headwear
        /*
        if (getBaseHeadwear(itemID)) {
            return "mask"
        }*/
        if (itemID.type && getBaseToy(itemID.type)) {
            return "toy"
        }
    }
}

exports.getItemType = getItemType;