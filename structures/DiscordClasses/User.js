const { Structures } = require('discord.js')
const { Logger } = require('advanced-command-handler');

Structures.extend('User', (User) => {
    class CustomUser extends User {
        constructor(client, data) {
            super(client, data);
            this.user = data;
            this.bot = data.bot;
            if(this.bot) return;
            this.blacklist = null;
            this.playlists = null;
            this.fetchBlacklistedUsers();
            // this.fetchPlaylist();

        }

        get playlist () {
            return this.playlists;
        }

        async updateBlacklist(newArray){
            await this.client.database.models.blacklist.update({
                isOn : newArray.enable,
                blacklisted: newArray.blacklisted.toString()
            },{where: {userId : this.user.id}}).then((res) => {
                Logger.log(`Update ${this.user.username}`, 'BLACKLIST', 'blue')
                this.blacklist = {
                    enable : newArray.enable,
                    blacklisted: newArray.blacklisted
                }
                return this.blacklist


            })
        }


        async initBlacklist(enable){
            await this.client.database.models.blacklist.create({
                userId: this.user.id,
                isOn : enable
            }).then((res) => {
                Logger.log(`Created ${this.user.username}`, 'BLACKLIST', 'blue')
                const config =  res.dataValues;

                this.blacklist = {
                    enable : config.isOn,
                    blacklisted: config.blacklisted.split(',')
                }
            }).catch(err => console.log(err))
            return this.blacklist

        }


         async fetchBlacklistedUsers () {
           await this.client.database.models.blacklist.findOne({
               where: {
                   userId : this.user.id
               }
           }).then((res) => {
               if(res === null) return;
               const config =  res.dataValues;
               this.blacklist = {
                   enable : config.isOn,
                   blacklisted: config.blacklisted.split(',')
               }
               Logger.log(`Fetched ${this.user.username}`, 'BLACKLIST', 'blue')
           })
        }

        async fetchPlaylist () {
            await StateManager.connection.query(`SELECT playlist FROM playlist WHERE userId = '${this.userId}'`).then((res) =>{
                if(res[0][0]){
                    this.playlists = JSON.parse(res[0][0].playlist)
                }
            })
        }
    }
    return CustomUser
})