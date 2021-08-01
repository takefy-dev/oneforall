module.exports = {

    name: 'shardResume',


    run: async (client, id, event) => {
        console.log(`Shard ${id} is resumed ${event}`)
        if (client.config.dev || client.config.botperso) return
        await client.shardWebhook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569975603200:868814251186348042> Shard \`#${id + 1}\`  prêt \n▬▬▬▬▬▬▬▬`)
    }
}

