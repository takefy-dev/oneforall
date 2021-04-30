const StateManager = require('../../utils/StateManager');
const ms = require('ms');
const muteRoleId = new Map();
const logsChannelId = new Map();
const moment = require('moment')
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'tempmute',
            description: 'Tempmute a members | Tempmute un membre',
            usage: 'tempmute <mention/id> <time>',
            category: 'moderation',
            userPermissions: ['MUTE_MEMBERS'],
            clientPermissions: ['MUTE_MEMBERS'],
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const lang = client.lang(message.guild.lang)
        this.connection = StateManager.connection;
        let isSetup = message.guild.setup;
        if (!isSetup) return message.channel.send(lang.error.noSetup);

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send(lang.tempmute.errorNoMember);

        const muteRole = message.guild.roles.cache.get(message.guild.config.muteRoleId);
        if (!muteRole) return message.channel.send(lang.tempmute.errorCantFindRole);

        const time = args[1];
        if (!time || isNaN(ms(time))) return message.channel.send(lang.tempmute.errorTime);

        if (member.roles.cache.has(muteRole.id)) return message.channel.send(lang.tempmute.errorAlreadyMute(member));
        member.roles.add(muteRole).then(async () => {
            const color = message.guild.color

            message.channel.send(lang.tempmute.success(member, time));
            // let logChannelId = logsChannelId.get(message.guild.id);
            // if (logChannelId != undefined) {
            //     let logChannel = message.guild.channels.cache.get(logChannelId)
            //
            //     const logsEmbed = new Discord.MessageEmbed()
            //         .setTitle("\`❌\` Mute temporaire d'un membre")
            //         .setDescription(`
            // 			\`👨‍💻\` Auteur : **${message.author.tag}** \`(${message.author.id})\` a mute **${member.user.tag}** \`(${member.user.id})\` pendant :\n
            //             \`\`\`${time}\`\`\`
            //
            // 			`)
            //         .setTimestamp()
            //         .setFooter("🕙")
            //         .setColor(`${color}`)
            //     if (logChannel != undefined) {
            //         logChannel.send(logsEmbed)
            //
            //     }
            const timeLenght = time.split('').length
            const numberT = parseInt(time.slice(0, timeLenght - 1))
            const dateF = time.split('')[timeLenght - 1].toString()
            console.log(numberT, dateF)


            const now = moment().utc()

            const muteEnd = now.add(numberT, dateF)

            try {
                await message.guild.updateMute(member.id, true, muteEnd)
            } catch (err) {
                console.log(err)
            }


        })


    }
};

