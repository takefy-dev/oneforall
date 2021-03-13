const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const {Command} = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const userCoins = new Map();
const coinSettings = new Map();
const guildShop = new Map();
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
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const shopSettings = coinSettings.get(message.guild.id);
    const idToBuy = args[0];
    if(!shopSettings.enable) return message.channel.send(lang.buy.shoDisable)
    if(!idToBuy) return message.channel.send(lang.buy.syntaxError)
    const totalGuildCoins = userCoins.get(message.guild.id);
    const shop = guildShop.get(message.guild.id);
    const userCoinsArray = totalGuildCoins.filter(user => user.userId === message.author.id)[0];
    const coins = userCoinsArray.coins
    if(coins < 1) return message.channel.send(lang.buy.noCoins);
    if(shop.find(shop => shop.id === 0)) return message.channel.send(lang.buy.nothingInShop);
    const { price, role, item} = shop.filter(shop => shop.id === parseInt(idToBuy))[0]
    if(price > coins) return message.channel.send(lang.buy.notEnoughCoins);
    if(shop.length < parseInt(idToBuy)) return message.channel.send(lang.buy.itemNotInShop);
    if(role){
        const newUserCoins = parseInt(coins - price);
        console.log(userCoinsArray)
        const indexUserCoins = totalGuildCoins.indexOf(userCoinsArray[0])

        totalGuildCoins[indexUserCoins].coins = newUserCoins;

    }else{
        const newUserCoins = parseInt(coins - price);

        const indexUserCoins = totalGuildCoins.indexOf(userCoinsArray)
        totalGuildCoins[indexUserCoins].coins = newUserCoins;
        await this.connection.query(`UPDATE coins SET coins = '${newUserCoins}' WHERE guildId = '${message.guild.id}' AND userId = '${message.author.id}'`).then(() =>{
            message.channel.send(lang.buy.success(item, price)).then(() =>{
                StateManager.emit('guildCoins', message.guild.id, userCoins.get(message.guild.id))
            })
        })
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
