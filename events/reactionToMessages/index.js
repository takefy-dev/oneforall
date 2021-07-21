const Event = require('../../structures/Handler/Event');
const {Collection} = require("discord.js");
const messages = new Collection()
let now = new Date()

module.exports = class Ready extends Event {
    constructor() {
        super({
            name: 'message',
        });
    }

    async run(client, message) {
        if(!message.guild) return
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const reactionToMessages = guildData.get('reactionsToMessages');
        if (!reactionToMessages.length || message.author.bot) return;
        const emojiToReact = reactionToMessages.find(reactionMessage => reactionMessage.channel === message.channel.id);
        if (!emojiToReact) return;
        if (messages.size > 10) return setTimeout(() => {
            messages.clear()
        }, 1000 * 20)
        if (new Date(message.createdTimestamp) - now <= 2000)
            messages.set(message.id, message.author.id);
        now = new Date()
        for (const emoji of emojiToReact.reactions) {
            await message.react(emoji)
        }

    }
}