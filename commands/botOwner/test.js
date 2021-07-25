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


        const userBackup = client.managers.backupManager.getAndCreateIfNotExists(message.author.id)
        const backups = userBackup.get('backupEmbed');
        client.shard.broadcastEval(`this.managers.backupManager.getAndCreateIfNotExists(${message.author.id}).set('backupEmbed', ${JSON.stringify(backups)}).save()`).then((res) => {
            console.log(res)
        })

    }
}