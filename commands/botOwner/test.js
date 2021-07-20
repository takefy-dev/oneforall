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

        const msg = await message.channel.send({
            "content": 'f',
            "embed":
                {
                    "title": "What's this?",
                    "description": "Discohook is a free tool that sends messages with embeds to your Discord server. To do that it uses [webhooks](https://support.discord.com/hc/en-us/articles/228383668), a Discord feature that lets any application send messages to a channel.\n\nTo send messages, you need a webhook URL, you can get one via the \"Integrations\" tab in your server's settings.\n\nNote that Discohook cannot respond to user interactions, it only sends messages when you tell it to. As such creating an automatic feed or custom commands is not possible with Discohook.",
                    "color": 5814783
                }

        })

    }
}