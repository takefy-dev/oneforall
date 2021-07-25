
const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setactivity',
            description: 'defininr activite',
            usage: 'setactivity',
            category: 'botOwner',
            ownerOnly: true,
            clientPermissions: ['EMBED_LINKS'],
            cooldown: 10
        });
    }

    async run(client, message, args) {


        const activityName = args.join(" ");
        if (args[0] === "streaming") {
            client.user.setPresence({
                activity: {
                    name: activityName.replace("streaming", " "),
                    type: 'STREAMING',
                    url: "https://www.twitch.tv/discord"
                }
            })
                .then(p => message.channel.send(`${message.author}, Vous avez définis le statut de votre bot en \`${activityName.replace("streaming", " ")}\`.`))
                .catch(e => {
                    return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                });


        } else if (args[0] === "playing") {
            client.user.setPresence({activity: {name: activityName.replace("playing", " "), type: 'PLAYING'}})
                .then(p => message.channel.send(`${message.author}, Vous avez définis le statut de votre bot en \`${activityName.replace("playing", " ")}\`.`))
                .catch(e => {
                    return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                });
        } else if (args[0] === "watching") {
            client.user.setPresence({activity: {name: activityName.replace("watching", " "), type: 'WATCHING'}})
                .then(p => message.channel.send(`${message.author}, Vous avez définis le statut de votre bot en \`${activityName.replace("watching", " ")}\`.`))
                .catch(e => {
                    return message.channel.send(`${message.author}, Une erreur a été rencontré. \n **Plus d'informations:** \`🔻\` \`\`\`${e}\`\`\``);
                });
        } else if (!args[0]) {
            message.channel.send(`${message.author}, Vous avez fournie aucune valeur pour l'activité`);

        } else if (args[0] && !args[1]) {
            message.channel.send(`${message.author}, Vous avez fournie aucune valeur pour le nom de l'activié`);

        }

    }
};

