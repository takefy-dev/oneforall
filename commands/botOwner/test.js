const Command = require('../../structures/Handler/Command');
const {Logger} = require('advanced-command-handler')
const Discord = require('discord.js')
const emojiEnable = {
    true: "<:778348494712340561:781153837850820619>",
    false: "<:778348495157329930:781189773645578311>"
}
const NumberFromEmoji = require('../../utils/emojiToNumber')

module.exports = class Test extends Command {
    constructor() {
        super({
            name: 'test',
            description: 'test',
            category: 'test',

        });
    }

    async run(client, message, args) {

        const t = client.functions.dateToEpoch(new Date())

        const msg = await message.channel.send(`<t:${t}:R>`)
        console.log(msg)

    }
}