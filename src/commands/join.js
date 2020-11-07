const Discord = require('discord.js');

module.exports = {
  label: 'join',
  description: 'Add bot to your current voice channel.',
  args: 0,
  permission: Discord.Permissions.FLAGS.CONNECT,
  /**
   * 
   * @param {Array<String>} args 
   * @param {Discord.Message} msg 
   * @param {Discord.Client} client 
   */
  execute(args, msg, client) {
    let voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
      let embed = new Discord.MessageEmbed()
      .setTitle('Error')
      .setDescription('You need to be in a voice\nchannel to add the bot.')
      .setFooter('Bot by MakotoMiyamoto#0215');
      msg.channel.send(embed);
      return;
    }

    voiceChannel.join();

  }
}