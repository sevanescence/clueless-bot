const Discord = require('discord.js');

module.exports = {
  label: 'ping',
  description: 'Test latency of the bot.',
  permission: Discord.Permissions.FLAGS.SEND_MESSAGES,
  canDM: true,
  /**
   * 
   * @param {ArrayM<String>} args 
   * @param {Discord.Message} msg 
   * @param {Discord.Client} client 
   */
  execute(args, msg, client) {
    msg.channel.send('pinging...').then(pingMessage => {
      // 50 subtracted for time error
      let latency = Math.abs(pingMessage.createdTimestamp - msg.createdTimestamp - 50);
      let embed = new Discord.MessageEmbed()
      .setTitle('Latency')
      .setColor(latency > 300 ? '#9c403e': latency > 80 ? '#ccc14b' : '#65a64e')
      .setDescription(`**${latency}ms**`)
      .setFooter('Bot by MakotoMiyamoto#0215');
      msg.channel.send(embed);
    });
  }
}