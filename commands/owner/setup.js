const discord = require('discord.js')
const guildEmbedColor = new Map();
const StateManager = require('../../utils/StateManager');
var checkSetup = require('../../function/check/checkSetup');
var checkOwner = require('../../function/check/botOwner');
var embedsColor = require('../../function/embedsColor');
const guildOwner = new Map();
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
var langF = require('../../function/lang')
module.exports = new Command({
    name: 'setup',
    description: 'Setup the role for the bot to work perfectly | Configurer les rôles indispensable pour la fonctionnalitée du bot',
    // Optionnals :
    usage: '!setup',
    category: 'owners',
    ownerOnly: false,
    cooldown: 2
}, async (client, message, args) => {
    this.connection = StateManager.connection
    const sender = message.author.id;
    const lang = require(`../../lang/${guildLang.get(message.guild.id)}`)

    let owner = message.guild.ownerID;
    
    if(client.BotPerso){
        const config = require('../../config.json')
owner = config.owner
    };

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

    message.channel.send(lang.setup.muteQ)
    const responseMuteRole = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000, errors: ['time'] }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
    const CollectedMuteRole = responseMuteRole.first()
    if (CollectedMuteRole.content.toLowerCase() == "cancel") return message.channel.send(lang.cancel)


    message.channel.send(lang.setup.memberRoleQ)
    const responseMembreRole = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000, errors: ['time'] }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
    const CollectedMembreRole = responseMembreRole.first()
    if (CollectedMembreRole.content.toLowerCase() == "cancel") return message.channel.send(lang.cancel)


    let muteRole = CollectedMuteRole.mentions.roles.first();
    let mureRoleId;
    if(!muteRole){
        mureRoleId = CollectedMuteRole.content.toLowerCase();
    }else{
        mureRoleId = muteRole.id;
    }
    
    let memberRole = CollectedMembreRole.mentions.roles.first();
    let memberRoleId;
    if(!memberRole){
        memberRoleId = CollectedMembreRole.content.toLowerCase();
    }else{
        memberRoleId = memberRole.id;
    }




    const guildId = message.guild.id;
    const setup = true

    try {

        await this.connection.query(
            `UPDATE guildConfig SET muteRoleId = '${mureRoleId}' WHERE guildId = '${guildId}'`
        );

        await this.connection.query(
            `UPDATE guildConfig SET setup = '1' WHERE guildId = '${guildId}'`
        );

        await this.connection.query(
            `UPDATE guildConfig SET memberRole = '${memberRoleId}' WHERE guildId = '${guildId}'`
        );


        message.channel.send(lang.setup.success(mureRoleId, memberRoleId))
        StateManager.emit('addMuteRole', guildId, mureRoleId);
        StateManager.emit('addMemberRole', guildId, memberRoleId)
        StateManager.emit('setupDone', guildId, setup);
        message.guild.channels.cache.forEach(channel =>{
            if(channel.type == 'text'){
                channel.updateOverwrite(muteRole,{
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                }, `Setup par ${message.author.tag}`)
            }
            if(channel.type == 'voice'){
                channel.updateOverwrite(muteRole,{
                    SPEAK: false
                }, `Setup par ${message.author.tag}`)
            }
        })
    } catch (err) {
        console.log(err)
        message.channel.send(lang.setup.error(mureRoleId, memberRole))
    }
});


embedsColor(guildEmbedColor);
StateManager.on('ownerUpdate', (guildId, data) => {
    guildOwner.set(guildId, data);
})
StateManager.on('ownerFetched', (guildId, data) => {
    guildOwner.set(guildId, data);

})
langF(guildLang);
