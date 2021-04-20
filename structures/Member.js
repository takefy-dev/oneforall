const {Structures} = require('discord.js')
const {Logger} = require('advanced-command-handler');
Structures.extend('GuildMember', (Member) => {
    class CustomMember extends Member {
        constructor(client, data, guild) {
            super(client, data, guild)
            this.user = data.user;
            if (this.user.bot) return;
            this.register = false;
            this.guildId = guild.id;
            this.coins = 0;
            this.stats = {
                food: 100,
                health: 100
            }
            this.inventory = null;
            this.fetchAll();


        }

        set updateCoins(coins) {
            this.client.database.models.members.update(
                {
                    coins,
                },
                {
                    where: {
                        userID: this.user.id,
                        guildID: this.guildId
                    }
                }).then(() => {
                    this.coins = coins
            })
        }

        set updateHealth(health) {
            this.client.database.models.members.update(
                {
                    health,
                },
                {
                    where: {
                        userID: this.user.id,
                        guildID: this.guildId
                    }
                }).then(() => {
                this.stats.health = health
            })
        }

        set updateFood(food) {
            this.client.database.models.members.update(
                {
                    food,
                },
                {
                    where: {
                        userID: this.user.id,
                        guildID: this.guildId
                    }
                }).then(() => {
                this.stats.food = food
            })
        }



        get health() {
            return this.stats.health;
        }

        get food() {
            return this.stats.food;
        }


        async fetchAll() {
            await this.client.database.models.members.findOrCreate({
                where: {
                    guildID: this.guildId,
                    userID: this.user.id
                }
            }).then(res => {
                if (res[0]._options.isNewRecord) {
                    Logger.log(`${this.user.id}`, `Player created`, 'red')

                } else {
                    Logger.log(`${this.user.username}, ${this.user.id}`, `Fetched`, 'white')
                }
                const information = res[0].dataValues;
                this.coins = information.coins;
                this.stats = {
                    food: information.food,
                    health: information.health
                }
                this.inventory = information.inventory
                this.register = true

            })
        }


    }

    return CustomMember
})