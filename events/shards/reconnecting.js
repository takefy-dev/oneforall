module.exports = {
            name: 'shardReconnecting',


    run: async (client, id) => {
        console.log(`Shard ${id} is reconnecting`)
        if(client.config.dev || client.config.botperso) return
        await client.shardWebhook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569862357002:868813759110590544> Shard \`#${id + 1}\` se reconnecte  \n▬▬▬▬▬▬▬▬  `)
    }
}

