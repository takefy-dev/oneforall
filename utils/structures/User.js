const { Structures } = require('discord.js')
const { Logger } = require('advanced-command-handler');
const StateManager = require('../../utils/StateManager');

Structures.extend('User', (User) => {
    class CustomUser extends User {
        constructor(client, data) {
            super(client, data);
            this.userId = data.id;
            this.bot = data.bot;
            this.blacklisted = null;
            this.playlists = null;
            this.fetchBlacklistedUsers();
            this.fetchPlaylist();

        }

        get blacklist () {
            return this.blacklisted;
        }

        get playlist () {
            return this.playlists;
        }

         async fetchBlacklistedUsers () {
            await StateManager.connection.query(`SELECT blacklisted, isOn FROM blacklist WHERE userId = '${this.userId}'`).then((res) => {
                if(res[0][0]){
                    this.blacklisted = {
                        enable: res[0][0].isOn === 1,
                        blacklisted: res[0][0].blacklisted.toString().split(',')
                    };
                }
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