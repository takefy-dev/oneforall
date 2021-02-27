const { ShardingManager } = require('discord.js')
require('dotenv').config();
const Discord = require('discord.js')
const shards = new ShardingManager("./index.js", {
    token: process.env.TOKEN,
    totalShards: 2,   
    execArgv: ['--trace-warnings'],
	shardArgs: ['--ansi', '--color'],
});

shards.on('shardCreate', shard => {
    shard.on('ready', () => {
        // hook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:online2:464520569975603200> Shard \`#${shard.id + 1}\`  prêt \n▬▬▬▬▬▬▬▬`)

    })
    shard.on("disconnect", (event) => {
        console.warn("Shard " + shard.id + " disconnected. Dumping socket close event...");
        console.log(event);
    });

    shard.on("disconnect", (event) => {
        console.warn("Shard " + shard.id + " disconnected. Dumping socket close event...");
        // hook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:dnd2:464520569560498197> Shard \`#${shard.id + 1}\`  est déconnecté   \n▬▬▬▬▬▬▬▬ `)

        console.log(event);
    });
    shard.on("reconnecting", () => {
        console.warn("Shard " + shard.id + " is reconnecting...");
        // hook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:away2:464520569862357002> Shard \`#$shard.id + 1}\` se reconnecte  \n▬▬▬▬▬▬▬▬  `)

    });
    
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] Lancé shard #${shard.id}`);
    const hook = new Discord.WebhookClient('801060243785383936', 'foWpfz4X8OEwrZ4SQfOR1khPOH0YdF1AsHzjfIqFW_iRpTSqtPfDwFJYUOx91Y4xv5oq');
    // hook.send(`\`[${new Date().toString().split(" ", 5).join(" ")}]\` <:away2:464520569862357002> Shard \`#${shard.id + 1}\`  démarre`)
})

shards.spawn(shards.totalShards, 10000);
