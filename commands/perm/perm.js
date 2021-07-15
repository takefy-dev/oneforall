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
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;
        const guildPerm = guildData.get('perms');
        const {commands} = guildPerm;
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Perms commands`)
                .addField(`Perm1:`, commands.perm1.length < 1 ? lang.perm.noCommand : commands.perm1.map((name, i) => `${i + 1} - ${name}`).join(', '))
                .addField(`Perm2:`, commands.perm2.length < 1 ? lang.perm.noCommand : commands.perm2.map((name, i) => `${i + 1} - ${name}`).join(', '))
                .addField(`Perm3:`, commands.perm3.length < 1 ? lang.perm.noCommand : commands.perm3.map((name, i) => `${i + 1} - ${name}`).join(', '))
                .addField(`Perm4:`, commands.perm4.length < 1 ? lang.perm.noCommand : commands.perm4.map((name, i) => `${i + 1} - ${name}`).join(', '))
                .setColor(guildData.get('color'))
                .setTimestamp()
                .setFooter(client.user.username, message.author.displayAvatarURL({dynamic: true}))
            return await message.channel.send(embed)
        }
        if (permToPutCommand !== '1' && permToPutCommand !== '2' && permToPutCommand !== "3" && permToPutCommand !== '4' && permToPutCommand !== "everyone") return message.channel.send(lang.perm.permNotFound);
        if (!commandName) return message.channel.send(lang.perm.commandNotFound)
        if (!client.commands.has(commandName) && !client.aliases.has(commandName)) return message.channel.send(lang.perm.commandNotFound)
        const cmd = await client.commands.get(commandName.toLowerCase().normalize()) || await client.aliases.get(commandName.toLocaleLowerCase().normalize());
        commandName = cmd.name


        if (permToPutCommand === "everyone") {
            for (let i = 1; i <= 4; i++) {
                commands[`perm${i}`] = commands[`perm${i}`].filter(x => x !== commandName)
            }
        } else {
            const permCommand = commands[`perm${permToPutCommand}`];
            if (permCommand && !permCommand.includes(commandName)) {
                permCommand.push(commandName);
            }
            for (let i = 1; i <= 4; i++) {
                if (i !== parseInt(permToPutCommand)) {

                    commands[`perm${i}`] = commands[`perm${i}`].filter(x => x !== commandName)
                }
            }
            guildPerm.commands[`perm${permToPutCommand}`] = permCommand


        }
        guildData.set('perms', guildPerm).save().then(() => {
            message.channel.send(lang.perm.successCommand(commandName, permToPutCommand))
        })


    }
}