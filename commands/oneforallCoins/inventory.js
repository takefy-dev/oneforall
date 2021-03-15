const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const guildInventory = new Map();
const userCoins = new Map();
module.exports = new Command({
    name: 'inventory',
    description: 'Show your inventory | Afficher votre inventaire',
    // Optionnals :
    usage: '!inventory',
    category: 'coins',
    tags: ['guildOnly'],
    aliases: ['inv', 'bag'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async (client, message, args) => {
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    this.connection = StateManager.connection;
    const membersGuildInv = guildInventory.get(message.guild.id);
    if (membersGuildInv) {
        const guildCoins = userCoins.get(message.guild.id);
        if (!guildCoins) return message.channel.send(lang.lb.noCoins)
        const memberInvetory = membersGuildInv.get(message.author.id);
        const formatedInventory = memberInvetory === undefined ?`Inventaire vide` : memberInvetory.map((inv) => `**${inv.item}**  •  x\`${inv.amount}\``)  ; // inv.item == itemName and inv.amount = number of 1 item
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Inventory of ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(formatedInventory)
            .setThumbnail(`https://media.discordapp.net/attachments/747028239884615751/821044567833968710/706473362813091931.gif`)
            .setColor(`${color}`)
            .setFooter(`© OneForAll Coins`)
        message.channel.send(`> **Viewing server inventory • [**  ${message.author.tag} **] •** `, {embed: embed})
    }

});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('inventory', (guildId, userInv) => {
    guildInventory.set(guildId, userInv);
})
StateManager.on('guildCoins', (guildId, coins) => {
    userCoins.set(guildId, coins)
})
