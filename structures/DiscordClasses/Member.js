const {Structures} = require('discord.js')
const {Logger} = require('advanced-command-handler');
const StateManager = require('../../utils/StateManager');

Structures.extend('GuildMember', (Member) => {
    class CustomMember extends Member {
        constructor(client, data, guild) {
            super(client, data, guild)
            this.user = data.user;
            if (this.user.bot) return;
            this.guildId = guild.id;
            this.warns = [];
            this.invite = {join: 0, leave: 0, fake: 0, bonus: 0};
            this.inviter = null;
            this.fetched = false;
            this.coins = 0;
            this.fetchWarns()
            this.fetchWarns()
            this.fetchInvite()
            this.fetchCoins()
        }

        async fetchCoins(){
            await this.client.database.models.guildConfig.findOne({
                where:{
                    guildId: this.guildId
                }
            }).then(res => {
                const { dataValues } = res;
                const { coinsOn } = dataValues;
                if(!coinsOn) return;
                this.client.database.models.coins.findOrCreate({
                    where:{
                        userId: this.user.id,
                        guildId: this.guildId
                    }
                }).then((res) => {
                    const { dataValues } = res[0];
                    const { coins } = dataValues;
                    this.coins = coins

                })
            })
        }

        set updateCoins(coins) {
            this.client.database.models.coins.update(
                {
                    coins,
                },
                {
                    where: {
                        userId: this.user.id,
                        guildId: this.guildId
                    }
                }).then(() => {
                this.coins = coins
            })
        }

        deleteWarn() {
            this.client.database.models.warn.destroy({
                where: {
                    userId: this.user.id,
                    guildId: this.guildId
                }
            }).then(res => this.warns = [])
        }

        set updateWarn(warn) {
            this.client.database.models.warn.findOrCreate({
                    where: {userId: this.user.id, guildId: this.guildId},
                    defaults: {warn: warn.toString()}
                }
            ).then(res => {
                if (!res[0]._options.isNewRecord) {
                    this.client.database.models.warn.update({
                        warn: warn.toString()
                    }, {
                        where: {
                            userId: this.user.id,
                            guildId: this.guildId
                        }
                    }).then(() => {
                        this.warns = warn
                    })

                }
            })
        }

        set invitedBy(inviter) {
            this.client.database.models.invite.update({
                invitedBy: inviter
            }, {
                where: {
                    userId: this.user.id,
                    guildId: this.guildId
                }
            }).then(() => {
                this.inviter = inviter
            })
        }

        set updateInvite(newInvite) {
            this.client.database.models.invite.update({
                count: newInvite
            }, {
                where: {
                    userId: this.user.id,
                    guildId: this.guildId
                }
            }).then(() => {
                this.invite = newInvite
            })
        }

        clearMemberInvite(resetOnlyMember) {
            if (resetOnlyMember) {
                this.client.database.models.invite.update({
                    count: {join: 0, leave: 0, fake: 0, bonus: 0},
                }, {
                    where: {
                        guildId: this.guildId,
                        userId: this.user.id
                    }
                }).then(() => {
                    this.invite = {join: 0, leave: 0, fake: 0, bonus: 0};
                })
            } else {
                this.invite = {join: 0, leave: 0, fake: 0, bonus: 0}
            }
        }

        async fetchWarns() {
            const warns = await this.client.database.models.warn.findOne({
                where: {
                    guildId: this.guildId,
                    userId: this.user.id
                }
            }, {
                attributes: ['warn']
            })
            if (warns === null) return;
            this.warns = warns.dataValues.warn.split(',')
            Logger.log(`fetched ${this.user.username}`, `Fetched warns`, 'brown')
        }

        async fetchInvite() {
            if (!this.guild.config) return
            if (!this.guild.config.inviteOn) return;

            await this.client.database.models.invite.findOrCreate({
                where: {userId: this.user.id, guildId: this.guildId}
            }).then(res => {
                const {count, invitedBy} = res[0].dataValues;
                this.invite = count;
                this.inviter = invitedBy;
                Logger.log(`Fetch ${this.user.username}`, `Fetched INVITES`, 'grey')
            })
        }

    }

    return CustomMember
})