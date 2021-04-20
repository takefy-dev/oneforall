const {Collection} = require("discord.js");
const {Structures} = require('discord.js');

Structures.extend('Guild', (Guild) => {
    class CustomGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.prefix = client.config.prefix;
            this.guildID = data.id;
            this.lang = 'fr';
            this.owners = ['188356697482330122'];
            this.config = null;
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
                    prefix: prefix,

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

        async fetchConfig(){
            await this.client.database.models.guildConfig.findOrCreate({
                where: {
                    guildID : this.guildID
                }
            }).then((res) =>{
                let guildConfig = res[0].dataValues;
                delete guildConfig.guildID;
                this.config = guildConfig
                this.prefix = guildConfig.prefix
                this.lang = guildConfig.lang
                this.created = true;
            })
        }



    }
    return CustomGuild
})