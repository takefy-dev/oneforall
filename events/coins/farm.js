const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')


module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate',
        });
    }

    async run(client, oldState, newState) {
        if (newState.member.user.bot) return;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(oldState.guild.id);
        const { enable } = guildData.get('coinsSettings');
        const xpEnable = guildData.get('xp');
        if(!enable && !xpEnable) return;
        const keyMember = `${newState.guild.id}-${newState.member.id}`;
        if (newState.channel)
            client.managers.voiceManager.addVoice(keyMember, newState.member);
        else if (!newState.channel && client.managers.voiceManager.has(keyMember))
            client.managers.voiceManager.delete(keyMember);

    }
}