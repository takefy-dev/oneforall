const { Structures } = require('discord.js')
const { Logger } = require('advanced-command-handler');
const StateManager = require('../../utils/StateManager');
Structures.extend('Guild', (Guild) =>{
    class CustomGuild extends Guild {
         constructor (client, data){
            super(client, data);
            this.guildConfigs = null;
            this.antiraidConfigs = null;
            this.reactroles = null;
            this.counters = null;
            this.coinShop = null;
            this.guildId = data.id;
            this.lang = null;
            this.color = null;
            Logger.info(`Fetching guild configs`, `Fetching all guilds`)
             this.fetchGuildConfigs();
            Logger.info(`all guilds`, 'Finish fetching')
             Logger.log(`Fetching antiraid configs`, `Fetching all guilds`, 'orange')
             this.fetchAntiraidConfigs()
             Logger.log(`all guilds`, 'Finish fetching', 'orange')
             Logger.log(`Fetching reactroles`, `Fetching all guilds`, 'brown')
             this.fetchReactRoles()
             Logger.log(`all guilds`, 'Finish fetching', 'brown')
         }

        get guildConfig() {
            return this.guildConfigs
        }

        get antiraidConfig () {
             return this.antiraidConfigs;
        }

        get coins () {
             return {
                 enable : this.guildConfigs.coinsOn,
                 streamBoost : this.guildConfigs.streamBoost,
                 muteDiviseur : this.guildConfigs.muteDiviseur,
                 logs : this.guildConfigs.coinsLogs,
             }
        }

        get counter () {
             if(!this.guildConfigs) return;
            const memberCount = JSON.parse(this.guildConfigs.memberCount)
            const  voiceCount= JSON.parse(this.guildConfigs.voiceCount)
           const onlineCount = JSON.parse(this.guildConfigs.onlineCount)
           const offlineCount = JSON.parse(this.guildConfigs.offlineCount)
           const botCount = JSON.parse(this.guildConfigs.botCount)
           const channelCount = JSON.parse(this.guildConfigs.channelCount)
           const roleCount = JSON.parse(this.guildConfig.roleCount)
           const boosterCount = JSON.parse(this.guildConfigs.boosterCount)
        // }
             const counter = [
                 {id: memberCount.id, name: memberCount.name, type: 'member'},
                 {id: voiceCount.id, name: voiceCount.name, type: 'voice'},
                 {id: onlineCount.id, name: onlineCount.name, type: 'online'},
                 {id: offlineCount.id, name: offlineCount.name, type: 'offline'},
                 {id: botCount.id, name: botCount.name, type: 'bot'},
                 {id: channelCount.id, name: channelCount.name, type: 'channel'},
                 {id: roleCount.id, name: roleCount.name, type: 'role'},
                 {id: boosterCount.id, name: boosterCount.name, type: 'booster'},

             ]
            this.counters = counter;
            return counter;


        }
        async editCounter(type, counterEdited){
             const counterInDb = {
                 "member": 'memberCount',
                 "voice": "voiceCount",
                 "online": "onlineCount",
                 "offline": "offlineCount",
                 "bot": "botCount",
                 "channel": "channelCount",
                 "role": "roleCount",
                 "booster": "boosterCount"
             }
            const toEdited = this.counter.filter(info => info.type === type);
            const key = this.counter.getKey(toEdited);
            await StateManager.connection.query(`UPDATE guildConfig SET counterInDb[type] = ? `, [JSON.stringify(toEdited)]).then(() =>{
                this.counters[key] = counterEdited;
            });
            return this.counter;
        }

        get logs () {
             return {
                 modLog : this.guildConfigs.modLog,
                 antiraidLog : this.guildConfigs.antiraidLog,
                 msgLog: this.guildConfigs.msgLog,
                 voiceLog: this.guildConfigs.voiceLog
             }
        }

        get warnConfig () {
             return {
                 ban : this.guildConfigs.warnBan,
                 kick : this.guildConfigs.warnKick,
                 warnMute: this.guildConfigs.warnMute
             }
        }

        get inviteConfig () {
             return {
                 message : this.guildConfigs.inviteMessage,
                 enable : this.guildConfigs.inviteOn,
                 channel : this.guildConfigs.inviteChannel
             }
        }

        get owners () {
            return this.guildConfigs.owner.toString().split(',')
        }

        get whitelist () {
             return this.guildConfigs.whitelisted.toString().split(',')
        }

        get reactoles () {
             return {
                messageId: this.reactroles.msgId,
                 emojiRole : JSON.parse(this.reactroles.emojiRole)
             }
        }

        get shop () {
             return this.coinShop;
        }

        fetchGuildConfigs() {

            Logger.info(`${this.guildId}`, 'Fetching')

            StateManager.connection.query(`SELECT * FROM guildConfig WHERE guildId = '${this.guildId}'`).then((res) =>{
                if(res[0][0] === undefined) return undefined;
                delete res[0][0].guildId;
                this.guildConfigs = res[0][0];
                this.lang = res[0][0].lang;
                this.color = res[0][0].embedColors;
            })
        }

        async fetchReactRoles () {
            Logger.info(`${this.guildId}`, 'Fetching ')
             await StateManager.connection.query(`SELECT * FROM reactrole WHERE guildId = '${this.guildId}'`).then((res) =>{
                 if(res[0][0] === undefined) return undefined;
                 delete res[0][0].guildId
                    this.reactroles = res[0][0]
             })
        }


        async fetchAntiraidConfigs() {

            Logger.info(`${this.guildId}`, 'Fetching')
            let config = {enable: null, sanction: null, bypass: null};
            await StateManager.connection.query(`SELECT * FROM antiraid WHERE guildId = '${this.guildId}'`).then((res) =>{
                if(res[0][0] === undefined) return undefined;
                delete res[0][0].guildId

                config.enable = res[0][0];
            })
            await StateManager.connection.query(`SELECT * FROM antiraidConfig WHERE guildId = '${this.guildId}'`).then((res) =>{
                if(res[0][0] === undefined) return undefined;
                delete res[0][0].guildId
                config.sanction = res[0][0];
            })
            await StateManager.connection.query(`SELECT * FROM antiraidWlBp WHERE guildId = '${this.guildId}'`).then((res) =>{
                if(res[0][0] === undefined) return undefined;
                delete res[0][0].guildId
                config.bypass = res[0][0];
            })


            this.antiraidConfigs = config;
        }

        async fetchCoinsShop () {
            Logger.info(`${this.guildId}`, 'Fetching')
            await StateManager.connection.query(`SELECT * FROM coinShop WHERE guildId = '${this.guildId}'`).then((res) =>{
                if(res[0][0] === undefined) return undefined;
                delete res[0][0].guildId
                this.coinShop = JSON.parse(res[0][0]);

            })
        }

    }
    return CustomGuild;

})
