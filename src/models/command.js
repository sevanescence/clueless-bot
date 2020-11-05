const Discord = require('discord.js');
const path = require('path');
const fs = require('fs');

const commandTemplate = {
  label: 'test',
  description: 'test',
  args: 0,
  permission: 8,
  canDM: true,
  /**
   * 
   * @param {Array<String>} args 
   * @param {Discord.Message} msg 
   * @param {Discord.Client} client 
   */
  execute (args, msg, client) {}
}

class CommandManager {
  /** @type {Map<String, commandTemplate>} */
  commands = {};

  constructor() {
    this.commands = new Map();
  }

  /** @param {String} param Directory to list of commands */
  init(dir) {
    // get list of commands and require, add to map
    // make sure to set defaults for commands
    return new Promise(res => {
      const commandFiles = fs.readdirSync(dir);
      for (let file of commandFiles) {
        let command = require(path.join(dir, file));
        this.commands.set(command.label, command);
      }
      res();
    });
  }

  /**
   * 
   * @param {commandTemplate} cmd 
   * @param {Discord.Message} msg 
   */
  handleArgs(cmd, msg) {
    // unsplit arg example: ".c ping" .c is prefix, ping is header
    let args = [];
    if (cmd.args > 0) {
      let cutPrefix = msg.content.replace(/^.+?\s.+?(\s|$)/g, '');
      if (cutPrefix.length === 0)
        return []; // try to make this a tad cleaner, sometime
      args = cutPrefix.split(/\s/);
      let newArgs = [];
      for (let i = 0; i < cmd.args; i++) {
        newArgs.push(args.shift());
      }
      for (let arg of args) {
        newArgs[newArgs.length-1] += ` ${arg}`;
      }
      return newArgs;
    }
    return args;
  }

  /**
   * Attempt to run a command.
   * @param {String} label
   * @param {Discord.Message} msg
   * @param {Discord.Client} client
   */
  tryCommand(label, msg, client) {
    // in a later update, handle fetching the label here, instead.
    let cmd = this.commands.get(label);
    if (cmd) {
      let args = this.handleArgs(cmd, msg);
      if (msg.channel.type !== 'dm') {
        let guild = msg.guild;
        let guildMember = guild.members.resolve(msg.author.id);
        if (guildMember.hasPermission(cmd.permission)) {
          cmd.execute(args, msg, client);
        }
      } else if (cmd.canDM) {
        cmd.execute(args, msg, client);
      }
      // // player doesnt have permission
      // msg.channel.send('You do not have permission to use this command.');
    }
  }

}

module.exports = CommandManager;