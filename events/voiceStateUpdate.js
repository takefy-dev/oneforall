const Event = require('../structures/Event');
const { Logger } = require('advanced-command-handler')


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'voiceStateUpdate',
        });
    }
    async run(client, oldState, newState){
        if (newState.bot) return;
        if (newState.channelID !== null) {
            let status = "default";
            if (!oldState.streaming && newState.streaming || newState.selfVideo && !oldState.selfVideo) {
                status = "stream";

            } else if (oldState.streaming && !newState.streaming && !newState.selfVideo && oldState.selfVideo && oldState.selfMute && !newState.selfMute && !oldState.serverMute && newState.serverMute && oldState.serverDeaf && !newState.serverDeaf) {
                status = "default";
            } else if (!oldState.selfMute && newState.selfMute || !oldState.serverMute && newState.serverMute || !oldState.serverDeaf && newState.serverDeaf) {
                status = "mute";
            }
            newState.guild.coinsFarmer.set(newState.id, {
                status,
                boost: newState.guild.boost[status]
            })
        } else {

            if(newState.guild.coinsFarmer.has(oldState.id)) newState.guild.coinsFarmer.delete(oldState.id)

            Logger.log(`${oldState.id || newState.id }`, `Player leaved`, 'orange')
        }
    }
}