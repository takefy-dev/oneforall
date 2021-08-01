module.exports = {

    name: 'get-status',

    run: async (websocket, client, cb) => {
        console.log("getting status in bot")
        const upTime = client.uptime
        const apiLatency = Math.round(client.ws.ping)
        const guilds = []
        client.guilds.cache.forEach(g => guilds.push(g.id))

        const unavailableGuilds = client.unavailableGuilds;
        cb(upTime, apiLatency, parseInt(client.shard.ids.toString()) + 1, guilds, unavailableGuilds, client.commands);
    }
}
