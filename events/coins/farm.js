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
        if(!oldState.guild.config) return
        if (newState.bot) return;
        if (newState.channelID !== null) {
            let status = "default";
            if(!oldState.mute && newState.mute || !oldState.deaf && newState.deaf){
                status = "mute";
            }else if(!oldState.streaming && newState.streaming || !oldState.selfVideo && newState.selfVideo){
                status = "stream"
            }

            newState.guild.coinsFarmer.set(newState.id, {
                status,
                boost: newState.guild.boost[status]
            })
        } else {

            if (newState.guild.coinsFarmer.has(oldState.id)) newState.guild.coinsFarmer.delete(oldState.id)

            Logger.log(`${oldState.id || newState.id}`, `Player leaved`, 'orange')
        }
    }
}