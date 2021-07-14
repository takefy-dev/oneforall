const Event = require('../../structures/Handler/Event');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
const ms = require("ms");
const moment = require("moment")

module.exports = class AntiDc extends Event {
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
        let antiraidLog = guildData.get('logs').antiraid;
        let {logs} = guildData.lang
        const isOn = antiraidConfig.enable["antiDc"];
        if (!isOn) return;
        const limit = ms(antiraidConfig.config["antiDcLimit"]);
        const user = client.users.fetch(member.user.id)
        const time = Date.now() - user.createdAt;
        if (time < limit){
            const logsChannel = guild.channels.cache.get(antiraidLog)
            let sanction = antiraidConfig.config["antiDc"];
            if (sanction === 'ban') {
                await guild.members.ban(member, {reason: 'OneForAll - Type : antiDc'})
            } else if (sanction === 'kick') {
                member.kick(
                    `OneForAll - Type: antiDc `
                )
            }
            if(logsChannel && !logsChannel.deleted){
                logsChannel.send(logs.antiDc(member,  moment(user.createdAt).format("DD/MM/YYYY"), antiraidConfig.config["antiDcLimit"], color, sanction))
            }
            try{
                user.send(logs.antiDc(member, moment(user.createdAt).format("DD/MM/YYYY"), antiraidConfig.config["antiDcLimit"], color, sanction))

            }catch (e){

            }
        }


    }
}