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
        const guild = member.guild;
        const { muted } = guild;
        const { muteRoleId } = guild.config
        if(muted.has(member.id)){
            const role = guild.roles.cache.get(muteRoleId);
            if(role && !role.deleted){
                await member.roles.add(role, `Mute when leave the serveur`)
            }
        }

    }
}