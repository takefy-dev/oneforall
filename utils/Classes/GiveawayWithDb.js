const {GiveawaysManager} = require("./discord-giveaways");

const GiveawayManagerWithOwnDatabase = (client) => class extends GiveawaysManager {
    // This function is called when the manager needs to get all giveaways which are stored in the database.


    // This function is called when the manager needs to get all the giveaway stored in the database.
    async getAllGiveaways() {

        return new Promise(function (resolve, reject) {
            client.database.models.giveaways.findAll({
                attributes: ['data']
            }).then(res => {
                const giveaways = res.map((row) => {
                    return row.get().data
                });
                resolve(giveaways);
            }).catch(err => console.log(err))


        });
    }

    // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
    async saveGiveaway(messageID, giveawayData) {
        return new Promise(function (resolve, reject) {
            client.database.models.giveaways.create({
                message_id: messageID,
                data: giveawayData
            }).then(() => {
                resolve(true)
            }).catch(err => console.log(err))

        });
    }

    async editGiveaway(messageID, giveawayData) {
        return new Promise(function (resolve, reject) {
            client.database.models.giveaways.update({
                data: giveawayData
            }, {
                where: {
                    message_id: messageID
                }
            }).then(() => {
                resolve(true)
            }).catch(err => console.log(err))

        });
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageID) {
        return new Promise(function (resolve, reject) {
            client.database.models.giveaways.destroy({
                where: {
                    message_id: messageID
                }
            }).then(() => {
                resolve(true)
            }).catch(err => console.log(err))

        });
    }
}

module.exports = GiveawayManagerWithOwnDatabase