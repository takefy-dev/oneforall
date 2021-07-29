const {Collection} = require('discord.js');

class Voice extends Collection {

    constructor(OneForAll) {
        super();
        this.OneForAll = OneForAll;
    }

    addVoice(key, values = {}) {
        this.set(key, new VoiceManager(this, values));
        return this.get(key);
    }

    autoReloadVoice(ms) {
        setInterval(async () => {
            let earnCoins = 0
            for await (const [key, value] of this) {
                if (!value.values.guild || !value.values.guild.available) break;
                const voiceState = value.values.voice;
                const {
                    streamBoost,
                    muteDiviseur,
                    enable
                } = this.OneForAll.managers.guildManager.getAndCreateIfNotExists(key.split('-')[0]).get('coinsSettings')
                if (!enable) break

                earnCoins = Math.random() * (0.45 - 0.65) + 0.65;

                earnCoins += voiceState.selfMute || voiceState.selfDeaf ? muteDiviseur : (voiceState.streaming || voiceState.selfVideo ? streamBoost : 0.0);

                this.OneForAll.managers.userManager.getAndCreateIfNotExists(key, {
                    guildId: value.values.guild.id,
                    userId: value.values.user.id
                }).addCoins(earnCoins).save();


            }
            console.log(`Successfully add coins ${earnCoins} to ${this.size} Members.`);
        }, ms)
    }

    autoReloadVoicesXp(ms) {
        setInterval(async () => {
            for await (const [key, value] of this) {
                if (!value.values.guild || !value.values.guild.available) break;
                let {
                    xpPerSVoc,
                    enable,
                    allowChannels, forbidChannels, multiplerChannels
                } = this.OneForAll.managers.guildManager.getAndCreateIfNotExists(key.split('-')[0]).get('xp')
                if (!enable) break
                const boost = multiplerChannels.find(boost => boost.channel === value.values.voice.channelID)
                if(!allowChannels.includes('all') && !allowChannels.includes( value.values.voice.channelID) || forbidChannels.includes( value.values.voice.channelID)) break

                if (typeof xpPerSVoc === 'string') xpPerSVoc = this.OneForAll.functions.getRandomInt(parseInt(xpPerSVoc.split('-')[0]), parseInt(xpPerSVoc.split('-')[1]))
                let xpGain = xpPerSVoc
                if(boost)
                    xpGain += boost.boost
                await this.OneForAll.levels.appendXp(value.values.user.id, value.values.guild.id, xpGain)

            }
        }, ms)
    }

    async load() {
        this.OneForAll.guilds.cache.filter(g => this.OneForAll.managers.guildManager.getAndCreateIfNotExists(g.id).get('coinsSettings').enable || this.OneForAll.managers.guildManager.getAndCreateIfNotExists(g.id).get('xp').enable).forEach(g => {
            g.channels.cache.filter(channel => channel.type === "voice" && channel.members.size > 0).map(channel => channel.members).forEach(members => members.forEach(member => {
                this.addVoice(`${g.id}-${member.id}`, member);
            }))
        })
        console.log(`Successfully loaded ${this.size} Voice.`)
        this.autoReloadVoice(1000 * 60);
        this.autoReloadVoicesXp(1000)
    }

    getVoice(key) {
        return this.get(key);
    }
}

class VoiceManager {

    constructor(Voice, values = {}) {
        this.values = values;
    }
}

exports.Voice = Voice;