const {Logger} = require("advanced-command-handler");
module.exports = class coins {
    constructor(client) {

        this.client = client

    }

    async loadVoice(){
        let status = "default"
        let loadedVoice = 0;
        this.client.channels.cache.filter(channel => channel.type === 'voice' && channel.members.filter(m => !m.bot).size > 0).forEach(channel => {

            for (const [, member] of channel.members){
                if(member.voice.mute === true && member.voice.deaf === false){
                    status = "mute";
                }
                else if(member.voice.streaming === true){
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
            const guildWithFarmers = this.client.guilds.cache.filter(guild => guild.coinsFarmer.size > 0);
            for await(const [, guild] of guildWithFarmers){
                for await (const [id, status] of guild.coinsFarmer){
                    const member =guild.members.cache.get(id);
                    let memberCoins = member.coins;
                    memberCoins+=status.boost;
                    member.updateCoins = memberCoins;
                    console.log(memberCoins)
                }
            }
        }, ms)
    }

    async init(){
        await this.loadVoice();
        await this.farmCoins(1000)
    }
}