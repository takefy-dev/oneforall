const {Structures} = require('discord.js')
const {Logger} = require('advanced-command-handler');
const StateManager = require('../../utils/StateManager');
const {Collection} = require("discord.js");
Structures.extend('Guild', (Guild) => {
    class CustomGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.guildID = data.id;
            this.prefix = '!';
            this.config = null;
            this.created = false;
            this.owners = [''];
            this.whitelisted = [''];
            this.color = "#36393F";
            this.antiraid = null;
            this.cachedInv = new Collection()
            this.fetchConfig()
            this.fetchAntiraid()

        }


        async topInvite(){
            if(!this.config.inviteOn) return false;
            let lb;
            await this.client.database.models.invite.findAll({
                attributes : ['userId', 'count'],
                where:{
                    guildId: this.guildID
                }
            }).then(res => {
                const data = []
                res.forEach(invite => {
                    const { dataValues } = invite;
                    data.push(dataValues)
                })
                lb = data.sort((a,b) => b.count.join - a.count.join).slice(0, 10)

            })
            return lb;
        }

        async clearInvite(){
            await this.client.database.models.invite.update({
                count: {join: 0, leave: 0, fake: 0, bonus: 0},
            }, {
                where: {
                    guildId: this.guildID,
                }
            })
        }

        get warns(){
            return {
                ban : this.config.warnBan,
                kick : this.config.warnKick,
                mute : this.config.warnMute
            }
        }

        async allWarns(){
            const guildWarns = []
            await this.client.database.models.warn.findAll({where: {guildId: this.guildID}}).then(allWarns => {
                   allWarns.forEach(warn => {
                       if(!warn) return;
                       const { dataValues } = warn;
                       delete dataValues.id;
                       delete dataValues.guildId;
                       guildWarns.push(dataValues)
                   })
            })
            if(guildWarns.length < 1) return undefined;
            return guildWarns
        }

        get logs() {
            return {
                msgLog: this.config.msgLog,
                modLog: this.config.modLog,
                antiraidLog: this.config.antiraidLog,
                voiceLog: this.config.voiceLog
            }
        }

        get setup() {
            return this.config.setup;
        }

        async updateInviteConfig(channel, message, enable) {
            await this.client.database.models.guildConfig.update({
                inviteMessage: message,
                inviteChannel: channel,
                inviteOn: enable
            }, {
                where: {guildId: this.guildID}
            })
        }


        async updateLogs(modLog, msgLog, voiceLog, antiraidLog) {
            await this.client.database.models.guildConfig.update({
                modLog,
                msgLog,
                voiceLog,
                antiraidLog
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                this.config.modLog = modLog;
                this.config.msgLog = msgLog;
                this.config.voiceLog = voiceLog;
                this.config.antiraidLog = antiraidLog;
                return {
                    msgLog: this.config.msgLog,
                    modLog: this.config.modLog,
                    antiraidLog: this.config.antiraidLog,
                    voiceLog: this.config.voiceLog
                }
            }).catch(err => {
                console.log(err);
                return false;

            })
        }

        set updateColor(color) {
            this.client.database.models.guildConfig.update({
                embedColors: color
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then(() => {
                this.color = color;
            })
        }

        set updateLang(lang) {
            this.client.database.models.guildConfig.update({
                lang
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then(() => {
                this.lang = lang;
            })
        }

        async updateWarn(warBan, warnKick, warnMute) {
            const isUpdated =await this.client.database.models.guildConfig.update({
                warBan,
                warnKick,
                warnMute
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then(res => {
                this.config.warnBan = warBan;
                this.config.warnKick = warnKick;
                this.config.warnMute = warnMute;

            })
        }

        set updatePrefix(prefix) {
            this.client.database.models.guildConfig.update({
                prefix
            }, {
                where: {
                    guildId: this.guildID
                }
            }).then(() => {
                this.prefix = prefix;
            })
        }


        set updateOwner(newOwners) {
            this.client.database.models.guildConfig.update(
                {
                    owner: newOwners.toString(),

                },
                {
                    where: {
                        guildID: this.guildID
                    }
                }
            ).then(() => {
                this.owners = newOwners;
            }).catch(err => console.log(err))
        }


        set updateWhitelist(newWhitelist) {
            this.client.database.models.guildConfig.update(
                {
                    whitelisted: newWhitelist.toString(),

                },
                {
                    where: {
                        guildID: this.guildID
                    }
                }
            ).then(() => {
                this.whitelisted = newWhitelist;
            }).catch(err => console.log(err))
        }

        async updateSetup(muteRoleId, memberRole) {
            const isUpdated = await this.client.database.models.guildConfig.update({
                memberRole,
                muteRoleId,
                setup: true
            }, {where: {guildId: this.guildID}})
            return isUpdated.includes(1);
        }

        async fetchConfig() {
            await this.client.database.models.guildConfig.findOrCreate({
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                if (res[0]._options.isNewRecord) {
                    Logger.log(`GUILD : ${this.guildID}`, `Guild created`, 'red')

                } else {
                    Logger.log(`GUILD : ${this.guildID}`, `Fetched`, 'pink')
                }
                let guildConfig = res[0].dataValues;
                delete guildConfig.guildId;
                this.config = guildConfig;
                this.prefix = guildConfig.prefix;
                this.lang = guildConfig.lang;
                this.color = guildConfig.embedColors;
                this.created = true;
                this.owners = guildConfig.owner.split(',');
                this.whitelisted = guildConfig.whitelisted.split(',');
                this.prefix = guildConfig.prefix;
            })
        }

        async fetchAntiraid() {
            await this.client.database.models.antiraid.findOrCreate({
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                if (res[0]._options.isNewRecord) {
                    Logger.log(`ANTIRAID : ${this.guildID}`, `ANTIRAID created`, 'red')

                } else {
                    Logger.log(`ANTIRAID : ${this.guildID}`, `Fetched`, 'pink')
                }
                let antiraidConfig = res[0].dataValues;
                delete antiraidConfig.guildId;
                this.antiraid = {enable: antiraidConfig};
            })
            await this.client.database.models.antiraidConfig.findOrCreate({
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                let antiraidConfig = res[0].dataValues;
                delete antiraidConfig.guildId;
                this.antiraid.config = antiraidConfig;
            }).catch(err => console.log(err))
            await this.client.database.models.antiraidWlBp.findOrCreate({
                where: {
                    guildId: this.guildID
                }
            }).then((res) => {
                let antiraidConfig = res[0].dataValues;
                delete antiraidConfig.guildId;
                this.antiraid.bypass = antiraidConfig;
            })
        }

        async deleteAllData(){
            await this.client.database.models.guildConfig.destroy({
                where: {
                    guildId: this.guildID
                }
            })
            await this.client.database.models.invite.destroy({
                where:{
                    guildId: this.guildID
                }
            })
            await this.client.database.models.warn.destroy({
                where:{
                    guildId: this.guildID
                }
            })
            await this.client.database.models.coins.destroy({
                where:{
                    guildId: this.guildID
                }
            })
            await this.client.database.models.antiraid.destroy({
                where:{
                    guildId: this.guildID
                }
            })
            await this.client.database.models.antiraidconfig.destroy({
                where:{
                    guildId: this.guildID
                }
            })
            await this.client.database.models.antiraidwlbp.destroy({
                where:{
                    guildId: this.guildID
                }
            })
            await this.client.database.models.coins.destroy({
                where:{
                    guildId: this.guildID
                }
            })
            await this.client.database.models.coinshop.destroy({
                where:{
                    guildId: this.guildID
                }
            })
            await this.client.database.models.giveaways.destroy({
                where:{
                    guildId: this.guildID
                }
            })
            await this.client.database.models.inventory.destroy({
                where:{
                    guildId: this.guildID
                }
            })
        }

        isGuildOwner(authorId) {
            return !!this.client.isOwner(authorId) || !!this.owners.includes(authorId)
        }

        isGuildWl(authorId) {
            return !!this.whitelisted.includes(authorId)
        }

    }

    return CustomGuild;

})
