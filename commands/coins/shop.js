const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'shop',
            description: 'Show the shop / Manage item to the shop | Afficher le magasin / Montrer le shop / Gerer les objets dans le shop',
            // Optionnals :
            usage: 'shop [create/delete/add/edit/remove] [item/itemId] [prix]',
            category: 'coins',
            aliases: ['store', 'magasin'],
            clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
            cooldown: 2,
            coinsOnly: true,
            guildOwnerOnly: true
        });
    }

    async run(client, message, args) {
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color')
        const lang = guildData.lang;
        let shop = guildData.get('coinsShop');
        const defaultshop = [{id: 0, item: lang.addShop.nothingInShop, price: undefined, role: undefined}]
        if (args[0] === "delete") {
            return guildData.set('coinsShop', defaultshop).save().then(() => {
                message.channel.send(lang.addShop.delete).then(mp => mp.delete({timeout: 5000}))
            })

        }
        const actualShop = shop.filter(shop => shop.price !== undefined)
        if (args[0] === 'add') {
            /**
             * Shop...
             * @param args[1] {shop item}
             * @param args[2] {price}
             * @param [{id, item, price, role}]
             **/
            const itemName = args.slice(1, args.length - 1).join(" ")
            const price = args[args.length - 1]
            if (!itemName) return message.channel.send(lang.addShop.noItem).then(mp => mp.delete({timeout: 4000}))
            if (!price || isNaN(price)) return message.channel.send(lang.addShop.noPrice).then(mp => mp.delete({timeout: 4000}))
            if (parseInt(price) === 0) return message.channel.send(lang.addShop.priceInf0).then(mp => mp.delete({timeout: 4000}))
            const isRl = !message.mentions.roles.first() ? undefined : !isNaN(args[1]) ? message.guild.roles.cache.get(args[1]) : message.mentions.roles.first();

            if (isRl) {
                let lastItemId = 0;

                if (actualShop[actualShop.length - 1] !== undefined) lastItemId = actualShop[actualShop.length - 1].id
                actualShop.push({
                    id: lastItemId + 1,
                    item: `<@&${isRl.id}>`,
                    price: parseInt(price),
                    role: true,
                    amount: 1
                })

                ajustShopId(actualShop);

            } else {

                let lastItemId = 0;

                if (actualShop[actualShop.length - 1] !== undefined) lastItemId = actualShop[actualShop.length - 1].id
                actualShop.push({id: lastItemId + 1, item: itemName, price: parseInt(price), role: false, amount: 1})

                ajustShopId(actualShop);

            }

            shop = actualShop
            guildData.set('coinsShop', shop).save()
            return message.channel.send(lang.addShop.successAdd(itemName, price)).then(mp => {
                showShop(actualShop)
                mp.delete({timeout: 5000})
            })


        } else if (args[0] === "remove") {
            if (!args[1]) return message.channel.send(lang.addShop.noIdToDelete).then(mp => mp.delete({timeout: 4000}))
            if (isNaN(args[1])) return message.channel.send(lang.addShop.onlyNumber).then(mp => mp.delete({timeout: 4000}))
            if (!actualShop.find(shop => shop.id === parseInt(args[1]))) return message.channel.send(lang.addShop.notFoundItem).then(mp => mp.delete({timeout: 4000}))
            let newShop = actualShop.filter(shop => shop.id !== parseInt(args[1]));
            const itemRemove = actualShop.filter(shop => shop.id === parseInt(args[1]));
            console.log(newShop)
            if (newShop.length === 0) {
                newShop = [{id: 0, item: lang.addShop.nothingInShop, prix: undefined, role: undefined}]

                showShop(newShop)
                return guildData.set('coinsShop', defaultshop).save()
            } else {
                newShop = ajustShopId(newShop)
            }

            shop = newShop
            await guildData.set('coinsShop', shop).save()



            return await message.channel.send(lang.addShop.successRemove(itemRemove[0].item)).then(mp => mp.delete({timeout: 4000})).then(() => {
                showShop(newShop)

            })


        } else if (!args[0]) {
            showShop(shop)
        } else if (args[0] === 'edit') {
            if (!args[1]) return message.channel.send(lang.addShop.syntaxEdit).then(mp => mp.delete({timeout: 4000}))
            if (isNaN(args[1])) return message.channel.send(lang.addShop.onlyNumber).then(mp => mp.delete({timeout: 4000}))
            if (!actualShop.find(shop => shop.id === parseInt(args[1]))) return message.channel.send(lang.addShop.notFoundItem).then(mp => mp.delete({timeout: 4000}))
            const itemToEdit = actualShop.filter(shop => shop.id === parseInt(args[1]));
            const editMsg = await message.channel.send(lang.loading)
            const emoji = ['🎫', '💰', '❌', '✅']
            for (const em of emoji) await editMsg.react(em) // react to msg with emoji list
            const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
                dureefiltrer = response => {
                    return response.author.id === message.author.id
                };
            const embed = new Discord.MessageEmbed()
                .setTitle(itemToEdit[0].item)
                .setDescription(`
            ${lang.addShop.editCondition}

            ID : ${itemToEdit[0].id}\n
            ${emoji[0]} NAME : ${itemToEdit[0].item}\n
            ${emoji[1]} PRICE : ${itemToEdit[0].price.toLocaleString()}\n
            ROLE : ${itemToEdit[0].role}

            ${emoji[3]} : SAVE
        `)
                .setTimestamp()
                .setColor(`${color}`)
                .setFooter(`OneForAll Shop`, client.user.displayAvatarURL())
            editMsg.edit('', embed).then(async m => {
                const collector = m.createReactionCollector(filter, {time: 900000});
                collector.on('collect', async r => {
                    await r.users.remove(message.author);
                    if (r.emoji.name === emoji[0]) {
                        message.channel.send(lang.addShop.newNameQ).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                                .then(cld => {
                                    let msg = cld.first();
                                    if (msg.content === "cancel") return message.channel.send(lang.cancel).then(mps => {
                                        setTimeout(() => {
                                            msWriteProfilerMark.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 4000)
                                    })
                                    const isRl = msg.mentions.roles.first() || isNaN(msg.content) ? undefined : message.guild.roles.cache.get(msg.content);
                                    if (isRl) {
                                        itemToEdit[0].item = `<@&${isRl.id}>`;
                                        itemToEdit[0].role = true;
                                    } else {
                                        itemToEdit[0].item = msg.content;
                                        itemToEdit[0].role = false;
                                    }
                                    message.channel.send(lang.addShop.successEditItemName(msg.content)).then((mps) => {
                                        updateEmbed()
                                        setTimeout(() => {
                                            mps.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 4000)
                                    })

                                });
                        })
                    } else if (r.emoji.name === emoji[1]) {
                        message.channel.send(lang.addShop.newPriceQ).then(mp => {
                            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                                .then(cld => {
                                    let msg = cld.first();
                                    if (isNaN(msg.content)) return message.channel.send(lang.addShop.noPrice).then(mp => mp.delete({timeout: 4000}))
                                    if (parseInt(msg.content) === 0) return message.channel.send(lang.addShop.priceInf0).then(mp => mp.delete({timeout: 4000}))
                                    message.channel.send(lang.addShop.successEditItemPrice(msg.content)).then((mps) => {
                                        itemToEdit[0].price = parseInt(msg.content);
                                        updateEmbed()
                                        setTimeout(() => {
                                            mps.delete();
                                            msg.delete();
                                            mp.delete();
                                        }, 4000)
                                    })

                                });
                        })
                    } else if (r.emoji.name === emoji[2]) {
                        message.channel.send(lang.addShop.cancel).then((mps) => {
                            collector.stop();
                            setTimeout(() => {
                                mps.delete();
                                editMsg.delete();
                                itemToEdit[0] = actualShop.filter(shop => shop.id === parseInt(args[1])); // reassociate item to edit to the actual shop because cancel
                            }, 2000)
                        })
                    } else if (r.emoji.name === emoji[3]) {
                        if (actualShop.filter(shop => shop.id === parseInt(args[1])) === itemToEdit) return message.channel.send(lang.addShop.noModification);
                        actualShop[itemToEdit[0].id - 1] = itemToEdit[0];

                        guildData.set('coinsShop', actualShop).save().then(() => {
                            message.channel.send(lang.addShop.successEdit).then(() => {
                                ajustShopId(actualShop);
                                showShop(actualShop);
                            })

                        })

                    }
                })

                function updateEmbed() {
                    embed.setDescription(`
                ${lang.addShop.editCondition}
    
                ID : ${itemToEdit[0].id}\n
                ${emoji[0]} NAME : ${itemToEdit[0].item}\n
                ${emoji[1]} PRICE : ${itemToEdit[0].price.toLocaleString()}\n
                ROLE : ${itemToEdit[0].role}
    
                ${emoji[3]} : SAVE
            `)
                    editMsg.edit(embed)

                }
            })
        }

        function showShop(shop) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL)
                .setDescription(lang.addShop.shopDesc(message.guild.name))
                .addField('\u200b', shop.map(shop => !shop.price ? lang.addShop.nothingInShop : `\`${shop.id}\` ${shop.item} — [⏣ ${shop.price.toLocaleString()}](https://discord.gg/n2EvRECf88) coins`))
                .setColor(`${color}`)
                .setTimestamp()
                .setFooter(`⏣ OneForAll coins`);


            return message.channel.send(embed)
        }
    }
};

function ajustShopId(shop) {
    const sortedShop = shop.sort((a, b) => a.price - b.price);
    for (let i = 0; i < sortedShop.length; i++) {
        sortedShop[i].id = i + 1;
    }
    shop = sortedShop
    return shop;

}

