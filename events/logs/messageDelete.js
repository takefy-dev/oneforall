module.exports =  {
    name: 'messageDelete',
    run: async (client, message) => {
        if (!message.author) return;
        if (message.author.bot) return;
        if (!message.guild) return;
        if (message.partial) await message.fetch();
        const guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const snipes  = guildData.snipes

        snipes.set(message.channel.id, {
            content: message.content,
            author: message.author,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
            date: new Date().toLocaleString('fr-FR', {dataStyle: 'full', timeStyle: 'short'})
        })
        const color = guildData.get('color')
        let msgLog = guildData.get('logs').message;
        if(msgLog === "Non définie") return msgLog = null
        let action = await message.guild.fetchAuditLogs({
                limit: 1,
                type: 'MESSAGE_DELETE',
            }),
            deletionLog = action.entries.first();
        const channel = message.guild.channels.cache.get(msgLog);
        const { logs } = guildData.lang
        if(!channel) return;
        if (!deletionLog) {
            //delete his msg
            channel.send({embeds : [logs.messageDelete(message.member, message.author,message.channel.id, color,message.content)]})

        }
        const {executor, target} = deletionLog;

        if (target.id === message.author.id) {
            // delete the message of
            const member = message.guild.members.cache.get(executor.id) || await message.guild.members.fetch(executor.id)
            channel.send({embeds : [logs.messageDelete(member, message.author,message.channel.id, color,message.content)]})

        } else {
            //delete his msg
            channel.send({embeds:  [logs.messageDelete(message.member, message.author,message.channel.id, color,message.content)]})
        }


    }


}






