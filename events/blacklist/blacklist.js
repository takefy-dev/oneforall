const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
const ms = require("ms");
const moment = require("moment")

module.exports = class AntiBot extends Event {
    constructor() {
        super({
            name: 'guildMemberAdd',
        });
    }

    async run(client, member) {
        if(member.user.id === client.user.id) return;
        const guild = member.guild;
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(guild.id);
        const owner = client.botperso ? client.owners[client.owners.length - 1] : guild.ownerId

        const blacklistData =client.managers.blackListManager.getAndCreateIfNotExists(owner);
        const isOn = blacklistData.get('enable');
        const blacklist = blacklistData.get('blacklisted');
        const color = guildData.get('color');
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang
        if (!isOn) return;
        let isBotOwner = client.isOwner(member.id);
        if(isBotOwner) return;
        if(!blacklist) return;
        if(blacklist.includes(member.id)){
            await guild.members.ban(member, {reason:`OneForAll - Type : Blacklist`})
            const channel = guild.channels.cache.get(antiraidLog)
            if(channel && !channel.deleted){
                channel.send({embeds : [logs.blacklist(member, color, "ban")]})
            }
        }


    }
}