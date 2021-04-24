const { Structures } = require('discord.js')
const { Logger } = require('advanced-command-handler');
const StateManager = require('../../utils/StateManager');

Structures.extend('GuildMember', (Member) => {
    class CustomMember extends Member {
        constructor(client, data, guild){
            super(client,data,guild)
            this.user = data.user;
            this.guildId = guild.id;
            this.memberCoins = 0;
            this.memberInventory = null;
            this.fetchCoins();
            this.fetchInventory();
        }

        get coins () {
            return this.memberCoins;
        }

        get inventory () {
            return this.memberInventory;
        }

        async fetchCoins () {
            await StateManager.connection.query(`SELECT coins FROM coins WHERE guildId = '${this.guildId}' AND userId = '${this.user.id}'`).then((res) =>{
                if(res[0][0]){
                    this.memberCoins = res[0][0].coins
                }
            })
        }

        async fetchInventory () {
            await StateManager.connection.query(`SELECT inventory FROM inventory WHERE guildId = '${this.guildId}' AND userId = '${this.user.id}'`).then((res) =>{
                if(res[0][0]){
                    this.memberInventory = res[0][0].inventory;
                }
            })
        }


    }
    return CustomMember
})