const Discord = require('discord.js');
const NavigationMessage = require('../models/navmessage');

//0️⃣
const keys = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
const arrows = { left: '⬅', right: '➡' };

/**
 * 
 * @param {Discord.Message} msg 
 * @param {NavigationMessage} nav 
 */
function shiftToLinkIndex(msg, nav, offset) {
  nav.currentDisplayedLink += offset;
  nav.save().then(() => {
    msg.edit(nav.resultLinks[nav.currentDisplayedLink]);
    msg.reactions.removeAll();
    msg.react(arrows.left);
    msg.react(arrows.right);
    msg.react(keys[nav.currentDisplayedLink]);
  });
}

/** @param {Discord.Client} client */
function init(client) {

  // listen for reactions for youtube navigation
  client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) return;
    let msg = reaction.message;
    let messageID = msg.id;
    try {

      NavigationMessage.getFromCache(messageID).then(nav => {
        if (!nav || nav.authorID !== user.id) return;

        if (reaction.emoji.name === arrows.left) {
          if (nav.currentDisplayedLink > 0) {
            shiftToLinkIndex(msg, nav, -1);
          }
        }

        else if (reaction.emoji.name === arrows.right) {
          if (nav.currentDisplayedLink < 10) {
            shiftToLinkIndex(msg, nav, 1);
          }
        }

      });

    } catch (err) {}
  });

  return new Promise(res => res());

}

module.exports = {
  init
}
