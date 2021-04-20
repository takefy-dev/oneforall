const Event = require('../structures/Event');
const { Logger } = require('advanced-command-handler')
const Coins = require('../structures/Coins')


module.exports = class Ready extends Event{
    constructor() {
        super({
            name: 'ready',
        });
    }
    async run(client){
        Logger.info(`${client.user.tag} logged in`, `CLIENT LOGIN`);

        const CoinsGame = new Coins(client).init()

    }
}