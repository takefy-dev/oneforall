const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setavatar',
            description: 'setavatar <link or image>',
            usage: 'setavatar <link or image>',
            category: 'botOwner',
            aliases: ['setphoto', 'setimage', 'seticon'],
            clientPermissions: ['EMBED_LINKS'],
            ownerOnly: true,
        });
    }

    async run(client, message, args) {
        if (!message.guild) return;
        if (message.attachments.size > 0) {
            message.attachments.forEach(attachment => {
                client.user.setAvatar(attachment.url)
                    .then(u => message.channel.send(`${message.author}, Vous avez changé la photo de profil de votre bot.`))
                    .catch(e => {
                        return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                    });
            });
        } else if (args.length) {
            let str_content = args.slice(0).join(" ")
            client.user.setAvatar(str_content)
                .then(u => message.channel.send(` ${message.author}, Vous avez changé la photo de profil de votre bot.`))
                .catch(e => {
                    return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                });
        } else {
            message.channel.send(`${message.author}, Vous avez fournie aucune valeur, veuillez mettre sois une image sois un lien`);
        }
    }
};

