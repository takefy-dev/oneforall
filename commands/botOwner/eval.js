
module.exports = {
    name: 'eval',
    description: 'eval',
    category: 'botOwner',
    tags: ['ownerOnly', "guildOnly"],
    aliases: ['console'],
    ownerOnly: true,
    cooldown: 10,


    run: async (client, message, args) => {


        const content = message.content.split(" ").slice(1).join(" ");
        const result = new Promise((resolve) => resolve(eval(content)));

        return result.then((output) => {
            if (typeof output !== "string") {
                output = require("util").inspect(output, {
                    depth: 0
                });
            }
            if (output.includes(client.token)) {
                output = output.replace(client.token, "T0K3N");
            }
            message.channel.send(output, {
                code: "js"
            });
        }).catch((err) => {
            err = err.toString();
            if (err.includes(client.token)) {
                err = err.replace(client.token, "T0K3N");
            }
            message.channel.send(err, {
                code: "js"
            });
        });
    }
}


