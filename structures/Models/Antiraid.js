module.exports = (Sequelize, oneforall) => {
    try{
        oneforall.database.define('antiraid', {
            guildId: {
                type: Sequelize.STRING(25),
                allowNull: false,
                primaryKey: true
            },
            webhookUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            roleCreate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            roleUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            roleDelete: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            channelCreate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            channelUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            channelDelete: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            antiSpam: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            antiMassBan: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            antiBot: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            roleAdd: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            antiLink: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            antiDeco: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            antiKick: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            antiDc: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            regionUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            nameUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            vanityUpdate: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        })
        return oneforall.database.models

    }catch (e) {
        console.log(e)
    }
}