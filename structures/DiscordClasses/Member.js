const {Structures} = require('discord.js')
const {Logger} = require('advanced-command-handler');
const StateManager = require('../../utils/StateManager');

Structures.extend('GuildMember', (Member) => {
    class CustomMember extends Member {
        constructor(client, data, guild) {
            super(client, data, guild)
            this.user = data.user;
            this.guildId = guild.id;
            this.warns = [];
            this.fetchWarns()

        }

        deleteWarn(){
            this.client.database.models.warn.destroy({where: {userId: this.user.id, guildId: this.guildId}}).then(res => this.warns = [])
        }

        set updateWarn(warn) {
            this.client.database.models.warn.findOrCreate({
                    where: {userId: this.user.id, guildId: this.guildId},
                    defaults: {warn: warn.toString()}
                }
            ).then(res => {
                if(!res[0]._options.isNewRecord){
                    this.client.database.models.warn.update({
                        warn : warn.toString()
                    }, {
                        where: {
                            userId : this.user.id,
                            guildId: this.guildId
                        }
                    }).then(() => {
                        this.warns = warn
                    })

                }
            })
        }


        async fetchWarns() {
            const warns = await this.client.database.models.warn.findOne({
                where: {
                    guildId: this.guildId,
                    userId: this.user.id
                }
            },{
                attributes: ['warn']
            })
            if (warns === null) return;
            this.warns = warns.dataValues.warn.split(',')
            Logger.log(`fetched ${this.user.username}`, `Fetched warns`, 'brown')
        }

    }

    return CustomMember
})