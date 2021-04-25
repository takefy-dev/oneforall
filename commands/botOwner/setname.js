

const Command = require('../../structures/Handler/Command');
const { Logger } = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'setname',
            description: 'definir le nom du bot',
            usage: '!setname dd',
            category: 'botOwner',
            aliases: ['setname', 'setprenom', 'setnom'],
            clientPermissions: ['EMBED_LINKS'],
            ownerOnly: true,
            cooldown: 20
        });
    }
    async run(client, message,args) {


        const color = message.guild.color

        if (args.length) {
            let str_content = args.join(" ")
            client.user.setUsername(str_content)
                .then(u => message.channel.send(`${message.author}, Vous avez changé le pseudonyme de votre bot.`))
                .catch(e => {
                    return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                });
        } else {
            message.channel.send(` ${message.author}, Vous avez fournie aucune valeur, veuillez mettre comment vous souhaitez nommé votre bot`);
        }
    }
};
