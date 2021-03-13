const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
const SqlString = require('sqlstring');

var langF = require('../../function/lang');
const ms = require('ms');
const shop = new Map();
module.exports = new Command({
    name: 'shop',
    description: 'Show the shop / Manage item to the shop | Afficher le magasin / Montrer le shop / Gerer les objets dans le shop',
    // Optionnals :
    usage: '!shop [create/delete/add/edit/remove] [item/itemId] [prix]',
    category: 'coins',
    tags: ['guildOnly'],
    aliases: ['store', 'magasin'],
    clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    cooldown: 2
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    let owner = message.guild.ownerID;

    if (client.BotPerso) {
        owner = process.env.OWNER
    }
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    if (args[0] === "create") {
        if (shop.has(message.guild.id)) return message.channel.send(lang.addShop.alreadyShop)
        return await this.connection.query(`INSERT INTO coinShop VALUES ('${message.guild.id}', '[${JSON.stringify({ id: 0, item: lang.addShop.nothingInShop, prix: undefined, role: undefined })}]')`).then(async () => {
            const createdShop = [{ id: 0, item: lang.addShop.nothingInShop, price: undefined, role: undefined }]
            shop.set(message.guild.id, createdShop);

            StateManager.emit('shopUpdate', message.guild.id, createdShop)
            return message.channel.send(lang.addShop.create).then(mp => mp.delete({ timeout: 5000 }))
        })
    } else if (args[0] === "delete") {
        if (!shop.has(message.guild.id)) return message.channel.send(lang.addShop.noShop)
        return await this.connection.query(`DELETE FROM coinShop WHERE guildId = '${message.guild.id}'`).then(async () => {
            shop.delete(message.guild.id)

            StateManager.emit('shopDelete', shop)
            return message.channel.send(lang.addShop.delete).then(mp => mp.delete({ timeout: 5000 }))
        })
    }
    if (!shop.has(message.guild.id)) return message.channel.send(lang.addShop.noShop)
    const actualShop = shop.get(message.guild.id).filter(shop => shop.price !== undefined)
    if (args[0] === 'add') {
        /**
         * Shop...
         * @param args[1] {shop item}
         * @param args[2] {price}
         * @param [{id, item, price, role}]
        **/
        if ((!client.isGuildOwner(message.guild.id, message.author.id) || owner !== message.author.id) && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
        const itemName = args.slice(1, args.length - 1).join(" ")
        const price = args[args.length - 1]
        if (!itemName) return message.channel.send(lang.addShop.noItem).then(mp => mp.delete({ timeout: 4000 }))
        if (!price || isNaN(price)) return message.channel.send(lang.addShop.noPrice).then(mp => mp.delete({ timeout: 4000 }))
        if (parseInt(price) === 0) return message.channel.send(lang.addShop.priceInf0).then(mp => mp.delete({ timeout: 4000 }))
        const isRl = message.mentions.roles.first() || isNaN(args[1]) ? undefined : message.guild.roles.cache.get(args[1]);
        if (isRl) {
            let lastItemId = 0;

            if (actualShop[actualShop.length - 1] !== undefined) lastItemId = actualShop[actualShop.length - 1].id
            actualShop.push({ id: lastItemId + 1, item: `<@${isRl.id}>`, price: parseInt(price), role: true })
            ajustShopId(actualShop);

        } else {

            let lastItemId = 0;

            if (actualShop[actualShop.length - 1] !== undefined) lastItemId = actualShop[actualShop.length - 1].id
            actualShop.push({ id: lastItemId + 1, item: itemName, price: parseInt(price), role: false })
            ajustShopId(actualShop);
          
        }
        shop.set(message.guild.id, actualShop)
        StateManager.emit('shopUpdate', message.guild.id, actualShop)
        await this.connection.query(`UPDATE coinShop SET shop = ? WHERE guildId = '${message.guild.id}'`, [JSON.stringify(actualShop)]).then(async () => {

            return message.channel.send(lang.addShop.successAdd(itemName, price)).then(mp => mp.delete({ timeout: 5000 })).then(() =>{
                showShop(actualShop)

            })
        })

    } else if (args[0] === "remove") {
        if (!client.isGuildOwner(message.guild.id, message.author.id) || owner !== message.author.id || !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
        if (!args[1]) return message.channel.send(lang.addShop.noIdToDelete).then(mp => mp.delete({ timeout: 4000 }))
        if (isNaN(args[1])) return message.channel.send(lang.addShop.onlyNumber).then(mp => mp.delete({ timeout: 4000 }))
        if (!actualShop.find(shop => shop.id === parseInt(args[1]))) return message.channel.send(lang.addShop.notFoundItem).then(mp => mp.delete({ timeout: 4000 }))
        let newShop = actualShop.filter(shop => shop.id !== parseInt(args[1]));
        const itemRemove = actualShop.filter(shop => shop.id === parseInt(args[1]));
        if (newShop.length === 0) {
            newShop = [{ id: 0, item: lang.addShop.nothingInShop, prix: undefined, role: undefined }]
            shop.delete(message.guild.id);
            StateManager.emit('shopDelete', shop)
        } else {
            newShop = ajustShopId(newShop)
        }

        this.connection.query(`UPDATE coinShop SET shop = '${JSON.stringify(newShop)}' WHERE guildId = '${message.guild.id}'`).then(async () => {
            if (newShop.length !== 0) {
                shop.set(message.guild.id, newShop);
                StateManager.emit('shopUpdate', message.guild.id, newShop)


            }
            return await message.channel.send(lang.addShop.successRemove(itemRemove[0].item)).then(mp => mp.delete({ timeout: 4000 })).then(() =>{
                showShop(newShop)

            })
        })

    } else if (!args[0]) {
        showShop(shop.get(message.guild.id))
    } else if (args[0] === 'edit') {
        if (!client.isGuildOwner(message.guild.id, message.author.id) || owner !== message.author.id || !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)
        if(!args[1]) return message.channel.send(lang.addShop.syntaxEdit).then(mp => mp.delete({ timeout: 4000 }))
        if (isNaN(args[1])) return message.channel.send(lang.addShop.onlyNumber).then(mp => mp.delete({ timeout: 4000 }))
        if (!actualShop.find(shop => shop.id === parseInt(args[1]))) return message.channel.send(lang.addShop.notFoundItem).then(mp => mp.delete({ timeout: 4000 }))
        const itemToEdit = actualShop.filter(shop => shop.id === parseInt(args[1]));
        const editMsg = await message.channel.send(lang.loading)
        const emoji = ['🎫','💰', '❌','✅']
        for (const em of emoji) await editMsg.react(em) // react to msg with emoji list
        const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id,
            dureefiltrer = response => { return response.author.id === message.author.id };
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
            const collector = m.createReactionCollector(filter, { time: 900000 });
            collector.on('collect', async r => {
                r.users.remove(message.author);
                if (r.emoji.name === emoji[0]) {
                    message.channel.send(lang.addShop.newNameQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                            .then(cld => {
                                var msg = cld.first();
                                if(msg.content === "cancel") return message.channel.send(lang.cancel).then(mps =>{
                                    setTimeout(() =>{
                                        msWriteProfilerMark.delete();
                                        msg.delete();
                                        mp.delete();
                                    }, 4000)
                                })
                                const isRl = msg.mentions.roles.first() || isNaN(msg.content) ? undefined : message.guild.roles.cache.get(msg.content);
                                if(isRl){
                                    itemToEdit[0].item = `<@&${isRl.id}>`;
                                    itemToEdit[0].role = true;
                                }else{
                                    itemToEdit[0].item = msg.content;
                                    itemToEdit[0].role = false;
                                }
                                message.channel.send(lang.addShop.successEditItemName(msg.content)).then((mps) =>{
                                    updateEmbed()
                                    setTimeout(() =>{
                                        mps.delete();
                                        msg.delete();
                                        mp.delete();
                                    }, 4000)
                                })

                            });
                    })
                }else if(r.emoji.name === emoji[1]){
                    message.channel.send(lang.addShop.newPriceQ).then(mp => {
                        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
                            .then(cld => {
                                var msg = cld.first();
                                if (isNaN(msg.content)) return message.channel.send(lang.addShop.noPrice).then(mp => mp.delete({ timeout: 4000 }))
                                if (parseInt(msg.content) === 0) return message.channel.send(lang.addShop.priceInf0).then(mp => mp.delete({ timeout: 4000 }))
                                message.channel.send(lang.addShop.successEditItemPrice(msg.content)).then((mps) =>{
                                    itemToEdit[0].price = parseInt(msg.content);
                                    updateEmbed()
                                    setTimeout(() =>{
                                        mps.delete();
                                        msg.delete();
                                        mp.delete();
                                    }, 4000)
                                })

                            });
                    })
                }else if(r.emoji.name === emoji[2]){
                    message.channel.send(lang.addShop.cancel).then((mps) =>{
                        collector.stop();
                        setTimeout(() =>{
                            mps.delete();
                            editMsg.delete();
                            itemToEdit[0] = actualShop.filter(shop => shop.id === parseInt(args[1])); // reassociate item to edit to the actual shop because cancel
                        }, 2000)
                    })
                }else if(r.emoji.name === emoji[3]){
                    if(actualShop.filter(shop => shop.id === parseInt(args[1])) == itemToEdit) return message.channel.send(lang.addShop.noModification);
                    actualShop[itemToEdit[0].id - 1] = itemToEdit[0];
             
                    await this.connection.query(`UPDATE coinShop SET shop = ? WHERE guildId = '${message.guild.id}'`, [actualShop]).then(() =>{
                        message.channel.send(lang.addShop.successEdit).then(() =>{
                            shop.get(message.guild.id, actualShop);
                            StateManager.emit('shopUpdate', message.guild.id, shop.get(message.guild.id));
                            ajustShopId(actualShop);
                            showShop(actualShop);
                        })
                    })
                }
            })
            function updateEmbed() {
                embed .setDescription(`
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
            .addField('\u200b', shop.map(shop => !shop.price ? lang.addShop.nothingInShop : `\`${shop.id}\` __${shop.item}__ — [⏣ ${shop.price.toLocaleString()}](https://discord.gg/n2EvRECf88) coins`))
            .setColor(`${color}`)
            .setTimestamp()
            .setFooter(`⏣ OneForAll coins`);

        
        
        
        return message.channel.send(embed)
    }
});

function ajustShopId(shop) {
    const sortedShop = shop.sort((a, b) => a.price - b.price);
    for (let i = 0; i < sortedShop.length; i++) {
        sortedShop[i].id = i + 1;
    }
    shop = sortedShop
    return shop;

}


embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('shopFetched', (guildId, shopArray) => {
    shop.set(guildId, shopArray)
})
