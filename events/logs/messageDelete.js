const StateManager = require('../../utils/StateManager');
const snipes = new Map();
const guildEmbedColor = new Map();
const Event = require('../../structures/Handler/Event');

let logsChannelF = require('../../function/fetchLogs');
const logsChannelId = new Map();
const Discord = require('discord.js')
let embedsColor = require('../../function/embedsColor');

module.exports = class messageDelete extends Event {
  constructor() {
    super({
      name: 'messageDelete',
    });
  }

  async run(client, message) {
    if (!message.author) return;
    if (message.author.bot) return;
    if (!message.guild) return;
    this.connection = StateManager.connection;
    // snipes.clear();
    snipes.set(message.channel.id, {
      content: message.content,
      author: message.author,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null,
      date: new Date().toLocaleString('fr-FR', {dataStyle: 'full', timeStyle: 'short'})
    })
    StateManager.emit('snipes', message.guild.id, snipes)
    const color = message.guild.color
    let logChannelId = logsChannelId.get(message.guild.id);
    let logChannel
    if (logChannelId != undefined) {
      logChannel = client
.guilds.cache.get(message.guild.id).channels.cache.get(logChannelId)


    }
    if (logChannel != undefined && !message.partial && logChannel.guild.id == message.guild.id) {


      let logsEmbed;
      let author;
      let action = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
          }),
          deletionLog = action.entries.first();

      if (!deletionLog) {
        logsEmbed = new Discord.MessageEmbed()
            .setTitle('\`❌\` Suppression de message')
            .setDescription(`
          \`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a supprimé son message \n
            \`\`\`${message.content}\`\`\`
          \`🧾\` ID : ${message.id}

        `)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(`${color}`)
        return logChannel.send(logsEmbed)
      }
      const {executor, target} = deletionLog;

      if (target.id === message.author.id) {
        logsEmbed = new Discord.MessageEmbed()
            .setTitle('\`❌\` Suppression de message')
            .setDescription(`
          \`👨‍💻\` Auteur : **${executor.tag}** \`(${executor.id})\` a supprimé le message de **${message.author.tag}**\`(${message.author.id})\` \n
            \`\`\`${message.content}\`\`\`
          \`🧾\` ID : ${message.id}

        `)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(`${color}`)
        return logChannel.send(logsEmbed);

      } else {
        logsEmbed = new Discord.MessageEmbed()
            .setTitle('\`❌\` Suppression de message')
            .setDescription(`
          \`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a supprimé son message \n
            \`\`\`${message.content}\`\`\`
          \`🧾\` ID : ${message.id}

        `)
            .setTimestamp()
            .setFooter("🕙")
            .setColor(`${color}`)
        return logChannel.send(logsEmbed);
      }


    }


  }
}

logsChannelF(logsChannelId, 'msg');
embedsColor(guildEmbedColor);




