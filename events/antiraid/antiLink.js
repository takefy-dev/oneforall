const Event = require('../../structures/Handler/Event');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')
const {Collection} = require("discord.js");

const spammer = new Collection()
module.exports = class Message extends Event{
    constructor() {
        super({
            name: 'message',
        });
    }
    async run(client, message){
        if(message.webhookID) return;
        const { muteRoleId } = message.guild.config;
        const muteRole = message.guild.roles.cache.get(muteRoleId);
        if(!muteRoleId || !muteRole || muteRole.deleted || muteRole.managed) return;
        const color = message.guild.color;
        const antiraidConfig = message.guild.antiraid;
        let {antiraidLog} = message.guild.logs;
        let {logs} = client.lang(message.guild.lang)
        const isOn = antiraidConfig.enable["antiLink"];
        if(!isOn) return;


        if (message.author.id === client.user.id)  return Logger.log(`No sanction oneforall`, `CHANNEL Create`, 'pink');
        if(message.guild.ownerID === message.author.id) return Logger.log(`No sanction crown`, `CHANNEL Create`, 'pink');

        let isGuildOwner = message.guild.isGuildOwner(message.author.id);
        let isBotOwner = client.isOwner(message.author.id);


        let isWlBypass = antiraidConfig.bypass["antiLink"];
        if (isWlBypass) var isWl = message.guild.isGuildWl(message.author.id);
        if (isGuildOwner || isBotOwner || isWlBypass && isWl) return Logger.log(`No sanction  ${isWlBypass && isWl ? `whitelisted` : `guild owner list or bot owner`}`, `CHANNEL CREATE`, 'pink');


        if (isWlBypass && !isWl || !isWlBypass) {
            const { member } = message;
            const channel = message.guild.channels.cache.get(antiraidLog);
            let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
            let reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
            if(reg.test(message.content) || discordInvite.test(message.content)){
                if(message.deletable) message.delete().catch(e => {})
                let msg = `${message.author}, vous n'êtes pas autorisé à poster des liens`
                let embed = new Discord.MessageEmbed()
                    .setColor(color)
                    .setDescription(msg);
                message.channel.send(embed).then(m => m.delete({timeout: 2000}))
                if(!spammer.has(message.author.id)) {
                    spammer.set(message.author.id, 1)
                }else{
                    const data = spammer.get(message.author.id)
                    spammer.set(message.author.id, data + 1);
                }
                if(spammer.get(message.author.id) > 5){
                    const { muteRoleId } = message.guild.config;
                    const muteRole = message.guild.roles.cache.get(muteRoleId);
                    if(!muteRoleId || !muteRole || muteRole.deleted || muteRole.managed) return;
                    await message.member.roles.add(muteRole, `Oneforall - anti spam link`)
                    message.channel.send(`Vous avez été mute car vous postez trop de lien`)
                    if(channel && !channel.deleted){
                        return channel.send(logs.antiLink(member, message.channel.id, message.content, color, 'mute'))
                    }
                }
                if(channel && !channel.deleted){
                    return channel.send(logs.antiLink(member, message.channel.id, message.content, color, 'delete'))
                }

            }
        }
    }
}