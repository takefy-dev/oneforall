const getServer = async(guildID, client) => {
    const req = await client.shard.broadcastEval(`this.guilds.cache.get("${guildID}")`);

    // return Guild or null if not found
    return req.find(res => !!res) || null;
}

module.exports = getServer;