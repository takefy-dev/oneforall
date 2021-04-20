const Event = require('../structures/Event');
const { Logger } = require('advanced-command-handler')
module.exports = class Message extends Event{
    constructor() {
        super({
            name:"message"
        });
    }
    async run(client, message){
        let prefix = message.guild.prefix;
        if (!message.content.startsWith(prefix)) return;


        if (message.author.bot || message.system) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = await client.commands.get(args[0].toLowerCase().normalize()) || await client.aliases.get(args[0].toLocaleLowerCase().normalize());
        args.shift();
        if(prefix && cmd && message.guild){
            if(client.isOwner(message.author.id)){
                return cmd.run(client, message,args)
            }
            if(cmd.ownerOnly){
                if(client.isOwner(message.author.id)) {
                    Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white')

                    return cmd.run(client,message,args);
                }else{
                    Logger.warn(`${message.author.tag} ${Logger.setColor(`white`, `tried the ownerOnly command: ${cmd.name}`)} `, `COMMAND`)
                    return await message.channel.send(client.lang(message.guild.lang).error.ownerOnly);
                }
            }else if (cmd.guildOwnerOnly) {
                if(message.guild.isGuildOwner(message.author.id)){
                    Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white');
                    return cmd.run(client, message, args);
                }else{
                    Logger.warn(`${message.author.tag} ${Logger.setColor(`white`, `tried the guildOwnerOnly command: ${cmd.name}`)} `, `COMMAND`)
                    return await message.channel.send(client.lang(message.guild.lang).error.guildOwnerOnly)

                }
            }else{
                for(const commandPermissions of cmd.userPermissions){
                    if(!message.member.hasPermission(commandPermissions) && message.guild.ownerID !== message.author.id){
                        return message.channel.send(client.lang(message.guild.lang).error.userPermissions(commandPermissions))
                    }
                }
                for(const commandPermissions of cmd.clientPermissions){
                    if(!message.guild.me.hasPermission(commandPermissions)){
                        return message.channel.send(client.lang(message.guild.lang).error.clientPermissions(commandPermissions))
                    }
                }
                cmd.run(client, message,args);
                Logger.log(`${message.author.tag} execued the command: ${cmd.name} in ${message.guild.name}`, `COMMAND`, 'white');

            }
        }
    }
}