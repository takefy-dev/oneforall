const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'perm',
            description: 'Manage perm on the serv | Gerer les perms sur le serveur',
            category: 'perm',
            usage: 'perm <numberOfPerm (1/2/3/4/everyone)> <commandName>',
            aliases: ['setperm'],
            userPermissions: ['ADMINISTRATOR'],
            guildOwnerOnly: true,
            cooldown: 4
        });
    }

    async run(client, message, args) {
        const permToPutCommand = args[0];
        let commandName = args[1];
        const lang = client.lang(message.guild.lang);
        if (!message.guild.permSetup) return message.channel.send(lang.perm.noSetup(message.guild.prefix))
        const {perm} = message.guild;
        const options = {
            perm1Command: [],
            perm2Command: [],
            perm3Command: [],
            perm4Command: [],
        }
        if (perm.size > 0) {
            for (const [commandName, perms] of perm) {
                if (perms === "perm1") {
                    options.perm1Command.push(commandName)
                } else if (perms === "perm2") {
                    options.perm2Command.push(commandName)

                } else if (perms === 'perm3') {
                    options.perm3Command.push(commandName)

                } else if (perms === 'perm4') {
                    options.perm4Command.push(commandName)
                }
            }
        }
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Perms commands`)
                .addField(`Perm1:`, options.perm1Command.length < 1 ? lang.perm.noCommand : options.perm1Command.map((name, i) => `${i + 1} - ${name}\n`))
                .addField(`Perm2:`, options.perm2Command.length < 1 ? lang.perm.noCommand : options.perm2Command.map((name, i) => `${i + 1} - ${name}\n`))
                .addField(`Perm3:`, options.perm3Command.length < 1 ? lang.perm.noCommand : options.perm3Command.map((name, i) => `${i + 1} - ${name}\n`))
                .addField(`Perm4:`, options.perm4Command.length < 1 ? lang.perm.noCommand : options.perm4Command.map((name, i) => `${i + 1} - ${name}\n`))
                .setColor(message.guild.color)
                .setTimestamp()
                .setFooter(client.user.username, message.author.displayAvatarURL({dynamic: true}))
            return await message.channel.send(embed)
        }
        if (permToPutCommand !== '1' && permToPutCommand !== '2' && permToPutCommand !== "3" && permToPutCommand !== '4' && permToPutCommand !== "everyone") return message.channel.send(lang.perm.permNotFound);
        if (!commandName) return message.channel.send(lang.perm.commandNotFound)
        if (!client.commands.has(commandName) && !client.aliases.has(commandName)) return message.channel.send(lang.perm.commandNotFound)
        const cmd = await client.commands.get(commandName.toLowerCase().normalize()) || await client.aliases.get(commandName.toLocaleLowerCase().normalize());
        commandName = cmd.name
        if (permToPutCommand === '1') {
            options.perm1Command.push(commandName)
            if (options.perm2Command.includes(commandName)) options.perm2Command = options.perm2Command.filter(x => x !== commandName)
            if (options.perm3Command.includes(commandName)) options.perm3Command = options.perm3Command.filter(x => x !== commandName)
            if (options.perm4Command.includes(commandName)) options.perm4Command = options.perm4Command.filter(x => x !== commandName)

        } else if (permToPutCommand === '2') {
            options.perm2Command.push(commandName)
            if (options.perm1Command.includes(commandName)) options.perm1Command = options.perm1Command.filter(x => x !== commandName)
            if (options.perm3Command.includes(commandName)) options.perm3Command = options.perm3Command.filter(x => x !== commandName)
            if (options.perm4Command.includes(commandName)) options.perm4Command = options.perm4Command.filter(x => x !== commandName)

        } else if (permToPutCommand === '3') {
            options.perm3Command.push(commandName)
            if (options.perm1Command.includes(commandName)) options.perm1Command = options.perm1Command.filter(x => x !== commandName)
            if (options.perm2Command.includes(commandName)) options.perm2Command = options.perm2Command.filter(x => x !== commandName)
            if (options.perm4Command.includes(commandName)) options.perm4Command = options.perm4Command.filter(x => x !== commandName)

        } else if (permToPutCommand === '4') {
            options.perm4Command.push(commandName)
            if (options.perm1Command.includes(commandName)) options.perm1Command = options.perm1Command.filter(x => x !== commandName)
            if (options.perm2Command.includes(commandName)) options.perm2Command = options.perm2Command.filter(x => x !== commandName)
            if (options.perm3Command.includes(commandName)) options.perm3Command = options.perm3Command.filter(x => x !== commandName)
        }else if(permToPutCommand === "everyone"){
            if (options.perm1Command.includes(commandName)) options.perm1Command = options.perm1Command.filter(x => x !== commandName)
            if (options.perm2Command.includes(commandName)) options.perm2Command = options.perm2Command.filter(x => x !== commandName)
            if (options.perm3Command.includes(commandName)) options.perm3Command = options.perm3Command.filter(x => x !== commandName)
            if (options.perm4Command.includes(commandName)) options.perm4Command = options.perm4Command.filter(x => x !== commandName)

        }
        await message.guild.updatePerms(false, options).then(() => {
            message.channel.send(lang.perm.successCommand(commandName, permToPutCommand))
        })


    }
}