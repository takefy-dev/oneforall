const {Logger} = require("advanced-command-handler");
const cron = require('node-cron')
// TODO : FIX BOOST
module.exports = class coins {
    constructor(client) {

        this.client = client

    }

    async loadVoice() {
        let status = "default"
        let loadedVoice = 0;
        const channels = await this.client.channels.cache.filter(channel => channel.guild.config.coinsOn && channel.type === 'voice' && channel.members.filter(m => !m.user.bot).size > 0)
        for await (const [, channel] of channels) {
            for (const [, member] of channel.members) {
                if (member.voice.mute || member.voice.deaf) {
                    status = "mute";
                } else if (member.voice.streaming || member.voice.selfVideo) {
                    status = "stream"
                }

                if (channel.guild.coinsFarmer.has(member.id)) return;
                channel.guild.coinsFarmer.set(member.id, {
                    status,
                    boost: channel.guild.boost[status]
                })
                console.log(channel.guild.coinsFarmer)

                loadedVoice++
            }
        }


        Logger.log(`${loadedVoice}`, `Loaded voice`, 'white');
    }

    async farmCoins() {
        // * * * * *
        cron.schedule('* * * * *', async () => {
            let count = 0
            const guildWithFarmers = this.client.guilds.cache.filter(guild => guild.config && guild.config.coinsOn && guild.coinsFarmer.size > 0);
            for await(const [, guild] of guildWithFarmers) {
                for await (const [id, status] of guild.coinsFarmer) {
                    const member = guild.members.cache.get(id);
                    let memberCoins = member.coins;
                    if (memberCoins === null) memberCoins = 0;
                    memberCoins += status.boost;
                    member.updateCoins = memberCoins;
                    // console.log(status, memberCoins)
                    count += memberCoins;
                }
            }
            Logger.log(`${count}`, 'ADDED COINS')
        })


    }

    async init() {
        await this.loadVoice();
        await this.farmCoins()
    }
}