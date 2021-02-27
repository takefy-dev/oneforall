const Discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var embedsColor = require('../../function/embedsColor');
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
const guildOwner = new Map();
var checkOwner = require('../../function/check/botOwner');
module.exports = new Command({
    name: 'setlang',
    description: 'change the language of the bot | Changer la langue du bot',
    // Optionnals :
    usage: '!setlang',
    category: 'owners',
    userPermissions: ['ADMINISTRATOR'],
    clientPermissions: ['SEND_MESSAGES'],
    cooldown: 6
}, async (client, message, args) => {
    this.connection = StateManager.connection;
    
    const color = guildEmbedColor.get(message.guild.id);
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`);
    const owner = message.guild.ownerID;
    const sender = message.author.id;
    var isOwner = checkOwner(message.guild.id, sender);
    let owners = guildOwner.get(message.guild.id);
    const ownerTag = new Array();
    if (typeof owners != "object") {
        owners = owners.split(',')
    } else {
        owners = owners
    }
    for (var i = 0; i < owners.length - 1; i++) {
        let ownerSS
        await message.guild.members.fetch().then((members) => {
            ownerSS = members.get(owners[i])
        })

        const ownerList = ownerSS.user.tag;
        ownerTag.push(ownerList);

    }

    if (message.author.id != owner & !isOwner && !client.isOwner(message.author.id)) return message.channel.send(lang.error.errorNoOwner(ownerTag))
    const msg = await message.channel.send(lang.loading)
    let reac1
    let reac2
    let reac3
    reac1 = await msg.react(`🇫🇷`);
    reac2 = await msg.react("🇬🇧");
    reac3 = await msg.react("❌");
    const embed = new Discord.MessageEmbed()
    .setTitle(lang.setlang.title)
    .setDescription(lang.setlang.description(guildLang.get(message.guild.id)))
    .setTimestamp()
    .setColor(`${color}`)
    .setFooter(`${client.user.username}`);
    const filter = (reaction, user) => ['🇫🇷', '🇬🇧', '❌'].includes(reaction.emoji.name) && user.id === message.author.id,
    dureefiltrer = response => { return response.author.id === message.author.id };
    msg.edit('', embed).then(async(m)=>{
        const collector = m.createReactionCollector(filter, { time: 900000 });
        collector.on('collect', async r => {
            r.users.remove(message.author);
            if(r.emoji.name == "🇫🇷"){
                this.connection.query(`SELECT lang FROM guildConfig WHERE guildId = '${message.guild.id}'`).then(async (res) =>{
                    if(res[0][0].lang == "fr"){
                        return message.channel.send(lang.setlang.errorSelected)
                    }else{
                        await this.connection.query(`UPDATE guildConfig SET lang = 'fr' WHERE guildId = '${message.guild.id}'`).then(async() =>{
                            await collector.stop()
                            await msg.delete();
                            StateManager.emit('langUpdate', message.guild.id, 'fr')
                            return message.channel.send(lang.setlang.success('fr'))
                        })
                    }
                })
            }else if(r.emoji.name == "🇬🇧"){
                this.connection.query(`SELECT lang FROM guildConfig WHERE guildId = '${message.guild.id}'`).then((res) =>{
                    if(res[0][0].lang == "en"){
                        return message.channel.send(lang.setlang.errorSelected)
                    }else{
                        this.connection.query(`UPDATE guildConfig SET lang = 'en' WHERE guildId = '${message.guild.id}'`).then(async() =>{
                            await collector.stop()
                            await msg.delete();
                            StateManager.emit('langUpdate', message.guild.id, 'en')
                            return message.channel.send(lang.setlang.success('en'))
                        })
                    }
                })
            }else if(r.emoji.name == "❌"){
                await collector.stop();
                return  await msg.delete();
            }
        });
    })
   


});

embedsColor(guildEmbedColor);
langF(guildLang);
StateManager.on('ownerUpdate', (guildId, data) => {
    guildOwner.set(guildId, data);
})
StateManager.on('ownerFetched', (guildId, data) => {
    guildOwner.set(guildId, data);

})