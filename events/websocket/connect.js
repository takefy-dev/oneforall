
// let all = new Map();
const Event = require('../../structures/Handler/Event');
module.exports = class connect extends Event {
    constructor() {
        super({
            name: 'connect',
        });
    }

    async run(websocket) {
        console.log(`Logged in as ${websocket.id}`)
    }
}
