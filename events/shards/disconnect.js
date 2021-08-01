module.exports = {
    name: 'shardDisconnect',
    run: async (client, event, id) => {
        console.log(`Shard ${id} is disconnect with ${event}`)
        await client.shardWebhook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:464520569560498197:868814521949650984> Shard \`#${id + 1}\`  est déconnecté   \n▬▬▬▬▬▬▬▬ `)
    }
}

