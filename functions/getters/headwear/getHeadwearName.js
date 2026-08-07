const { getBaseHeadwear } = require("./getBaseHeadwear");

/**********
 * Gets the full name of a piece of headwear
 * 
 * - (string) headnname - The string ID of the headgear
 * ---
 * ##### Returns a string with the full name of the headwear
 **********/
function getHeadwearName(headnname) {
    return getBaseHeadwear(headnname)?.name
}

exports.getHeadwearName = getHeadwearName;