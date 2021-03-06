const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')

module.exports = new Command({
    name: 'shop',
    description: 'Show the shop / Add or remove item to the shop | Afficher le magasin / Ajouter ou supprimer des objet dans le shop',
    // Optionnals :
    usage: '!shop [add/remove]',
    category: 'coins',
    tags: ['guildOnly'],
    aliases: ['store', 'magasin'],
    clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    cooldown: 3
}, async(client, message, args) => {
    let owner = message.guild.ownerID;
    
    if(client.BotPerso){
        owner = process.env.OWNER
    }
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    if(args[0] === 'add'){
        if(!client.isGuildOwner(message.guild.id, message.author.id) || owner !== message.author.id) return message.channel.send()
    }
});

embedsColor(guildEmbedColor);
langF(guildLang);
