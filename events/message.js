const StateManager = require('../utils/StateManager');
let checkBotOwner = require('../function/check/botOwner');
let embedsColor = require('../function/embedsColor');
const guildEmbedColor = new Map();
const logsChannelId = new Map();
let logsChannelF = require('../function/fetchLogs');
const guildCommandPrefixes = new Map();
const {CommandHandlerError, Logger, BetterEmbed, Command, getThing} = require('advanced-command-handler');
const {DateTime} = require('luxon');
const Discord = require('discord.js');
const antilinkGuild = new Map();
// antispam
const usersMap = new Map();
const guildMuteRole = new Map();
const spamGuild = new Map();
let checkWl = require('../function/check/checkWl');
const guildAntiraidConfig = new Map();
const statsOn = new Map();

const guildLang = new Map();
let langF = require('../function/lang')


const Event = require('../structures/Handler/Event');

module.exports = class message extends Event {
    constructor() {
        super({
            name: 'message',
        });
    }

    async run(client, message) {

        if (message.guild == null) return;
        // console.log(message.guild.guildConfig.prefix)
        // if(!guildLang.has(message.guild.id)) return;

        const color =message.guild.color
        this.connection = StateManager.connection;
        const lang = require(`../lang/${message.guild.lang}`);

        function hasDiscordInvite(string) {
            let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;

            if (discordInvite.test(string)) return true;
            return false;
        }

        function deleteMessage(message, type) {
            if (message.author.id === client
                .user.id) return;
            if (message.deletable) {
                message.delete().catch(() => {
                });
            }


            if (type === 'link') {
                let msg = `${message.author}, vous n'êtes pas autorisé à poster des liens`
            } else {
                let msg = `${message.author}, votre message a été supprimé sans raison.`
            }
            let embed = new Discord.MessageEmbed()
                .setColor(`${color}`)
                .setDescription(msg);
            message.channel.send(embed)


        }

        const isAntilinkOn = antilinkGuild.get(message.guild.id);

        let isAntilink
        if (isAntilinkOn == "0") {
            isAntilink = false
        }
        if (isAntilinkOn == '1') {
            isAntilink = true
        }
        if (isAntilinkOn == false) {
            if (message.author.bot) return;
        }

        let isOnWl;

        if (isAntilink == true) {
            const isWlOnFetched = await this.connection.query(`SELECT antilink FROM antiraidWlBp WHERE guildId = '${message.guild.id}'`);
            const isWlOnfetched = isWlOnFetched[0][0].antilink;
            if (isWlOnfetched == "1") {
                isOnWl = true
            }
            ;
            if (isWlOnfetched == "0") {
                isOnWl = false
            }
            ;
            if (isOnWl == true) {
                let isWl = checkWl(message.guild.id, message.author.id);

                // let isWlFetched = await this.connection.query(`SELECT whitelisted FROM guildConfig WHERE guildId = '${message.guild.id}'`);
                // let isWlfetched = isWlFetched[0][0].whitelisted.toString();
                // let isWl1 = isWlfetched.split(",");
                // if (isWl1.includes(message.author.id)) { isWl = true };
                // if (!isWl1.includes(message.author.id)) { isWl = false };
            }

        }
        let isOwner = checkBotOwner(message.guild.id, message.author.id);
        if (isOwner == false && isAntilink == true && hasDiscordInvite(message.content) && message.author.id != message.guild.ownerID && isOnWl == false && message.webhookID == null) {
            deleteMessage(message, 'link');

            let logChannelId = logsChannelId.get(message.guild.id);
            if (logChannelId == undefined) return;


            let logChannel = client
                .guilds.cache.get(message.guild.id).channels.cache.get(logChannelId)
            if (logChannel == undefined) return;
            if (message.author.id === client
                .user.id) return;
            const user = message.guild.members.cache.get(message.author.id)
            const logsEmbed = new Discord.MessageEmbed()
                .setTitle('\`❌\` Post de lien')
                .setDescription(`
           \`👨‍💻\` Auteur : **${user.user.tag}** \`(${user.id})\` a posté un lien  \n
            \`\`\`${message.content}\`\`\`

        `)
                .setTimestamp()
                .setFooter("🕙")
                .setColor(`${color}`)
            logChannel.send(logsEmbed);
        } else if (isOwner == false && isAntilink == true && hasDiscordInvite(message.content) && isOnWl == true && isWl == false && message.author.id != message.guild.ownerID && message.webhookID == null) {
            deleteMessage(message, 'link');

            let logChannelId = logsChannelId.get(message.guild.id);
            if (logChannelId == undefined) return;

            let logChannel = client
                .guilds.cache.get(message.guild.id).channels.cache.get(logChannelId)
            if (logChannel == undefined) return;
            if (message.author.id === client
                .user.id) return;
            const user = message.guild.members.cache.get(message.author.id)
            const logsEmbed = new Discord.MessageEmbed()
                .setTitle('\`❌\` Post de lien ')
                .setDescription(`
           \`👨‍💻\` Auteur : **${user.user.tag}** \`(${user.id})\` a posté un lien \n
            \`\`\`${message.content}\`\`\`

        `)
                .setTimestamp()
                .setFooter("🕙")
                .setColor(`${color}`)
            logChannel.send(logsEmbed);

        }

        //#region antispam
        let isSpamF = spamGuild.get(message.guild.id);
        let isSpamOn;
        if (isSpamF == '1') isSpamOn = true;
        if (isSpamF == '0') isSpamOn = false;
        const LIMIT = 5;
        const TIME = 7000;
        const DIFF = 3000;
        if (isOwner == false && isSpamOn == true && message.webhookID == null && !message.member.hasPermission('ADMINISTRATOR') && message.author.id != message.guild.ownerID && isOnWl == false) {
            const muteRole = message.guild.roles.cache.get(guildMuteRole.get(message.guild.id));

            if (usersMap.has(message.author.id)) {
                const userData = usersMap.get(message.author.id);
                const {lastMessage, timer} = userData;
                const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                let msgCount = userData.msgCount;
                if (difference > DIFF) {
                    clearTimeout(timer);
                    // console.log("Clear timeout");
                    userData.msgCount = 1;
                    userData.lastMessage = message;
                    userData.timer = setTimeout(() => {
                        usersMap.delete(message.author.id);
                        // console.log('removed from reset')
                    }, TIME)
                    usersMap.set(message.author.id, userData)
                } else {
                    ++msgCount;
                    if (parseInt(msgCount) === LIMIT) {
                        message.member.roles.add(muteRole);
                        message.channel.send(`${message.member}, vous avez été mute car vous spammez`)
                    } else {
                        userData.msgCount = msgCount;
                        usersMap.set(message.author.id, userData);
                    }
                }
            } else {
                let fn = () => setTimeout(() => {
                    usersMap.delete(message.author.id);
                    // console.log('removed from map')
                }, TIME)
                usersMap.set(message.author.id, {
                    msgCount: 1,
                    lastMessage: message,
                    timer: fn
                });

            }
        } else if (isOwner == false && isSpamOn == true && message.webhookID == null && !message.member.permissions.has('ADMINISTRATOR') && isOnWl == true && isWl == false && message.author.id != message.guild.ownerID) {
            const muteRole = message.guild.roles.cache.get(guildMuteRole.get(message.guild.id));


            if (usersMap.has(message.author.id)) {
                const userData = usersMap.get(message.author.id);
                const {lastMessage, timer} = userData;
                const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                let msgCount = userData.msgCount;
                if (difference > DIFF) {
                    clearTimeout(timer);
                    // console.log("Clear timeout");
                    userData.msgCount = 1;
                    userData.lastMessage = message;
                    userData.timer = setTimeout(() => {
                        usersMap.delete(message.author.id);
                        // console.log('removed from reset')
                    }, TIME)
                    usersMap.set(message.author.id, userData)
                } else {
                    ++msgCount;
                    if (parseInt(msgCount) === LIMIT) {
                        if (muteRole) {
                            message.member.roles.add(muteRole);
                            message.channel.send(`${message.member}, vous avez été mute car vous spammez`)
                        }

                    } else {
                        userData.msgCount = msgCount;
                        usersMap.set(message.author.id, userData);
                    }
                }
            } else {
                let fn = () => setTimeout(() => {
                    usersMap.delete(message.author.id);
                    // console.log('removed from map')
                }, TIME)
                usersMap.set(message.author.id, {
                    msgCount: 1,
                    lastMessage: message,
                    timer: fn
                });

            }
        }


        //#endregion antispam
        let prefix = message.guild.prefix;

        const botMention = message.mentions.has(client.user)


        if (botMention) {
            if (message.content.includes("@here") || message.content.includes("@everyone")) return false;
            if (!prefix) return message.channel.send(`Votre serveurs n'est pas dans ma base de donnée veuillez me kick et m'ajouter !`)
            return message.channel.send(`<:778353230484471819:780727288903237663> Mon prefix est: \`${prefix}\``)
        }

        if (!message.content.startsWith(prefix)) return;
        if (message.author.bot || message.system) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = await client.commands.get(args[0].toLowerCase().normalize()) || await client.aliases.get(args[0].toLocaleLowerCase().normalize());
        args.shift();
        if (prefix && cmd && message.guild) {
            console.log(cmd.cooldown)
            if(cmd.cooldown > 0){
                if(client.cooldown.has(message.author.id)){
                    const time = client.cooldown.get(message.author.id)
                    return  message.channel.send(client.lang(message.guild.lang).error.cooldown(time))
                }else{
                    client.cooldown.set(message.author.id, cmd.cooldown)
                    setTimeout(() => {
                        client.cooldown.delete(message.author.id)
                    }, cmd.cooldown * 1000)
                }
            }

            if (client.isOwner(message.author.id)) {
                Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white')

                return cmd.run(client, message, args)
            }
            if (cmd.ownerOnly) {
                if (client.isOwner(message.author.id)) {
                    Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white')

                    return cmd.run(client, message, args);
                } else {
                    Logger.warn(`${message.author.tag} ${Logger.setColor(`white`, `tried the ownerOnly command: ${cmd.name}`)} `, `COMMAND`)
                    return await message.channel.send(client.lang(message.guild.lang).error.ownerOnly);
                }
            } else if (cmd.guildOwnerOnly) {
                if (message.guild.isGuildOwner(message.author.id)) {
                    Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white');
                    return cmd.run(client, message, args);
                } else {
                    Logger.warn(`${message.author.tag} ${Logger.setColor(`white`, `tried the guildOwnerOnly command: ${cmd.name}`)} `, `COMMAND`)
                    return await message.channel.send(client.lang(message.guild.lang).error.notListOwner)

                }
            } else if (cmd.guildCrownOnly) {
                if(message.guild.ownerID !== message.author.id){
                    return message.channel.send(client.lang(message.guild.lang).error.notGuildOwner)
                }else{
                    Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white');
                    return cmd.run(client, message, args);
                }
            } else {
                for (const commandPermissions of cmd.userPermissions) {
                    if (!message.member.hasPermission(commandPermissions) && message.guild.ownerID !== message.author.id) {
                        return message.channel.send(client.lang(message.guild.lang).error.userPermissions(commandPermissions))
                    }
                }
                for (const commandPermissions of cmd.clientPermissions) {
                    if (!message.guild.me.hasPermission(commandPermissions)) {
                        return message.channel.send(client.lang(message.guild.lang).error.clientPermissions(commandPermissions))
                    }
                }
                cmd.run(client, message, args);
                Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white');

            }
        }

    }
}


StateManager.on('prefixFetched', (guildId, prefix) => {
    guildCommandPrefixes.set(guildId, prefix)
})

StateManager.on('prefixUpdate', (guildId, prefix) => {
    guildCommandPrefixes.set(guildId, prefix);
});

StateManager.on('spamUpdate', (guildId, spam) => {
    spamGuild.set(guildId, spam)
})
StateManager.on('spamFetched', (guildId, spam) => {
    spamGuild.set(guildId, spam)
})

StateManager.on('antilinkUpdate', (guildId, antilink) => {
    antilinkGuild.set(guildId, antilink)
})
StateManager.on('antilinkFetched', (guildId, antilink) => {
    antilinkGuild.set(guildId, antilink)
})
StateManager.on('addMuteRole', (guildId, muteRole) => {
    guildMuteRole.set(guildId, muteRole)
});

StateManager.on('muteIdFetched', (guildId, muteRole) => {
    guildMuteRole.set(guildId, muteRole)
});
logsChannelF(logsChannelId, 'mod');

embedsColor(guildEmbedColor);
StateManager.on('antiraidConfF', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
StateManager.on('antiraidConfU', (guildId, config) => {
    guildAntiraidConfig.set(guildId, config)
})
StateManager.on('statsOnU', (guildId, on) => {
    statsOn.set(guildId, on)
})
StateManager.on('statsOnF', (guildId, on) => {
    statsOn.set(guildId, on)
})
langF(guildLang);