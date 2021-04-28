// TODO - Redo coins systemes

const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
let embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
let langF = require('../../function/lang')
const userCoins = new Map();
const coinSettings = new Map();
const guildShop = new Map();
const guildInventory = new Map();
module.exports = new Command({
    name: 'buy',
    description: 'Buy an item from the shop | Acheter un item du magasin',
    // Optionnals :
    usage: '!buy <itemId>',
    category: 'coins',
    tags: ['guildOnly'],
    aliases: ['acheter'],
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async(client, message, args) => {
    this.connection = StateManager.connection;  
    const color = message.guild.color
    const lang = client.lang(message.guild.lang)
    const shopSettings = coinSettings.get(message.guild.id);
    const idToBuy = args[0];
    if(!shopSettings.enable) return message.channel.send(lang.buy.shoDisable).then(mp => mp.delete({timeout : 4000}))
    if(!idToBuy) return message.channel.send(lang.buy.syntaxError).then(mp => mp.delete({timeout : 4000}))
    const totalGuildCoins = userCoins.get(message.guild.id)
    const shop = guildShop.get(message.guild.id);
    if(totalGuildCoins){
        const userCoinsArray = totalGuildCoins.filter(user => user.userId === message.author.id)[0];
        if(!userCoinsArray) return message.channel.send(lang.buy.noCoins).then(mp => mp.delete({timeout : 4000}));
        const coins = userCoinsArray.coins
        if(coins < 1 || !coins) return message.channel.send(lang.buy.noCoins).then(mp => mp.delete({timeout : 4000}));
        if(shop.find(shop => shop.id === 0)) return message.channel.send(lang.buy.nothingInShop).then(mp => mp.delete({timeout : 4000}));
        if(shop.length < parseInt(idToBuy) || parseInt(idToBuy) < 1) return message.channel.send(lang.buy.itemNotInShop).then(mp => mp.delete({timeout : 4000}));

        const { price, role, item} = shop.filter(shop => shop.id === parseInt(idToBuy))[0]
        if(price > coins) return message.channel.send(lang.buy.notEnoughCoins).then(mp => mp.delete({timeout : 4000}));
        let roleCol;
        if(role){
            roleCol = message.guild.roles.cache.get(item.replace('<@&', '').replace('>', ''));
    
            if(message.member.roles.cache.has(roleCol.id)) return message.channel.send(lang.buy.alreadyRole).then(mp => mp.delete({timeout : 4000}))
    
            const newUserCoins = parseInt(coins - price);
            
            const indexUserCoins = totalGuildCoins.indexOf(userCoinsArray)
            totalGuildCoins[indexUserCoins].coins = newUserCoins;
            await this.connection.query(`UPDATE coins SET coins = '${newUserCoins}' WHERE guildId = '${message.guild.id}' AND userId = '${message.author.id}'`).then(() =>{
                
                message.channel.send(lang.buy.success(`**${roleCol.name}**`, price)).then((mp) =>{
                    mp.delete({timeout : 4000})
                    message.member.roles.add(roleCol.id, `Coins shop`)
                    StateManager.emit('guildCoins', message.guild.id, userCoins.get(message.guild.id))
                })
            })  
        }else{
            const newUserCoins = parseInt(coins - price);
    
            const indexUserCoins = totalGuildCoins.indexOf(userCoinsArray)
            totalGuildCoins[indexUserCoins].coins = newUserCoins;
            await this.connection.query(`UPDATE coins SET coins = '${newUserCoins}' WHERE guildId = '${message.guild.id}' AND userId = '${message.author.id}'`).then(() =>{
                message.channel.send(lang.buy.success(item, price)).then(() =>{
                    StateManager.emit('guildCoins', message.guild.id, userCoins.get(message.guild.id))
                    let memberInvetory = guildInventory.get(message.guild.id);
                    const itemBuyed = shop.filter(shop => shop.id === parseInt(idToBuy))[0]
                    
                    if(memberInvetory){ // if guild has some inventory 
                        let messageMemberInvetory = memberInvetory.get(message.author.id);
                        if(messageMemberInvetory){ // if already member has a inv
                            // [{}, {}, {}, {}, {}, {}, {}, {}, {}]
                            let itemOccurence = messageMemberInvetory.filter(inv => inv.id === itemBuyed.id);
                         

                            if(itemOccurence[0] && itemOccurence[0].amount >= 1) {
                                const itemOccurenceCount = itemOccurence[0].amount;
                           
                                itemOccurence[0].amount = itemOccurenceCount  + 1;

                            }else{
                                messageMemberInvetory.push(itemBuyed);
                            }
                         
                            
                            guildInventory.get(message.guild.id).set(message.author.id, messageMemberInvetory);
                            this.connection.query(`UPDATE inventory SET inventory = ? WHERE guildId = '${message.guild.id}' AND userId = '${message.author.id}'`, [JSON.stringify(messageMemberInvetory)]).then(() =>{
                                StateManager.emit('inventory', message.guild.id, guildInventory.get(message.guild.id))
                            })
                        }else{
                            memberInvetory.set(message.author.id, [itemBuyed]);
                            this.connection.query(`INSERT INTO inventory (userId, guildId, inventory) VALUES ('${message.author.id}', '${message.guild.id}', ?)`, [JSON.stringify(messageMemberInvetory)]).then(() =>{
                                StateManager.emit('inventory', message.guild.id, guildInventory.get(message.guild.id))
                            })
                        }
                    }else{
                        const tempInv = new Map();
                        tempInv.set(message.author.id, [itemBuyed])
                        guildInventory.set(message.guild.id, tempInv);
                        const inventory = guildInventory.get(message.guild.id).get(message.author.id);
                        this.connection.query(`INSERT INTO inventory (userId, guildId, inventory) VALUES ('${message.author.id}', '${message.guild.id}', ?)`, [JSON.stringify(inventory)]).then(() =>{
                            StateManager.emit('inventory', message.guild.id, guildInventory.get(message.guild.id))
                        })
                        
                    }
                
                })
            })
        }
        const logsChannel = message.guild.channels.cache.get(shopSettings.logs);
        if(logsChannel && logsChannel.manageable){
            const embed = new Discord.MessageEmbed()
            .setDescription(lang.buy.buyLog(message.member, !roleCol ? item : roleCol.name, price))
            .setTimestamp()
            .setColor(`${color}`)
            logsChannel.send(embed)
        }
    }else{
        message.channel.send(lang.lb.noCoins)

    }
    
    
});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('coinSettings', (guildId, settings) => {
    coinSettings.set(guildId, settings)
})
StateManager.on('guildCoins', (guildId, coins) => {
    userCoins.set(guildId, coins)
})
StateManager.on('shopFetched', (guildId, shopArray) => {
    guildShop.set(guildId, shopArray)
})
StateManager.on('shopUpdate', (guildId, shopArray) => {
    guildShop.set(guildId, shopArray)
})
StateManager.on('shopDelete', (guildId) => {
    guildShop.delete(guildId);
})
StateManager.on('inventory', (guildId, userInv) => {
    guildInventory.set(guildId, userInv);
})