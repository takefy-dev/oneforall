const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
let hexColorRegex = require('hex-color-regex');
module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'setcolor',
            description: 'Change all embeds color of the bot in your server | Changer la couleur des embeds dans votre serveur',
            usage: 'setcolor <HTML COLOR>',
            category: 'moderation',
            clientPermissions: ['SEND_MESSAGES'],
            guildOwnerOnly: true,
            cooldown: 5

        });
    }

    async run(client, message, args) {

        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id);
        const lang = guildData.lang;


        const color = args[0];
        let checkColor = hexColorCheck(color);

        if (!color) return message.channel.send(lang.setcolor.noColor)
        if (color) {
            if (checkColor) {
                try {
                    message.guild.updateColor = color;
                    message.channel.send(lang.setcolor.success(color));
                    const exampleEmbed = new Discord.MessageEmbed()
                        .setColor(`${color}`)
                        .setDescription(lang.setcolor.successDescription)
                        .setTitle(lang.setcolor.titleDescription)
                    message.channel.send(exampleEmbed);

                    guildData.set('color', color).save()
                } catch (err) {
                    console.log(err);
                    message.channel.send(lang.setcolor.errorSql(color))
                }

            } else {
                message.channel.send(lang.setcolor.errorNoArgs)
            }
        }


    }
};


function hexColorCheck(a) {
    let check = hexColorRegex().test(a);
    let checkVerify = false;
    if (check === true) {
        checkVerify = true;
    }
    return checkVerify;
}
