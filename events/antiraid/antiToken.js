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

            if (antiTokenMap.get(guild.id)) {
                const diff = new Date() - antiTokenMap.get(guild.id).date
                const counter = antiTokenMap.get(guild.id).counter;
                if (diff < time && counter < limit) {
                    return antiTokenMap.set(guild.id, {
                        date: new Date(),
                        counter: antiTokenMap.get(guild.id).counter + 1
                    })
                }else{
                    if(counter < limit) return

                }
            } else {
                return antiTokenMap.set(guild.id, {date: new Date(), counter: 0})
            }
            const channel = guild.channels.cache.get(antiraidLog)
            let sanction = antiraidConfig.config['antiToken'];
            if (sanction === 'ban') {
                await guild.members.ban(member.id, {reason: `OneForAll - Type : antiToken`})
            } else if (sanction === 'kick') {
                member.kick(
                    `OneForAll - Type: antiToken `
                )
            } else if (sanction === 'unrank') {
                let roles = []
                await member.roles.cache
                    .map(role => roles.push(role.id))

                await member.roles.remove(roles, `OneForAll - Type: antiToken`)

            }

            if (channel && !channel.deleted) {
                channel.send(logs.antiToken(member, color, sanction))
            }


        }


    }
}