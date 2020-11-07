const Discord = require('discord.js');
const CurrentDispatch = require('../services/currentdispatch');

module.exports = {
  label: 'skip',
  args: 0,
  /**
   * 
   * @param {Array<String>} args 
   * @param {Discord.Message} msg 
   * @param {Discord.Client} client 
   */
  execute(args, msg, client) {
    let dispatcher = CurrentDispatch.meta.dispatchers.get(msg.guild.id);
    if (dispatcher) {
      dispatcher.end();
      msg.channel.send({
        embed: {
          title: 'Clueless Bot - Youtube Play',
          description: 'Song skipped.',
          color: '#19647d',
          footer: 'Bot by MakotoMiyamoto#0215'
        }
      });
    }
  }
}