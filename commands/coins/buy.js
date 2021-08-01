const Discord = require('discord.js')

module.exports = {

    name: 'buy',
    description: 'Buy an item from the shop | Acheter un item du magasin',
    // Optionnals :
    usage: 'buy <itemId>',
    category: 'coins',
    tags: ['guildOnly'],
    aliases: ['acheter'],
    clientPermissions: ['EMBED_LINKS'],
    coinsonly: true,
    cooldown: 4,


    run: async (client, message, args) => {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        const idToBuy = args[0];
        const shop = guildData.get('coinsShop');
        const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${message.author.id}`)
        if (!args[0]) {
            const showShop = (shop) => {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)
                    .setDescription(lang.addShop.shopDesc(message.guild.name))
                    .addField('\u200b', shop.map(shop => !shop.price ? lang.addShop.nothingInShop : `\`${shop.id}\` ${shop.item} — [⏣ ${shop.price.toLocaleString()}](https://discord.gg/n2EvRECf88) coins`))
                    .setColor(`${color}`)
                    .setTimestamp()
                    .setFooter(`⏣ OneForAll coins`);


                return message.channel.send({embeds: [embed]})
            }
            return showShop(shop)
        }
        if (!idToBuy) return message.channel.send(lang.buy.syntaxError).then(mp => mp.delete({timeout: 4000}))
        let coins = userData.get('coins')
        if (!coins) return message.channel.send(lang.buy.noCoins).then(mp => mp.delete({timeout: 4000}));
        if (coins < 1 || !coins) return message.channel.send(lang.buy.noCoins).then(mp => mp.delete({timeout: 4000}));
        if (shop.find(shop => shop.id === 0)) return message.channel.send(lang.buy.nothingInShop).then(mp => mp.delete({timeout: 4000}));
        if (shop.length < parseInt(idToBuy) || parseInt(idToBuy) < 1) return message.channel.send(lang.buy.itemNotInShop).then(mp => mp.delete({timeout: 4000}));

        const {price, role, item} = shop.find(shop => shop.id === parseInt(idToBuy))
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
                let memberInvetory = userData.get('inventory')
                const itemBuyed = shop.find(shop => shop.id === parseInt(idToBuy))

                if (memberInvetory) { // if already member has a inv
                    // [{}, {}, {}, {}, {}, {}, {}, {}, {}]
                    console.log(memberInvetory)

                    let itemOccurence = memberInvetory.find(inv => inv.id === itemBuyed.id);


                    if (itemOccurence && itemOccurence.amount >= 1) {
                        const itemOccurenceCount = itemOccurence.amount;

                        itemOccurence.amount = itemOccurenceCount + 1;

                    } else {
                        memberInvetory.push(itemBuyed);
                    }


                    userData.set('inventory', memberInvetory).save()
                } else {
                    console.log('created')
                    userData.set('inventory', [itemBuyed]).save()
                }


            })
        }
        message.member.updateCoins = coins;

        const logsChannel = message.guild.channels.cache.get(guildData.get('coinsSettings').logs);
        if (logsChannel && logsChannel.manageable && !logsChannel.deleted) {
            const embed = new Discord.MessageEmbed()
                .setDescription(lang.buy.buyLog(message.member, !roleCol ? item : roleCol.name, price))
                .setTimestamp()
                .setColor(`${color}`)
            logsChannel.send({embeds: [embed]})
        }


    }
};

