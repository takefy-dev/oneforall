

const Event = require('../../structures/Handler/Event');

module.exports = class messageDelete extends Event {
    constructor() {
        super({
            name: 'messageDelete',
        });
    }

    async run(client, message) {
        if (!message.author) return;
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.guild.config) return;
        if (message.partial) await message.fetch();
        const { snipes } = message.guild;

        snipes.set(message.channel.id, {
            content: message.content,
            author: message.author,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
            date: new Date().toLocaleString('fr-FR', {dataStyle: 'full', timeStyle: 'short'})
        })
        const color = message.guild.color
        let {msgLog } = message.guild.logs;
        if(msgLog === "Non définie") return msgLog = null
        let action = await message.guild.fetchAuditLogs({
                limit: 1,
                type: 'MESSAGE_DELETE',
            }),
            deletionLog = action.entries.first();
        const channel = message.guild.channels.cache.get(msgLog);
        const { logs } = client.lang(message.guild.lang)
        if(!channel) return;
        if (!deletionLog) {
            //delete his msg
            channel.send(logs.messageDelete(message.member, message.author,message.channel.id, color,message.content))

        }
        const {executor, target} = deletionLog;

        if (target.id === message.author.id) {
            // delete the message of
            const member = message.guild.members.cache.get(executor.id) || await message.guild.members.fetch(executor.id)
            channel.send(logs.messageDelete(member, message.author,message.channel.id, color,message.content))

        } else {
            //delete his msg
            channel.send(logs.messageDelete(message.member, message.author,message.channel.id, color,message.content))
        }


    }


}






