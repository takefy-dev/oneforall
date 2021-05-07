const userCoins = new Map();
const coinSettings = new Map();
const guildShop = new Map();
const guildInventory = new Map();
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'buy',
            description: 'Buy an item from the shop | Acheter un item du magasin',
            // Optionnals :
            usage: 'buy <itemId>',
            category: 'coins',
            tags: ['guildOnly'],
            aliases: ['acheter'],
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 4
        });
    }

    async run(client, message, args) {
        if (!message.guild.config.coinsOn) return;
        const color = message.guild.color
        const lang = client.lang(message.guild.lang)

        const idToBuy = args[0];
        if (!message.guild.config.coinsOn) return message.channel.send(lang.buy.shoDisable).then(mp => mp.delete({timeout: 4000}))
        if (!args[0]) {
            const showShop = (shop) => {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)
                    .setDescription(lang.addShop.shopDesc(message.guild.name))
                    .addField('\u200b', shop.map(shop => !shop.price ? lang.addShop.nothingInShop : `\`${shop.id}\` ${shop.item} — [⏣ ${shop.price.toLocaleString()}](https://discord.gg/n2EvRECf88) coins`))
                    .setColor(`${color}`)
                    .setTimestamp()
                    .setFooter(`⏣ OneForAll coins`);


                return message.channel.send(embed)
            }
            return showShop(message.guild.shop)
        }
        if (!idToBuy) return message.channel.send(lang.buy.syntaxError).then(mp => mp.delete({timeout: 4000}))
        const shop = message.guild.shop;
        let coins = message.member.coins
        if (!coins) return message.channel.send(lang.buy.noCoins).then(mp => mp.delete({timeout: 4000}));
        if (coins < 1 || !coins) return message.channel.send(lang.buy.noCoins).then(mp => mp.delete({timeout: 4000}));
        if (shop.find(shop => shop.id === 0)) return message.channel.send(lang.buy.nothingInShop).then(mp => mp.delete({timeout: 4000}));
        if (shop.length < parseInt(idToBuy) || parseInt(idToBuy) < 1) return message.channel.send(lang.buy.itemNotInShop).then(mp => mp.delete({timeout: 4000}));

        const {price, role, item} = shop.filter(shop => shop.id === parseInt(idToBuy))[0]
        if (price > coins) return message.channel.send(lang.buy.notEnoughCoins).then(mp => mp.delete({timeout: 4000}));
        let roleCol;
        coins -= price

        if (role) {
            roleCol = message.guild.roles.cache.get(item.replace('<@&', '').replace('>', ''));

            if (message.member.roles.cache.has(roleCol.id)) return message.channel.send(lang.buy.alreadyRole).then(mp => mp.delete({timeout: 4000}))


            message.channel.send(lang.buy.success(`**${roleCol.name}**`, price)).then((mp) => {
                mp.delete({timeout: 4000})
                message.member.roles.add(roleCol.id, `Coins shop`)
            })
        } else {

            message.channel.send(lang.buy.success(item, price)).then(() => {
                let memberInvetory = message.member.inventory
                const itemBuyed = shop.filter(shop => shop.id === parseInt(idToBuy))[0]

                let messageMemberInvetory = message.member.inventory
                if (messageMemberInvetory) { // if already member has a inv
                    // [{}, {}, {}, {}, {}, {}, {}, {}, {}]
                    console.log(messageMemberInvetory)

                    let itemOccurence = messageMemberInvetory.filter(inv => inv.id === itemBuyed.id);


                    if (itemOccurence[0] && itemOccurence[0].amount >= 1) {
                        const itemOccurenceCount = itemOccurence[0].amount;

                        itemOccurence[0].amount = itemOccurenceCount + 1;

                    } else {
                        messageMemberInvetory.push(itemBuyed);
                    }


                    message.member.updateInventory = messageMemberInvetory
                } else {
                    console.log('created')
                    message.member.createInventory([itemBuyed])
                }


            })
        }
        message.member.updateCoins = coins;

        const logsChannel = message.guild.channels.cache.get(message.guild.config.coinsLogs);
        if (logsChannel && logsChannel.manageable && !logsChannel.deleted) {
            const embed = new Discord.MessageEmbed()
                .setDescription(lang.buy.buyLog(message.member, !roleCol ? item : roleCol.name, price))
                .setTimestamp()
                .setColor(`${color}`)
            logsChannel.send(embed)
        }


    }
};

