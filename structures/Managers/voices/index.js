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
                const guildData = this.OneForAll.managers.guildManager.getAndCreateIfNotExists(key.split('-')[0])
                let {
                    xpPerSVoc,
                    enable,
                    allowChannels, forbidChannels, multiplerChannels
                } = guildData.get('xp')
                if (!enable) break
                const boost = multiplerChannels ? multiplerChannels.find(boost => boost.channel === value.values.voice.channelId
                ) : undefined
                if (!allowChannels.includes('all') && !allowChannels.includes(value.values.voice.channelId
                ) || forbidChannels.includes(value.values.voice.channelId
                )) break

                if (typeof xpPerSVoc === 'string') xpPerSVoc = this.OneForAll.functions.getRandomInt(parseInt(xpPerSVoc.split('-')[0]), parseInt(xpPerSVoc.split('-')[1]))
                let xpGain = xpPerSVoc
                if (boost)
                    xpGain += boost.boost
                const hasLeveledUp = await this.OneForAll.levels.appendXp(value.values.user.id, value.values.guild.id, xpGain)
                if (!hasLeveledUp) break
                const {roleLevel, lvlMessage, cumulRoles, maxRoleLvl} = guildData.get('level')
                const channel = value.values.guild.channels.cache.get(lvlMessage.channel);
                if (!channel && channel.deleted) return
                const userLevel = await this.OneForAll.levels.fetch(value.values.user.id, value.values.guild.id, true);
                const finalMessage = lvlMessage.message.replace(/{memberMention}/g, value.values.toString()).replace(/{memberLevel}/g, userLevel.level).replace(/{memberXp}/g, userLevel.xp).replace(/{memberLbPosition}/g, userLevel.position).replace(/{memberTag}/g, value.values.user.tag || value.values.user.username)
                channel.send(finalMessage)
                if (!roleLevel.length) break
                const roleToAdd = []
                roleLevel.filter(roleLvl => roleLvl.level <= userLevel.level).forEach(role => roleToAdd.push(role.role))
                if (!roleToAdd.length) break
                await value.values.roles.add(roleToAdd, `Lvl up ${userLevel.level}`)
                if (!cumulRoles) {
                    const toRemove = []
                    roleLevel.filter(roleLvl => roleLvl.role !== maxRoleLvl.role).forEach(role => {
                        toRemove.push(role.role)
                    })
                    await value.values.roles.remove(toRemove, `Cumul roles off`)
                }
            }
        }, ms)
    }

    async load() {
        this.OneForAll.guilds.cache.filter(g => this.OneForAll.managers.guildManager.getAndCreateIfNotExists(g.id).get('coinsSettings').enable || this.OneForAll.managers.guildManager.getAndCreateIfNotExists(g.id).get('xp').enable).forEach(g => {
            g.channels.cache.filter(channel => channel.type === "GUILD_VOICE" && channel.members.size > 0).map(channel => channel.members).forEach(members => members.forEach(member => {
                if (!member.user.bot)
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