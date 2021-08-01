
// let all = new Map();
module.exports = {
    name: 'shardReady',
    run: async (client, id, unavailableGuilds) => {
        console.log(`Shard ${id} is ready with ${unavailableGuilds}`)
        if(client.config.dev || client.config.botperso) return;
        await client.shardWebhook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569975603200:868814251186348042> Shard \`#${id + 1}\`  prêt \n▬▬▬▬▬▬▬▬`)
    }
}

