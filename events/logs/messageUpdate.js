const Event = require('../../structures/Handler/Event');

module.exports = class messageUpdate extends Event {
    constructor() {
        super({
            name: 'messageUpdate',
        });
    }

    async run(client, oldMessage, newMessage) {
        if (!oldMessage.guild.me.hasPermission("VIEW_AUDIT_LOG")) return;
        if (!oldMessage.guild) return;
        if (!oldMessage.author) return;

        if (oldMessage.author.bot || newMessage.author.bot) return;
        if (!newMessage.guild) return;
        if(oldMessage.embeds.length < 1 && newMessage.embeds.length > 0) return;
        if(!oldMessage.guild.config) return
        const {logs} = client.lang(oldMessage.guild.lang);
        let {msgLog} = oldMessage.guild.logs;
        if (msgLog === "Non définie") return msgLog = null;
        const channel = oldMessage.guild.channels.cache.get(msgLog);
        if (channel) {
            const color = oldMessage.guild.color
            const link = `https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`
            const executor = oldMessage.member
            channel.send(logs.editionMsg(executor, oldMessage.content, newMessage.content, color, link))
        }
    }
}

