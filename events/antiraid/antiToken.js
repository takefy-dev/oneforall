const Event = require('../../structures/Handler/Event');
const ms = require("ms");
const {Collection} = require('discord.js');
const antiTokenMap = new Collection()
module.exports = class antiToken extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
        });
    }

    async run(client, member) {
        const guild = member.guild;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id)
        const color = guildData.get('color');
        const antiraidConfig = guildData.get('antiraid');
        let antiraidLog = guildData.get('logs').antiraid
        let {logs} = guildData.lang
        const isOn = antiraidConfig.enable["antiToken"];
        if (!isOn) return;
        let isGuildOwner = guildData.isGuildOwner(member.id);
        let isBotOwner = client.isOwner(member.id);
        let isWlBypass = antiraidConfig.bypass["antiToken"];
        if (isWlBypass) var isWl = guildData.isGuildWl(member.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return client.Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `ANTI TOKEN`, 'pink');
        if (isWlBypass && !isWl || !isWlBypass) {
            const parsedLimit = antiraidConfig.config['antiTokenLimit'].split('/');
            const limit = parsedLimit[0];
            const time = ms(parsedLimit[1]);
            const {antiToken} = guildData.get('antiraidLimits')
            console.log(antiToken, 'before')
            if (antiToken.date) {
                const diff = new Date() - new Date(antiToken.date)
                const counter = antiToken.counter;
                console.log(diff)
                console.log(counter, limit)
                if (diff < time && counter < limit) {
                    antiToken.counter += 1;
                    antiToken.recentJoined.push(member.id);

                    console.log(antiToken, 'after1')
                }
                if (counter > limit && diff >= 1000 * 10) {
                    delete antiToken.date;
                    antiToken.counter = 0;
                    antiToken.recentJoined = [];
                }
                antiToken.date = new Date();
                guildData.save()
                if (counter < limit) return

            } else {
                antiToken.date = new Date();
                antiToken.counter += 1
                antiToken.recentJoined.push(member.id)
                console.log(antiToken, 'after2')

                return guildData.save()
            }
            const channel = guild.channels.cache.get(antiraidLog)
            let sanction = antiraidConfig.config['antiToken'];
            if (sanction === 'ban') {
                await guild.members.ban(member.id, {reason: `OneForAll - Type : antiToken`})
                for await(const id of antiToken.recentJoined) await guild.members.ban(id, {reason: `OneForAll - Type : antiToken`})
            } else if (sanction === 'kick') {

                member.kick(
                    `OneForAll - Type: antiToken `
                )
                for await(const id of antiToken.recentJoined) {
                    const m = await guild.members.fetch(id);
                    await m.kick(`OneForAll - Type : antiToken`)
                }
            } else if (sanction === 'unrank') {
                await member.roles.set(member.roles.cache.filter(role => !role.permissions.has("KICK_MEMBERS") || !role.permissions.has("BAN_MEMBERS") || !role.permissions.has("ADMINISTRATOR") || !role.permissions.has("MANAGE_CHANNELS") ||
                    !role.permissions.has("MANAGE_GUILD") || !role.permissions.has("MANAGE_ROLES") || !role.permissions.has("MENTION_EVERYONE") || !role.permissions.has("MOVE_MEMBERS")))

            }

            if (channel && !channel.deleted) {
                channel.send(logs.antiToken(member, color, sanction))
            }


        }


    }
}