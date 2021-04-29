const Event = require('../../structures/Handler/Event');

module.exports = class rateLimit extends Event {
    constructor() {
        super({
            name: 'rateLimit',
        });
    }

    async run(client, info) {
        // console.log(info)
        // console.log(`Rate limit hit ${info.timeDifference ? info.timeDifference : info.timeout ? info.timeout : 'Unknown timeout '}`)
        // console.log('Rate limit method' + info.method);
        // console.log('Rate limit path' + info.path);
        // console.log('Rate limit route' + info.route);


    }
};