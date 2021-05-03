const Event = require('../../structures/Handler/Event');
const {Logger} = require("advanced-command-handler");
const DBL = require("dblapi.js");
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
            if(message.author.id === "723249126833127537") return;
            if(message.author.id === "836749611862982686") return;
            if(message.author.id === "770026109294739476") return;
            
            
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

            const { perm, permEnable, perm1, perm2, perm3, perm4 } = message.guild;
            if(permEnable && perm.size > 0 && perm.has(cmd.name)){
                const permPostion = {
                    'perm1': 1,
                    'perm2': 2,
                    'perm3': 3,
                    'perm4': 4,
                }
                const perms = perm.get(cmd.name);
                let permOfUser = 0;
                const rolePerm1 = message.guild.roles.cache.get(perm1);
                const rolePerm2 = message.guild.roles.cache.get(perm2);
                const rolePerm3 = message.guild.roles.cache.get(perm3);
                const rolePerm4 = message.guild.roles.cache.get(perm4);
                if(rolePerm4 && rolePerm4.members.has(message.member.id)){
                    permOfUser = 4;
                }
                if(rolePerm3 && rolePerm3.members.has(message.member.id) && permOfUser < 4){
                    permOfUser = 3
                }
                if(rolePerm2 && rolePerm2.members.has(message.member.id) && permOfUser < 4){
                    permOfUser = 2
                }
                if(rolePerm1 && rolePerm1.members.has(message.member.id) && permOfUser < 4){
                    permOfUser = 1
                }
                const permToHave = permPostion[perms];

                if(permToHave > permOfUser){
                    return message.channel.send(client.lang(message.guild.lang).perm.noPermEnough)
                }

            }
            if(cmd.onlyTopGg && !client.botperso){
                const dbl = new DBL(client.config.topGgToken, client)
                let hasVoted = await dbl.hasVoted(message.author.id)
                if(!hasVoted) return message.channel.send(client.lang(message.guild.lang).antiraidConfig.noVote)
            }
            if (cmd.ownerOnly) {
                if (client.isOwner(message.author.id)) {
                    Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white')

                    return cmd.run(client, message, args);
                } else {
                    Logger.warn(`${message.author.tag} ${Logger.setColor(`white`, `tried the ownerOnly command: ${cmd.name}`)} `, `COMMAND`)
                    return await message.channel.send(client.lang(message.guild.lang).error.ownerOnly);
                }
            } else if (cmd.guildOwnerOnly  && !permEnable || !perm.has(cmd.name) && cmd.guildOwnerOnly) {
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
                if(!permEnable || !perm.has(cmd.name)){
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
                }
                cmd.run(client, message, args);
                Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white');

            }

        }

    }
}

