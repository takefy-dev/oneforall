const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const shop = new Map();
module.exports = new Command({
    name: 'shop',
    description: 'Show the shop / Add or remove item to the shop | Afficher le magasin / Ajouter ou supprimer des objet dans le shop',
    // Optionnals :
    usage: '!shop [add/remove] [item] [prix]',
    category: 'coins',
    tags: ['guildOnly'],
    aliases: ['store', 'magasin'],
    clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
    cooldown: 3
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    let owner = message.guild.ownerID;

    if (client.BotPerso) {
        owner = process.env.OWNER
    }
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    if(args[0] === "create"){
        if(shop.has(message.guild.id)) return message.channel.send(lang.addShop.alreadyShop)
        return await this.connection.query(`INSERT INTO coinShop VALUES ('${message.guild.id}', '[${JSON.stringify({id: 0,item: 'Rien dans le magasin', prix: undefined, role:undefined})}]')`).then(async() =>{
            const createdShop =  [{id: 0,item : 'Rien dans le magasin', price: undefined, role:undefined}]
            shop.set(message.guild.id, createdShop);

            StateManager.emit('shopUpdate', message.guild.id, createdShop)
            return message.channel.send(lang.addShop.create).then(mp => mp.delete({timeout : 5000}))
        })
    }else if(args[0] === "delete"){
        if(!shop.has(message.guild.id)) return message.channel.send(lang.addShop.noShop)
        return await this.connection.query(`DELETE FROM coinShop WHERE guildId = '${message.guild.id}'`).then(async() =>{
            shop.delete(message.guild.id)

            StateManager.emit('shopDelete',shop)
            return message.channel.send(lang.addShop.delete).then(mp => mp.delete({timeout : 5000}))
        })
    }
    if(!shop.has(message.guild.id)) return message.channel.send(lang.addShop.noShop)
    const actualShop = shop.get(message.guild.id).filter(shop => shop.price !== undefined)
    if (args[0] === 'add') {
        /**
         * Shop...
         * @param args[1] {shop item}
         * @param args[2] {price}
         * @param [{id, item, price, role}]
        **/
        if (!client.isGuildOwner(message.guild.id, message.author.id) || owner !== message.author.id) return message.channel.send(lang.error.notListOwner)
        if (!args[1]) return message.channel.send(lang.addShop.noItem).then(mp => mp.delete({ timeout: 4000 }))
        if (!args[2] || isNaN(args[2])) return message.channel.send(lang.addShop.noPrice).then(mp => mp.delete({ timeout: 4000 }))
        if(parseInt(args[2]) === 0) return message.channel.send(lang.addShop.priceInf0).then(mp => mp.delete({ timeout: 4000 }))
        const isRl = message.mentions.roles.first() || isNaN(args[1]) ? undefined : message.guild.roles.cache.get(args[1]);
        if(isRl){
            let lastItemId = 0;
            
            if(actualShop[actualShop.length - 1] !== undefined) lastItemId = actualShop[actualShop.length - 1].id
            actualShop.push({id: lastItemId + 1 ,item: `<@${isRl.id}>`, price: parseFloat(args[2]), role: true})
        }else{
            
            let lastItemId = 0;
            
            if(actualShop[actualShop.length - 1] !== undefined) lastItemId = actualShop[actualShop.length - 1].id

    
            actualShop.push({id:  lastItemId + 1, item: args[1], price: parseFloat(args[2]), role: false})


        }
        shop.set(message.guild.id, actualShop)
        StateManager.emit('shopUpdate', message.guild.id, actualShop)
        await this.connection.query(`UPDATE coinShop SET shop = '${JSON.stringify(actualShop)}'`).then(async() =>{
            return message.channel.send(lang.addShop.successAdd(args[1], args[2])).then(mp => mp.delete({timeout : 5000}))
        })

    }else if(args[0] === "remove"){
        if (!client.isGuildOwner(message.guild.id, message.author.id) || owner !== message.author.id) return message.channel.send(lang.error.notListOwner)
        if (!args[1]) return message.channel.send(lang.addShop.noIdToDelete).then(mp => mp.delete({ timeout: 4000 }))
        if (isNaN(args[1])) return message.channel.send(lang.addShop.onlyNumber).then(mp => mp.delete({ timeout: 4000 }))
        if(!actualShop.find(shop => shop.id === parseInt(args[1]))) return message.channel.send(lang.addShop.notFoundItem).then(mp => mp.delete({ timeout: 4000 }))
        const newShop = actualShop.filter(shop => shop.id !== parseInt(args[1]));
        await this.connection.query(`UPDATE coinShop SET shop = '${JSON.stringify(newShop)}' WHERE guildId = '${message.guild.id}'`).then(() =>{
            shop.set(message.guild.id, newShop);
            StateManager.emit('shopUpdate', message.guild.id, newShop)

        })

    }
});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('shopFetched', (guildId, shopArray) =>{
    shop.set(guildId, shopArray)
})
