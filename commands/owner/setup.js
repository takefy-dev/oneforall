const discord = require('discord.js')

const StateManager = require('../../utils/StateManager');

const guildOwner = new Map();
const { Command } = require('advanced-command-handler');
const guildLang = new Map();
const langF = require('../../function/lang')
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
 
    const lang = require(`../../lang/${message.guild.lang}`)

    let owner = message.guild.ownerID;

    if (client.BotPerso) {
        const fs = require('fs');
        const path = './config.json';
        if (fs.existsSync(path)) {
            owner = require('../../config.json').owner;
        } else {
            owner = process.env.OWNER
        }
    };

    if (!client.isGuildOwner(message.guild.owners, message.author.id) && owner !== message.author.id && !client.isOwner(message.author.id)) return message.channel.send(lang.error.notListOwner)

    message.channel.send(lang.setup.muteQ)
    const responseMuteRole = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000, errors: ['time'] }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
    const CollectedMuteRole = responseMuteRole.first()
    if (CollectedMuteRole.content.toLowerCase() === "cancel") return message.channel.send(lang.cancel)


    message.channel.send(lang.setup.memberRoleQ)
    const responseMembreRole = await message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, timeout: 30000, errors: ['time'] }).catch(() => { message.channel.send("Opération annulée pas de réponse après 30s") })
    const CollectedMembreRole = responseMembreRole.first()
    if (CollectedMembreRole.content.toLowerCase() === "cancel") return message.channel.send(lang.cancel)


    let muteRole = CollectedMuteRole.mentions.roles.first();
    let mureRoleId;
    if (!muteRole) {
        mureRoleId = CollectedMuteRole.content.toLowerCase();
    } else {
        mureRoleId = muteRole.id;
    }

    let memberRole = CollectedMembreRole.mentions.roles.first();
    let memberRoleId;
    if (!memberRole) {
        memberRoleId = CollectedMembreRole.content.toLowerCase();
    } else {
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
        message.guild.guildConfig.muteRoleId = mureRoleId;
        message.guild.guildConfig.memberRole = memberRoleId;
        message.guild.guildConfig.setup = '1';
        message.guild.channels.cache.forEach(channel => {
            if (channel.type === 'text') {
                channel.updateOverwrite(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                }, `Setup par ${message.author.tag}`)
            }
            if (channel.type === 'voice') {
                channel.updateOverwrite(muteRole, {
                    SPEAK: false
                }, `Setup par ${message.author.tag}`)
            }
        })
    } catch (err) {
        console.log(err)
        message.channel.send(lang.setup.error(mureRoleId, memberRole))
    }
});




langF(guildLang);
