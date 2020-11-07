const Discord = require('discord.js');
const SongQueue = require('../models/songqueue');

module.exports = {
  label: 'leave',
  description: 'Remove bot from voice channel.',
  args: 0,
  permission: Discord.Permissions.FLAGS.CONNECT,
  /**
   * 
   * @param {Array<String>} args 
   * @param {Discord.Message} msg 
   * @param {Discord.Client} client 
   */
  execute(args, msg, client) {
    // let channel = msg.member.voice.channel;
    // channel.leave();
    let botConnection = msg.guild.member(client.user.id).voice.channel;
    if (botConnection) {
      botConnection.leave();
      SongQueue.getFromCache(msg.guild.id).then(songQueue => {
        if (songQueue) {
          songQueue.destroy().then(() => {
            let queueEmbed = new Discord.MessageEmbed()
            .setTitle('Clueless Bot - Youtube Play')
            .setDescription(`Queue deleted.`)
            .setColor('#19647d')
            .setFooter('Bot by MakotoMiyamoto#0215');
            msg.channel.send(queueEmbed);
          });
        }
      });
    }
  }
}