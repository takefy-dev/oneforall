class XpSystem {
    constructor(client) {
        this.client = client
        this.database = client.database;
        this.userManager = client.managers.userManager
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     */

    getOrCreateUser(userId, guildId) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        return this.userManager.getAndCreateIfNotExists(`${guildId}-${userId}`)
    }


    async appendXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = this.getOrCreateUser(userId, guildId)
        await user.addXp(parseInt(xp, 10));
        const userXp = user.get('xp')
        userXp.level = Math.floor(0.1 * Math.sqrt(userXp.xp));
        userXp.lastUpdated = new Date();
        user.set('xp', userXp).save().catch(e => console.log(`Failed to append xp: ${e}`));
        let tempXp = userXp.xp
        return (Math.floor(0.1 * Math.sqrt(tempXp -= xp)) < userXp.level);
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [levels] - Amount of levels to append.
     */

    async appendLevel(userId, guildId, levelss) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!levelss) throw new TypeError("An amount of levels was not provided.");

        const user = this.getOrCreateUser(userId, guildId)
        const userXp = user.get('xp')
        await user.addLvl(parseInt(levelss, 10));
        userXp.xp = user.level * user.level * 100;
        userXp.lastUpdated = new Date();
        user.set('xp', userXp).save().catch(e => console.log(`Failed to append level: ${e}`));
        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [xp] - Amount of xp to set.
     */

    async setXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = this.getOrCreateUser(userId, guildId)
        const userXp = user.get('xp')
        userXp.xp = xp;
        userXp.level = Math.floor(0.1 * Math.sqrt(user.xp));
        userXp.lastUpdated = new Date();
        user.set('xp', userXp).save().catch(e => console.log(`Failed to append level: ${e}`));
        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [level] - A level to set.
     */

    async setLevel(userId, guildId, level) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!level) throw new TypeError("A level was not provided.");

        const user = this.getOrCreateUser(userId, guildId)
        const userXp = user.get('xp')

        userXp.level = level;
        userXp.xp = level * level * 100;
        userXp.lastUpdated = new Date();
        user.set('xp', userXp).save().catch(e => console.log(`Failed to append level: ${e}`));
        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     */

    async fetch(userId, guildId, fetchPosition = false) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");

        const user =  this.getOrCreateUser(userId, guildId)
        const userXp = user.get('xp')
        if (fetchPosition === true) {
            const users = this.userManager.filter(user => user.where.guildId === guildId).sort((a, b) => b.get('xp').xp - a.get('xp').xp)
            const leaderboard = []
            users.forEach(user => {
                leaderboard.push({userId: user.where.userId, guildId: user.where.guildId, ...user.get('xp')})
            })

            userXp.position = leaderboard.findIndex(i => i.userId === userId) + 1;
        }


        /* To be used with canvacord or displaying xp in a pretier fashion, with each level the cleanXp stats from 0 and goes until cleanNextLevelXp when user levels up and gets back to 0 then the cleanNextLevelXp is re-calculated */
        userXp.cleanXp = userXp.xp - this.xpFor(userXp.level);
        userXp.cleanNextLevelXp = this.xpFor(userXp.level + 1) - this.xpFor(userXp.level);
        user.set('xp', userXp)
        return user.get('xp');
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [xp] - Amount of xp to subtract.
     */

    async subtractXp(userId, guildId, xp) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (xp == 0 || !xp || isNaN(parseInt(xp))) throw new TypeError("An amount of xp was not provided/was invalid.");

        const user = this.getOrCreateUser(userId, guildId)
        const userXp = user.get('xp')
        await user.removeXp(xp)
        userXp.level = Math.floor(0.1 * Math.sqrt(user.xp));
        userXp.lastUpdated = new Date();
        user.set('xp', userXp).save().catch(e => console.log(`Failed to subtract xp: ${e}`));
        return user;
    }

    /**
     * @param {string} [userId] - Discord user id.
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [levels] - Amount of levels to subtract.
     */

    async subtractLevel(userId, guildId, levelss) {
        if (!userId) throw new TypeError("An user id was not provided.");
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!levelss) throw new TypeError("An amount of levels was not provided.");

        const user = this.getOrCreateUser(userId, guildId)
        const userXp = user.get('xp')
        await user.removeLvl(levelss);
        userXp.xp = userXp.level * userXp.level * 100;
        userXp.lastUpdated = new Date();
        user.set('xp', userXp).save().catch(e => console.log(`Failed to subtract levels: ${e}`));
        return user;
    }

    /**
     * @param {string} [guildId] - Discord guild id.
     * @param {number} [limit] - Amount of maximum enteries to return.
     */


    async fetchLeaderboard(guildId, limit) {
        if (!guildId) throw new TypeError("A guild id was not provided.");
        if (!limit) throw new TypeError("A limit was not provided.");

        const users = this.userManager.filter(user => user.where.guildId === guildId).sort((a, b) => b.get('xp').xp - a.get('xp').xp)
        const leaderboard = []
        users.forEach(user => {
            leaderboard.push({userId: user.where.userId, guildId: user.where.guildId, ...user.get('xp')})
        })
        return leaderboard.slice(0, limit);
    }

    /**
     * @param {string} [client] - Your Discord.CLient.
     * @param {array} [leaderboard] - The output from 'fetchLeaderboard' function.
     */

    async computeLeaderboard(leaderboard, fetchUsers = false) {
        if (leaderboard.length < 1) return [];

        const computedArray = [];

        if (fetchUsers) {
            for (const key of leaderboard) {
                const user = await this.client.users.fetch(key.userId) || {username: "Unknown", discriminator: "0000"};
                computedArray.push({
                    guildID: key.guildId,
                    userId: key.userId,
                    xp: key.xp,
                    level: key.level,
                    position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
                    username: user.username,
                    discriminator: user.discriminator
                });
            }
        } else {
            leaderboard.map(key => computedArray.push({
                guildID: key.guildId,
                userId: key.userId,
                xp: key.xp,
                level: key.level,
                position: (leaderboard.findIndex(i => i.guildId === key.guildId && i.userId === key.userId) + 1),
                username: this.client.users.cache.get(key.userId) ? this.client.users.cache.get(key.userId).username : "Unknown",
                discriminator: this.client.users.cache.get(key.userId) ? this.client.users.cache.get(key.userId).discriminator : "0000"
            }));
        }

        return computedArray;
    }

    /*
    * @param {number} [targetLevel] - Xp required to reach that level.
    */
    xpFor(targetLevel) {
        if (isNaN(targetLevel) || isNaN(parseInt(targetLevel, 10))) throw new TypeError("Target level should be a valid number.");
        if (isNaN(targetLevel)) targetLevel = parseInt(targetLevel, 10);
        if (targetLevel < 0) throw new RangeError("Target level should be a positive number.");
        return targetLevel * targetLevel * 100;
    }

    /**
     * @param {string} [guildId] - Discord guild id.
     */

}

exports.XpSystem = XpSystem;
