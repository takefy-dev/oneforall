const Cluster = require("discord-hybrid-sharding");
require('dotenv').config();
const { token, topGgToken } = require('./config.js')
const manager = new Cluster.Manager(`${__dirname}/index.js`,{
    totalShards: 2 ,
    totalClusters: 'auto',
    mode: "process",
    execArgv: ['--trace-warnings'],
    shardArgs: ['--ansi', '--color'],
    token
})
manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id}`));
manager.spawn(undefined, undefined, -1)


