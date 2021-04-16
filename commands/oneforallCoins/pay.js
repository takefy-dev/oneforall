const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const coinSettings = new Map();
const userCoins = new Map();
module.exports = new Command({
    name: 'pay',
    description: 'Pay a member | Payer un membre',
    // Optionnals :
    usage: '!pay <mention / id> <number coins>',
    category: 'coins',
    tags: ['guildOnly'],
    cooldown: 4
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    const color = message.guild.color
    const lang = require(`../../lang/${message.guild.lang}`);
    const shopSettings = coinSettings.get(message.guild.id);
    if (!shopSettings.enable) return message.channel.send(lang.buy.shoDisable).then(mp => mp.delete({ timeout: 4000 }))
    let member;
    let memberId = args[0];
    const amountToGive = args[1];
    if (!memberId) return message.channel.send(lang.pay.noMember).then(mp => mp.delete({ timeout: 4000 }));
    if (!amountToGive) return message.channel.send(lang.pay.noCoinToGive).then(mp => mp.delete({ timeout: 4000 }));
    if (parseInt(amountToGive) < 1) return message.channel.send(lang.pay.infZero).then(mp => mp.delete({ timeout: 4000 }))
    member = message.mentions.members.first()
    if (!member && !isNaN(memberId)) {
        if (message.guild.members.cache.has(memberId)) {
            member = message.guild.members.cache.get(memberId);

        } else {
            member = await message.guild.members.fetch(memberId)
        }
    }
    if (!member) return message.channel.send(lang.coins.userNotFound).then(mp => mp.delete({ timeout: 4000 }))
    if (member.user.id === message.author.id) return message.channel.send(lang.pay.giverAndReceiverSame).then(mp => mp.delete({ timeout: 4000 }))
    const guildCoins = userCoins.get(message.guild.id);
    if(guildCoins){
        const giverCoinsInfo = guildCoins.find(coins => coins.userId === message.author.id);
        if(giverCoinsInfo.coins < parseInt(amountToGive)) return message.channel.send(lang.pay.cantPay)
        let giverCoin = 0;
        if (giverCoinsInfo) giverCoin = giverCoinsInfo.coins;
        if (giverCoin < 1) return message.channel.send(lang.pay.giverNoCoins).then(mp => mp.delete({ timeout: 4000 }))
        const receiverCoinsInfo = guildCoins.find(coins => coins.userId === member.user.id);
        let receiverCoin = 0;
        if (receiverCoinsInfo) receiverCoin = receiverCoinsInfo.coins;
        
        // remove  money to giver
        giverCoin -= parseInt(amountToGive);
    
        const giverUserCoins = guildCoins.indexOf(giverCoinsInfo)
        guildCoins[giverUserCoins].coins = giverCoin;
    
        // add  money to giver
        receiverCoin += parseInt(amountToGive);
        const receiverUserCoins = guildCoins.indexOf(receiverCoinsInfo);
        let newUser = false;
        if(receiverUserCoins !== -1){
            guildCoins[receiverUserCoins].coins = receiverCoin;
        }else{
            const newReceiverArray = {userId : member.user.id, coins : receiverCoin}
            guildCoins.push(newReceiverArray)
            newUser = true;
        }
    
        
    
        await this.connection.query(`UPDATE coins SET coins = '${giverCoin}' WHERE guildId = '${message.guild.id}' AND userId = '${message.author.id}'`).then(async () => {
            if(!newUser){
                await this.connection.query(`UPDATE coins SET coins = '${receiverCoin}' WHERE guildId = '${message.guild.id}' AND userId = '${member.user.id}'`).then(() => {
                    message.channel.send(lang.pay.successPay(member, amountToGive)).then(() => {
                        StateManager.emit('guildCoins', message.guild.id, userCoins.get(message.guild.id))
                    })
                })
            }else{
                await this.connection.query(`INSERT INTO coins (userId, guildId, coins) VALUES('${member.user.id}', '${message.guild.id}', '${receiverCoin}')`).then(() => {
                    message.channel.send(lang.pay.successPay(member, amountToGive)).then(() => {
                        StateManager.emit('guildCoins', message.guild.id, userCoins.get(message.guild.id))
                    })
                })
            }
            
     
        })
        const logsChannel = message.guild.channels.cache.get(shopSettings.logs);
        if (logsChannel && logsChannel.manageable) {
            const embed = new Discord.MessageEmbed()
                .setDescription(lang.pay.payLog(message.member, member, amountToGive))
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