const Discord = require("discord.js");
const StateManager = require('../../utils/StateManager');
const guildEmbedColor = new Map();
let mutedUser =[]
let logsChannelF = require('../../function/fetchLogs');
const logsChannelId = new Map();
const guildMuteRole = new Map();
let embedsColor = require('../../function/embedsColor');
const Date2MysqlFormat = require('date2mysqlformat');
const {Logger} = require('advanced-command-handler');
module.exports = {
    /**
     * Starts checking...
     * @param {object} client The Discord Client instance
     */

     async init(client){
        this.connection = StateManager.connection;
        await this.connection.query(`SELECT * FROM tempMute`).then((result) =>{
            result[0].forEach(member =>{
                mutedUser.push(member)
            })
        })

        setInterval(() =>{
            if(mutedUser.length == 0) return;
            mutedUser.filter(info => Date2MysqlFormat.dateAndTime(new Date()) >= Date2MysqlFormat.dateAndTime(info.muteEnd)).forEach(async (memberInfo) =>{
                const guild = client.guilds.cache.get(memberInfo.guildId)
                const muteId = memberInfo.id
                
                if(!guild) return;
                const member = guild.members.cache.get(memberInfo.userId) || await guild.members.fetch(memberInfo.userId).catch(async (err) => {
                    await this.connection.query(`DELETE FROM tempMute WHERE id = '${memberInfo.id}' `)
                    mutedUser = mutedUser.filter(info => info.id != muteId)
                })
                if(!member) return  await this.connection.query(`DELETE FROM tempMute WHERE id = '${memberInfo.id}' `)
                const color = guildEmbedColor.get(guild.id);
                if(member){
                    const muteRole = guildMuteRole.get(guild.id)
                    if(member.roles.cache.has(muteRole)){
                        member.roles.remove(muteRole).then(async () =>{
                            Logger.log(`${Logger.setColor('teal')}${member.user.tag} a été unmute`, 'Success unmute')
                            await this.connection.query(`DELETE FROM tempMute WHERE id = '${memberInfo.id}' `).then(() =>{
                                let logChannelId = logsChannelId.get(guild.id);
                                if (logChannelId != undefined) {
                                    let logChannel = guild.channels.cache.get(logChannelId)
                                    const logsEmbed = new Discord.MessageEmbed()
                                        .setTitle("\`❌\` Unmute temporaire d'un membre")
                                        .setDescription(`
                        				\`👨‍💻\` Auteur : **${member.user.tag}** \`(${member.user.id})\` est unmute après :\n
                                        \`\`\`${memberInfo.rawTime}\`\`\`
                    
                        				`)
                                        .setTimestamp()
                                        .setFooter("🕙")
                                        .setColor(`${color}`)
                    
                                        .setTimestamp()
                                        .setFooter("🕙")
                                        .setColor(`${color}`)
                                        if(logChannel != undefined){
                                            logChannel.send(logsEmbed)

                                        }
                                }
                                mutedUser = mutedUser.filter(info => info.id != muteId)
                               

                            })
                        })
                    }
                   
                    
                }

            })
        }, 1000)
     }
};

StateManager.on('addMuteRole', (guildId, muteRole) => {
	guildMuteRole.set(guildId, muteRole)
});

StateManager.on('muteIdFetched', (guildId, muteRole) => {
	guildMuteRole.set(guildId, muteRole)
});
StateManager.on('tempMute', muted =>{
    mutedUser = muted
})

logsChannelF(logsChannelId, 'mod');
embedsColor(guildEmbedColor);