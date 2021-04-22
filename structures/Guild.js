const {Logger} = require("advanced-command-handler");
const {Collection} = require("discord.js");
const {Structures} = require('discord.js');

Structures.extend('Guild', (Guild) => {
    class CustomGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.prefix = client.config.prefix;
            this.guildID = data.id;
            this.lang = 'fr';
            this.owners = [''];
            this.config = null;
            this.color = '#36393f'
            this.coinsFarmer = new Collection();
            this.boost = {
                "stream" : 2,
                "default": 1,
                "mute":  0.5,
            }
            this.created = false;
            this.fetchConfig();

        }

        isGuildOwner(id){
            return !!this.owners.includes(id);
        };

        set updatePrefix(prefix){
            this.client.database.models.guildConfig.update(
                {
                    prefix

                },
                {
                    where:{
                        guildID: this.guildID
                    }
                }


            ).then(() =>{
                this.prefix = prefix;
            })
        }

        set updateOwner(newOwners){
            this.client.database.models.guildConfig.update(
                {
                    owners: newOwners.toString(),

                },
                {
                    where:{
                        guildID: this.guildID
                    }
                }


            ).then(() =>{
                this.owners = newOwners;
            })
        }

        set updateLogs(channelID){
            this.client.database.models.guildConfig.update(
                {
                    logs: channelID,

                },
                {
                    where:{
                        guildID: this.guildID
                    }
                }


            ).then(() =>{
                this.logs = channelID;
            })
        }

        async fetchConfig(){
            await this.client.database.models.guildConfig.findOrCreate({
                where: {
                    guildID : this.guildID
                }
            }).then((res) =>{
                if (res[0]._options.isNewRecord) {
                    Logger.log(`GUILD : ${this.guildID}`, `Guild created`, 'red')

                } else {
                    Logger.log(`GUILD : ${this.guildID}`, `Fetched`, 'pink')
                }
                let guildConfig = res[0].dataValues;
                delete guildConfig.guildID;
                this.config = guildConfig;
                this.prefix = guildConfig.prefix;
                this.lang = guildConfig.lang;
                this.color = guildConfig.color;
                this.created = true;
                this.owners = guildConfig.owners.split(',');
            })
        }



    }
    return CustomGuild
})