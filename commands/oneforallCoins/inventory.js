const StateManager = require('../../utils/StateManager');

const guildInventory = new Map();
const userCoins = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'inventory',
            description: 'Show your inventory | Afficher votre inventaire',
            // Optionnals :
            usage: 'inventory',
            category: 'coins',
            aliases: ['inv', 'bag'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        if (!message.guild.config.coinsOn) return;

        const color = message.guild.color
        const lang = client.lang(message.guild.lang)

        const memberInvetory = message.member.inventory
        const formatedInventory = !memberInvetory? `Inventaire vide` : memberInvetory.map((inv) => `**${inv.item}**  •  x\`${inv.amount}\``); // inv.item == itemName and inv.amount = number of 1 item
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Inventory of ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(formatedInventory)
            .setThumbnail(`https://media.discordapp.net/attachments/747028239884615751/821044567833968710/706473362813091931.gif`)
            .setColor(`${color}`)
            .setFooter(`© OneForAll Coins`)
        message.channel.send(`> **Viewing server inventory • [**  ${message.author.tag} **] •** `, {embed: embed})

    }
}
