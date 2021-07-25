const Event = require('../../structures/Handler/Event');
module.exports = class message extends Event {
    constructor() {
        super({
            name: 'message',
        });
    }

    async run(client, message) {
        if(!message.guild || message.member.permissions.has(8)) return;
        let guildData = client.managers.guildManager.getAndCreateIfNotExists(message.guild.id)
        const piconly = guildData.get('piconly');
        if(piconly.includes(message.channel.id) && message.attachments.size <= 0){
            return message.delete().catch(() => {})
        }

    }
}

