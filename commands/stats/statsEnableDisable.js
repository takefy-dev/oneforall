const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'stats',
    description: 'Enable or disable stats | Activer ou désactiver les stats',
    // Optionnals :
    usage: '!stats <on/off>',
    category: 'stats',
    tags: ['guildOnly'],
    userPermissions: ['ADMINISTRATOR'],
    cooldown: 3
}, async(client, message, args) => {
    return;
    this.connection = StateManager.connection;
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    if(args[0] === "on"){
        await this.connection.query(`UPDATE guildConfig SET statsOn = '1' WHERE guildId = '${message.guild.id}'`).then(() => {
            message.channel.send(lang.stats.enable).then(mp => mp.delete({ timeout: 4000 }))
            StateManager.emit('statsOnU', message.guild.id, '1')
        })
    }else if(args[0] === "off"){
        await this.connection.query(`UPDATE guildConfig SET statsOn = '0' WHERE guildId = '${message.guild.id}'`).then(() => {
            message.channel.send(lang.stats.disable).then(mp => mp.delete({ timeout: 4000 }))
        })
        StateManager.emit('statsOnU', message.guild.id, '0')
        
    }
});

embedsColor(guildEmbedColor);
langF(guildLang);
