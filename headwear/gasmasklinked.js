// Strictly speaking, this is unnecessary for most of these. 
// But some are going to use extra properties! 
exports.name = "Gasmask (Linked)";

exports.tags = ["latex"];

exports.blockgag = true;

// Remove the shared hose if it is present
exports.onUnlock = (data) => {
    return true // No longer need to delete anything on the headwear object because sharedbreathhose is attached to the gasmask object. 
}

exports.itemdescription = `The **Gasmask (Linked)** will share your arousal over time with the person you give your hose to so you both balance out. They must also give their hose to you to link them.`

exports.hidden = false; // Disable it from showing in the list!