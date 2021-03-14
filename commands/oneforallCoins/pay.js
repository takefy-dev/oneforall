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
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const shopSettings = coinSettings.get(message.guild.id);
    if (!shopSettings.enable) return message.channel.send(lang.buy.shoDisable).then(mp => mp.delete({ timeout: 4000 }))
    let member;
    let memberId = args[0];
    const amountToGive = args[1];
    if (!memberId) return message.channel.send(lang.pay.noMember).then(mp => mp.delete({ timeout: 4000 }));
    if (!amountToGive) return message.channel.send(lang.pay.noCoinToGive).then(mp => mp.delete({ timeout: 4000 }));
    if(parseInt(amountToGive) < 1) return message.channel.send(lang.pay.infZero).then(mp => mp.delete({ timeout: 4000 }))
    member = message.mentions.members.first()
    if (!member && !isNaN(memberId)) {
        if (message.guild.members.cache.has(memberId)) {
            member = message.guild.members.cache.get(memberId);

        } else {
            member = await message.guild.members.fetch(memberId)
        }
    }
    if (!member) return message.channel.send(lang.coins.userNotFound).then(mp => mp.delete({ timeout: 4000 }))
    if(member.user.id === message.author.id) return message.channel.send(lang.pay.giverAndReceiverSame).then(mp => mp.delete({ timeout: 4000 }))
    const guildCoins = userCoins.get(message.guild.id);
    const giverCoinsInfo = guildCoins.find(coins => coins.userId === message.author.id);
    let giverCoin = 0;
    if (giverCoinsInfo) giverCoin = giverCoinsInfo.coins;
    if(giverCoin < 1) return message.channel.send(lang.pay.giverNoCoins).then(mp => mp.delete({ timeout: 4000 }))
    const receiverCoinsInfo = guildCoins.find(coins => coins.userId === member.user.id);
    let receiverCoin = 0;
    if (receiverCoinsInfo) receiverCoin = receiverCoinsInfo.coins;
    giverCoin -= parseInt(amountToGive);
    receiverCoin += parseInt(amountToGive);
    console.log(giverCoin, receiverCoin)
});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('coinSettings', (guildId, settings) => {
    coinSettings.set(guildId, settings)
})
StateManager.on('guildCoins', (guildId, coins) => {
    userCoins.set(guildId, coins)
})