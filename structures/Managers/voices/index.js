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
                    muteDiviseur
                } = this.OneForAll.managers.guildManager.getAndCreateIfNotExists(key.split('-')[0]).get('coinsSettings')
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

    async load() {
        this.OneForAll.guilds.cache.filter(g => this.OneForAll.managers.guildManager.getAndCreateIfNotExists(g.id).get('coinsSettings').enable).forEach(g => {
            g.channels.cache.filter(channel => channel.type === "voice" && channel.members.size > 0).map(channel => channel.members).forEach(members => members.forEach(member => {
                this.addVoice(`${g.id}-${member.id}`, member);
            }))
        })
        console.log(`Successfully loaded ${this.size} Voice.`)
        this.autoReloadVoice(1000*60);
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