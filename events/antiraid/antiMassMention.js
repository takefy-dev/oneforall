const Event = require('../../structures/Handler/Event');
const {Collection} = require("discord.js");
const ms = require("ms");

module.exports = class Message extends Event {
    constructor() {
        super({
            name: 'messageCreate',
        });
    }

    async run(client, message) {
        if (!message.guild) return;
        if (message.webhookID) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const color = guildData.get('color');
        const antiraidConfig = guildData.get('antiraid');
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang
        const isOn = antiraidConfig.enable["antiMassMention"];
        if (!isOn) return;
        if (message.author.id === client.user.id || message.guild.ownerID === message.author.id) return
        let isGuildOwner = guildData.isGuildOwner(message.author.id);
        let isBotOwner = client.isOwner(message.author.id);
        let isWlBypass = antiraidConfig.bypass["antiMassMention"];
        if (isWlBypass) var isWl = guildData.isGuildWl(message.author.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return client.Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `antiMassMention`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const {member} = message;
            const parsedLimit = antiraidConfig.config['antiMassMentionLimit'].split('/');
            const limit = parsedLimit[0];
            const time = ms(parsedLimit[1]);
            const { roles, members } = message.mentions;
            if(!roles.size && !members.size) return
            const userData = client.managers.userManager.getAndCreateIfNotExists(`${message.guild.id}-${member.id}`);
            const { mentions } = userData.get('antiraidLimit')
            if (mentions.date) {
                const diff = new Date() - new Date(mentions.date)
                const counter = mentions.counter;
                if (diff < time && counter < limit) {
                    mentions.counter += roles.size;
                    mentions.counter += members.size;
                }
                if (diff >= time) {
                    delete mentions.date;
                    mentions.counter = 0;

                }
                mentions.date = new Date();
                userData.save()
                if (counter < limit) return

            } else {
                mentions.date = new Date();
                mentions.counter += roles.size;
                mentions.counter += members.size;
                return guildData.save()
            }

            const position = message.channel.position;
            const rateLimitPerUser = message.channel.rateLimitPerUser;
            let newChannel = await message.channel.clone()
            await message.channel.delete();
            await newChannel.setPosition(position);
            await newChannel.setRateLimitPerUser(rateLimitPerUser)
            const channel = message.guild.channels.cache.get(antiraidLog)
            let sanction = antiraidConfig.config['antiMassMention'];
            if (sanction === 'ban') {
                await message.guild.members.ban(member.id, {reason: `OneForAll - Type : antiMassMention`})
            } else if (sanction === 'kick') {

                member.kick(
                    `OneForAll - Type: antiMassMention `
                )
            } else if (sanction === 'unrank') {
                await member.roles.set(client.functions.getRoleWithoutSensiblePermissions(member.roles.cache), `antiMassMention`)
            }
            if (channel && !channel.deleted) {
                channel.send(logs.antiMassMention(member, color, newChannel, sanction))
            }


        }
    }
}