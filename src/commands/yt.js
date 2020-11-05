const Discord = require('discord.js');
const ytSearch = require('youtube-search');
const NavigationMessage = require('../models/navmessage');

module.exports = {
  label: 'yt',
  description: 'Search for a video on YouTube.',
  args: 1,
  permission: Discord.Permissions.FLAGS.SEND_MESSAGES,
  /**
   * @param {Array<String>} args
   * @param {Discord.Message} msg
   * @param {Discord.Client} client
   */
  execute(args, msg, client) {
    let embed = new Discord.MessageEmbed()
    .setColor('#c4302b')
    .setFooter('Bot by MakotoMiyamoto#0215');
    if (args.length === 0) {
      embed.setDescription(`Not enough args. Try searching for a video.\n`
      + `Example: \`.c yt HTTP requests in NodeJS\``);
      msg.channel.send(embed);
      return;
    }
    // if title is provided
    // implement navigation feature
    let search = args[0];
    ytSearch(search, { maxResults: 10, key: process.env.YT_API_KEY }, (err, res) => {
      if (err) return console.log(err);
      msg.channel.send(res[0].link).then(message => {
        message.react('⬅');
        message.react('➡');
        message.react('1️⃣');
        let links = [];
        for (let i of res) {
          links.push(i.link);
        }
        let nav = new NavigationMessage(links, message.id, msg.author.id);
        nav.save();
      });
    });
  }
}