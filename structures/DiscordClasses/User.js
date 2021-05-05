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
            this.blFetched = false;
            // this.fetchBlacklistedUsers();

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
            if(this.blFetched) return
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
               this.blFetched = true;
               Logger.log(`Fetched ${this.user.username}`, 'BLACKLIST', 'blue')
           })
        }


        async createBackup(backupId, guildName, guildData){
            await this.client.database.models.backup.create({
                backupId,
                guildData,
                guildName,
                userId: this.user.id
            }).then((res) => {
                if(res){
                    Logger.log(`Create ${this.user.username} : ${backupId}`, 'BACKUP', 'blue')
                    return true
                }else{
                    return false
                }
            })
        }

        async getBackup(backupId){
            const  backup = await this.client.database.models.backup.findOne({where: {backupId}})
            if(!backup) return null
            console.log(backup)
            return backup.get()
        }

        async deleteBackup(backupId){

            const res = await this.client.database.models.backup.destroy({
                where: {
                    backupId,
                    userId : this.user.id
                }
            })
            if(res === 1){
                Logger.log(`Destroy ${this.user.username} : ${backupId}`, 'BACKUP', 'blue')
                return true
            }else{
                return false
            }
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