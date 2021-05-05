const StateManager = require('../../utils/StateManager');
const Discord = require('discord.js')


const Event = require('../../structures/Handler/Event');

module.exports = class presenceUpdate extends Event {
    constructor() {
        super({
            name: 'presenceUpdate',
        });
    }

    async run(client, oldMember, newMember) {
        this.connection = StateManager.connection;
        if (!client.botperso) return;
        client.guilds.cache.forEach(guild => {

            if (!oldMember) return;
            const msg = guild.config.soutienMsg
            const roleId = guild.config.soutienId
            const role = guild.roles.cache.get(roleId)
            if (!role) return;
            const isOn = guild.config.soutienOn;
            let status = newMember.user.presence.activities.map(a => a.state)
            if (guild.members.cache.get(newMember.user.id) === undefined) return;

            if (isOn) {
                return;

            } else if (oldMember === undefined || newMember === undefined) {
                return;
            } else if (oldMember.status !== newMember.status || oldMember == undefined || newMember == undefined) {
                return;
            } else if (isOn ) {
                if (status[0] != null && status[0].includes(msg)) {
                    guild.members.cache.get(newMember.user.id).roles.add(roleId)
                } else {
                    if (guild.members.cache.get(newMember.user.id) === undefined) return;
                    if (guild.members.cache.get(newMember.user.id).roles.cache.some((r) => r.id === roleId)) {
                        guild.members.cache.get(newMember.user.id).roles.remove(roleId)
                    }
                }
            }
        });
    }
}






