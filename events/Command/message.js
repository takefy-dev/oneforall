const Event = require('../../structures/Handler/Event');
const {Logger} = require("advanced-command-handler");

module.exports = class message extends Event {
    constructor() {
        super({
            name: 'message',
        });
    }

    async run(client, message) {

        let prefix = message.guild.prefix;

        const botMention = message.mentions.has(client.user)


        if (botMention) {
            if (message.content.includes("@here") || message.content.includes("@everyone")) return false;
            if (!prefix) return message.channel.send(`Votre serveurs n'est pas dans ma base de donnée veuillez me kick et m'ajouter !`)
            return message.channel.send(`<:778353230484471819:780727288903237663> Mon prefix est: \`${prefix}\``)
        }

        if (!message.content.startsWith(prefix)) return;
        if (message.author.bot || message.system) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = await client.commands.get(args[0].toLowerCase().normalize()) || await client.aliases.get(args[0].toLocaleLowerCase().normalize());
        args.shift();
        if (prefix && cmd && message.guild) {

            if (client.isOwner(message.author.id)) {
                Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white')

                return cmd.run(client, message, args)
            }

            if(cmd.cooldown > 0){
                if(client.cooldown.has(message.author.id)){
                    const time = client.cooldown.get(message.author.id)
                    return  message.channel.send(client.lang(message.guild.lang).error.cooldown(time))
                }else{
                    client.cooldown.set(message.author.id, cmd.cooldown)
                    setTimeout(() => {
                        client.cooldown.delete(message.author.id)
                    }, cmd.cooldown * 1000)
                }
            }
            if(client.maintenance){
                return message.channel.send(client.lang(message.guild.lang).maintenance)
            }
            if (cmd.ownerOnly) {
                if (client.isOwner(message.author.id)) {
                    Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white')

                    return cmd.run(client, message, args);
                } else {
                    Logger.warn(`${message.author.tag} ${Logger.setColor(`white`, `tried the ownerOnly command: ${cmd.name}`)} `, `COMMAND`)
                    return await message.channel.send(client.lang(message.guild.lang).error.ownerOnly);
                }
            } else if (cmd.guildOwnerOnly) {
                if (message.guild.isGuildOwner(message.author.id)) {
                    Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white');
                    return cmd.run(client, message, args);
                } else {
                    Logger.warn(`${message.author.tag} ${Logger.setColor(`white`, `tried the guildOwnerOnly command: ${cmd.name}`)} `, `COMMAND`)
                    return await message.channel.send(client.lang(message.guild.lang).error.notListOwner)

                }
            } else if (cmd.guildCrownOnly) {
                if(message.guild.ownerID !== message.author.id){
                    return message.channel.send(client.lang(message.guild.lang).error.notGuildOwner)
                }else{
                    Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white');
                    return cmd.run(client, message, args);
                }
            } else {
                for (const commandPermissions of cmd.userPermissions) {
                    if (!message.member.hasPermission(commandPermissions) && message.guild.ownerID !== message.author.id) {
                        return message.channel.send(client.lang(message.guild.lang).error.userPermissions(commandPermissions))
                    }
                }
                for (const commandPermissions of cmd.clientPermissions) {
                    if (!message.guild.me.hasPermission(commandPermissions)) {
                        return message.channel.send(client.lang(message.guild.lang).error.clientPermissions(commandPermissions))
                    }
                }
                cmd.run(client, message, args);
                Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white');

            }
        }

    }
}

