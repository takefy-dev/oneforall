module.exports = {

    name: 'reboot',
    description: 'reboot bot',
    category: 'botOwner',
    ownerOnly: true,
    aliases: ['rb'],
    cooldown: 20,
    run: async (client, message, args) => {
        if (client.botperso) {
            const loadBot = require('../../../Discord/loadBot')
            loadBot(client.buyer, client)
        } else {

            process.exit()
        }
        await message.channel.send(`Je suis en train de redémarrer !`)
    }
}

