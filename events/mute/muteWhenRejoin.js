const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
const moment = require('moment')

module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
        });
    }

    async run(client, member) {
        const {userManager, guildManager} = client.managers;
        const guild = member.guild;
        const userData = userManager.getAndCreateIfNotExists(`${guild.id}-${member.id}`);
        const guildData = guildManager.getAndCreateIfNotExists(guild.id);
        const mute = userData.get('mute')
        const muteRoleId = guildData.get('muteRoleId')
        if (mute.muted) {
            const role = guild.roles.cache.get(muteRoleId);
            if (role && !role.deleted) {
                await member.roles.add(role, `Mute when leave guild`)
            }
        }

    }
}