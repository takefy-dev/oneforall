const {Logger} = require("advanced-command-handler");

// TODO : FIX BOOST
module.exports = class coins {
    constructor(client) {

        this.client = client

    }

    async loadVoice(){
        let status = "default"
        let loadedVoice = 0;
        this.client.channels.cache.filter(channel => channel.guild.config.coinsOn && channel.type === 'voice' && channel.members.filter(m => !m.bot).size > 0).forEach(channel => {

            for (const [, member] of channel.members){
                if(member.voice.mute || member.voice.deaf){
                    status = "mute";
                }else if(member.voice.streaming || member.voice.selfVideo){
                    status = "stream"
                }

                if(channel.guild.coinsFarmer.has(member.id)) return;

                channel.guild.coinsFarmer.set(member.id, {
                    status,
                    boost : channel.guild.boost[status]
                })
                loadedVoice++
            }
        })
        Logger.log(`${loadedVoice}`, `Loaded voice`, 'white');
    }
    async farmCoins(ms){
        setInterval(async () => {
            const guildWithFarmers = this.client.guilds.cache.filter(guild => guild.config && guild.config.coinsOn && guild.coinsFarmer.size > 0);
            for await(const [, guild] of guildWithFarmers){
                for await (const [id, status] of guild.coinsFarmer){
                    const member =guild.members.cache.get(id);
                    let memberCoins = member.coins;
                    if(memberCoins === null) return;
                    memberCoins+=status.boost;
                    member.updateCoins = memberCoins;
                }
            }
        }, ms)
    }

    async init(){
        await this.loadVoice();
        await this.farmCoins(60000)
    }
}